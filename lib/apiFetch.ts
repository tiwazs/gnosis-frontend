import { signOut } from "next-auth/react";

let signingOut = false;

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const response = await fetch(input, init);
    if (response.status !== 401) {
        return response;
    }
    if (typeof window !== "undefined" && !signingOut) {
        signingOut = true;
        await signOut({ callbackUrl: "/login" });
    }
    throw new Error("Unauthorized");
}
