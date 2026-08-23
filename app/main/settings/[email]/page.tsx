'use client';

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSettings from "./UserSettings";

type PageProps = {
    params: {
        email: string;
    }
}

const SettingsPage = ({ params: { email } }: PageProps) => {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/login");
        },
    });
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const userId = session?.userId as string | undefined;
    const routeEmail = decodeURIComponent(email);

    useEffect(() => {
        if (!userId) return;
        fetch(`/api/user/${userId}`)
            .then(async (res) => {
                if (!res.ok) throw new Error("Could not load account");
                return res.json();
            })
            .then(setUser)
            .catch((e) => setError(e.message));
    }, [userId]);

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
