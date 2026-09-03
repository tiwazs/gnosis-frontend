"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function jwtIsUnusable(token?: string): boolean {
    if (!token || token === "undefined" || token.split(".").length !== 3) {
        return true;
    }
    try {
        const padded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/") + "===".slice((token.split(".")[1].length + 3) % 4);
        const payload = JSON.parse(atob(padded)) as { exp?: number };
        if (typeof payload.exp !== "number") {
            return true;
        }
        return payload.exp * 1000 < Date.now() + 60_000;
    } catch {
        return true;
    }
}

export function useRequireSession() {
    const router = useRouter();
    const session = useSession();
    const accessToken = session.data?.accessToken;
    const tokenUnusable = session.status === "authenticated" && jwtIsUnusable(accessToken);

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/login");
            return;
        }
        if (tokenUnusable) {
            signOut({ callbackUrl: "/login" });
        }
    }, [session.status, tokenUnusable, router]);

    return session;
}
