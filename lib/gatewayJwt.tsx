import { createHmac } from "crypto";

const JWT_TTL_SEC = 60 * 60;

function tokenSecret(): string | undefined {
    return process.env.TOKEN_KEY || process.env.NEXTAUTH_SECRET || undefined;
}

function base64url(value: string | Buffer): string {
    return Buffer.from(value)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function payloadFromJwt(token: string): { exp?: number } | null {
    try {
        const part = token.split(".")[1];
        if (!part) {
            return null;
        }
        const padded = part.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((part.length + 3) % 4);
        return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    } catch {
        return null;
    }
}

export function isGatewayJwtExpired(token?: string): boolean {
    if (!token || token.split(".").length !== 3) {
        return true;
    }
    const payload = payloadFromJwt(token);
    if (!payload || typeof payload.exp !== "number") {
        return true;
    }
    return payload.exp * 1000 < Date.now() + 60_000;
}

/** Same claims as gnosis-main-service AuthenticationService.signToken. */
export function signGatewayJwt(userId: string, email: string): string | undefined {
    const secret = tokenSecret();
    if (!secret || !userId) {
        return undefined;
    }
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = base64url(
        JSON.stringify({
            userId,
            email: email || "",
            iat: now,
            exp: now + JWT_TTL_SEC,
        }),
    );
    const signature = base64url(
        createHmac("sha256", secret).update(`${header}.${payload}`).digest(),
    );
    return `${header}.${payload}.${signature}`;
}

export function ensureGatewayJwt(userId: string, email: string, current?: string): string | undefined {
    if (current && !isGatewayJwtExpired(current)) {
        return current;
    }
    return signGatewayJwt(userId, email) || current;
}
