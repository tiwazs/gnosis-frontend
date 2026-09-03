import { apiFetch } from "../lib/apiFetch";

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
    const response = await apiFetch(workspaceUrl("workspaces"), {
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

export type RegistrationToken = {
    token: string;
    workspace_id: string;
    created_by: string;
    expires_at: string;
    used: boolean;
};

export async function createDeviceRegistrationToken(
    jwt: string,
    workspaceId: string,
): Promise<RegistrationToken> {
    const response = await apiFetch(
        workspaceUrl(`workspaces/${encodeURIComponent(workspaceId)}/devices/token`),
        {
            method: "POST",
            credentials: "omit",
            headers: jwtHeaders(jwt, true),
        },
    );
    const data = await parseJson(response);
    if (!response.ok) {
        const message = data && typeof data.error === "string" ? data.error : "Could not generate pairing token";
        throw new Error(message);
    }
    return data as RegistrationToken;
}

export async function createWorkspace(jwt: string, name: string): Promise<Workspace> {
    const response = await apiFetch(workspaceUrl("workspaces"), {
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
