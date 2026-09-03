import { apiFetch } from "../lib/apiFetch";

export type Device = {
    id: string;
    workspace_id: string;
    name: string;
    description?: string | null;
    status: boolean;
    created_at?: string;
    updated_at?: string;
};

function gatewayBase() {
    return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

function iotUrl(path: string) {
    return `${gatewayBase()}/iot/${path.replace(/^\//, "")}`;
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

function errorMessage(data: unknown, fallback: string) {
    if (!data || typeof data !== "object") {
        return fallback;
    }
    const body = data as { error?: unknown; detail?: unknown };
    if (typeof body.error === "string") {
        return body.error;
    }
    if (typeof body.detail === "string") {
        return body.detail;
    }
    if (Array.isArray(body.detail) && body.detail[0] && typeof body.detail[0].msg === "string") {
        return body.detail[0].msg;
    }
    return fallback;
}

export async function getDevicesByWorkspace(jwt: string, workspaceId: string): Promise<Device[]> {
    const response = await apiFetch(
        iotUrl(`devices/workspace/${encodeURIComponent(workspaceId)}`),
        {
            method: "GET",
            credentials: "omit",
            headers: jwtHeaders(jwt),
        },
    );
    const data = await parseJson(response);
    if (!response.ok) {
        throw new Error(errorMessage(data, "Could not load devices"));
    }
    return Array.isArray(data) ? data : [];
}

export async function deleteDevice(jwt: string, deviceId: string): Promise<void> {
    const response = await apiFetch(iotUrl(`devices/${encodeURIComponent(deviceId)}`), {
        method: "DELETE",
        credentials: "omit",
        headers: jwtHeaders(jwt),
    });
    const data = await parseJson(response);
    if (!response.ok) {
        throw new Error(errorMessage(data, "Could not delete device"));
    }
}
