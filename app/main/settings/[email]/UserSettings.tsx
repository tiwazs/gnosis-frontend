'use client'

import { User } from "@prisma/client";
import SettingField from "./SettingField";
import { useSession } from "next-auth/react";
import ApiKeyFormCard from "./ApiKeyFormCard";

interface SettingsProps {
    user: User;
}

const UserSettings = ({ user }: SettingsProps) => {
    const { data: session, status } = useSession({ required: true });
    const sessionEmail = session?.user?.email || (session as any)?.userEmail;
    const ownsAccount = sessionEmail === user.email;

    if (status === "loading") {
        return <div className="text-sm text-zinc-500">Loading account…</div>;
    }

    if (!ownsAccount) {
        return (
            <div className="card max-w-lg">
                <p className="page-kicker">Account</p>
                <h1 className="page-title">Not allowed</h1>
                <p className="mt-2 text-sm text-zinc-500">You can only edit your own settings.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="page-header">
                <div>
                    <p className="page-kicker">Account</p>
                    <h1 className="page-title">Settings</h1>
                    <p className="mt-2 text-sm text-zinc-500">Name, email, password, and API key for this workspace.</p>
                </div>
            </div>

            <div className="mb-8 flex items-center gap-4">
                <img
                    className="h-14 w-14 rounded-full object-cover ring-1 ring-white/10"
                    src={user.image || "/no_avatar.webp"}
                    alt=""
                />
                <div>
                    <p className="font-medium text-zinc-100">{user.name || "Unnamed"}</p>
                    <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
            </div>

            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">Profile</h3>
            <SettingField
                userId={user.id}
                label="Username"
                field="name"
                value={user.name ?? ""}
                description="Shown in the app header and on your account menu."
            />
            <SettingField
                userId={user.id}
                label="First name"
                field="firstName"
                value={user.firstName ?? ""}
                description="Optional given name."
            />
            <SettingField
                userId={user.id}
                label="Last name"
                field="lastName"
                value={user.lastName ?? ""}
                description="Optional family name."
            />
            <SettingField
                userId={user.id}
                label="Email"
                field="email"
                value={user.email ?? ""}
                description="Used to sign in and receive account mail."
            />

            <h3 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wide text-zinc-400">Security</h3>
            <SettingField
                userId={user.id}
                label="Password"
                field="password"
                value=""
                password
                description={user.password ? "Set a new password. Leave unused if you only sign in with GitHub." : "No password yet. Add one to sign in with email as well as GitHub."}
            />

            <h3 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wide text-zinc-400">API</h3>
            <ApiKeyFormCard
                id={user.id}
                displayOption="API key"
                value={user.apiKey || (session as any)?.apikey || ""}
                description="Sent as Authorization on live stream and dataset requests to the main API."
            />
        </div>
    );
};

export default UserSettings;
