'use client';

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRequireSession } from "../../../../lib/useRequireSession";
import UserSettings from "./UserSettings";

type PageProps = {
    params: {
        email: string;
    }
}

const SettingsPage = ({ params: { email } }: PageProps) => {
    const { data: session, status } = useRequireSession();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const userId = session?.userId as string | undefined;
    const routeEmail = decodeURIComponent(email);

    const jwt = session?.accessToken;
    const gateway = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

    useEffect(() => {
        if (!userId || !jwt) return;
        fetch(`${gateway}/api/user/id/${userId}`, {
            method: "GET",
            credentials: "omit",
            headers: { Authorization: `Bearer ${jwt}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Could not load account");
                return res.json();
            })
            .then(setUser)
            .catch((e) => setError(e.message));
    }, [userId, jwt, gateway]);

    if (status === "loading" || (!user && !error)) {
        return <div className="text-sm text-zinc-500">Loading account…</div>;
    }

    if (error || !user) {
        return <div className="text-sm text-red-400">{error ?? "Account not found"}</div>;
    }

    if (user.email !== routeEmail && session?.user?.email !== user.email) {
        return <div className="text-sm text-zinc-400">Not allowed</div>;
    }

    return <UserSettings user={user} />;
};

export default SettingsPage;
