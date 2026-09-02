import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "../../../lib/prisma";

function gatewayBase() {
    return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

async function bearerFor(req: NextApiRequest): Promise<string | undefined> {
    const token = await getToken({ req });
    if (!token) {
        return undefined;
    }
    if (typeof token.accessToken === "string" && token.accessToken) {
        return token.accessToken;
    }
    const userId = (token.uid || token.sub) as string | undefined;
    if (!userId) {
        return undefined;
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.apiKey || undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = await bearerFor(req);
    if (!accessToken) {
        return res.status(401).json({
            error: "No API token in session. Sign out and sign in with email, or generate an API key in settings.",
        });
    }

    const parts = req.query.path;
    const path = Array.isArray(parts) ? parts.join("/") : String(parts || "");
    const search = req.url && req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    const url = `${gatewayBase()}/workspace/${path}${search}`;

    const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
    };
    if (req.headers["content-type"]) {
        headers["Content-Type"] = String(req.headers["content-type"]);
    }

    const init: RequestInit = { method: req.method, headers };
    if (req.method && !["GET", "HEAD"].includes(req.method) && req.body !== undefined) {
        init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    try {
        const upstream = await fetch(url, init);
        const text = await upstream.text();
        const contentType = upstream.headers.get("content-type");
        if (contentType) {
            res.setHeader("Content-Type", contentType);
        }
        res.status(upstream.status).send(text);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Upstream request failed";
        res.status(502).json({ error: message });
    }
}
