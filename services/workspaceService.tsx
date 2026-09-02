export type Workspace = {
    id: string;
    name: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
    description?: string;
};

function gatewayBase() {
    return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

function workspaceUrl(path: string) {
    return `${gatewayBase()}/workspace/${path.replace(/^\//, "")}`;
}

function jwtHeaders(jwt: string, json = false): HeadersInit {
    return {
        ...(json ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${jwt}`,
    };
}

async function parseJson(response: Response) {
    const text = await response.text();
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

export async function getWorkspaces(jwt: string): Promise<Workspace[]> {
    const response = await fetch(workspaceUrl("workspaces"), {
        method: "GET",
        credentials: "omit",
        headers: jwtHeaders(jwt),
    });
    const data = await parseJson(response);
    if (!response.ok) {
        const message = data && typeof data.error === "string" ? data.error : "Could not load workspaces";
        throw new Error(message);
    }
    return Array.isArray(data) ? data : [];
}

export async function getWorkspace(jwt: string, id: string): Promise<Workspace | null> {
    const workspaces = await getWorkspaces(jwt);
    return workspaces.find((workspace) => workspace.id === id) ?? null;
}

export async function createWorkspace(jwt: string, name: string): Promise<Workspace> {
    const response = await fetch(workspaceUrl("workspaces"), {
        method: "POST",
        credentials: "omit",
        headers: jwtHeaders(jwt, true),
        body: JSON.stringify({ name }),
    });
    const data = await parseJson(response);
    if (!response.ok) {
        const message = data && typeof data.error === "string" ? data.error : "Could not create workspace";
        throw new Error(message);
    }
    return data as Workspace;
}
