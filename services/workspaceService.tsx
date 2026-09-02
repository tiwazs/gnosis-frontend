export type Workspace = {
    id: string;
    name: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
    description?: string;
};

export async function getWorkspace(id: string): Promise<Workspace | null> {
    const workspaces = await getWorkspaces();
    return workspaces.find((workspace) => workspace.id === id) ?? null;
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

function workspaceUrl(path: string) {
    return `/api/workspace/${path.replace(/^\//, "")}`;
}

export async function getWorkspaces(): Promise<Workspace[]> {
    const response = await fetch(workspaceUrl("workspaces"), {
        method: "GET",
        credentials: "same-origin",
    });
    const data = await parseJson(response);
    if (!response.ok) {
        const message = data && typeof data.error === "string" ? data.error : "Could not load workspaces";
        throw new Error(message);
    }
    return Array.isArray(data) ? data : [];
}

export async function createWorkspace(name: string): Promise<Workspace> {
    const response = await fetch(workspaceUrl("workspaces"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    const data = await parseJson(response);
    if (!response.ok) {
        const message = data && typeof data.error === "string" ? data.error : "Could not create workspace";
        throw new Error(message);
    }
    return data as Workspace;
}
