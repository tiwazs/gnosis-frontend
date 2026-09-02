"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Redirects to login after render. Do not use useSession({ required: true }) — it aborts App Router pages. */
export function useRequireSession() {
    const router = useRouter();
    const session = useSession();

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/login");
        }
    }, [session.status, router]);

    return session;
}
