'use client';

import { useParams } from "next/navigation";
import { useRequireSession } from "../../../../../lib/useRequireSession";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import DeviceList from "./DeviceList";
import NewDeviceDialog from "./NewDeviceDialog";

export default function DevicesPage() {
    const params = useParams();
    const workspaceId = String(params.workspaceId || "");
    const [search, setSearch] = useState("");

    const { data: session, status } = useRequireSession();

    if (status === "loading" || status === "unauthenticated") {
        return <div className="text-emerald-400/80">Loading...</div>;
    }

    const jwt = session?.accessToken;

    if (!jwt) {
        return (
            <div className="empty-state">
                Missing JWT. Sign out and sign in again.
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="page-kicker">Resources</p>
                    <h1 className="page-title">Devices</h1>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <label className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
                        <span className="sr-only">Search devices</span>
                        <IoSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            className="input-field pl-9"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search devices"
                        />
                    </label>
                    <NewDeviceDialog workspaceId={workspaceId} jwt={jwt} />
                </div>
            </div>
            <DeviceList workspaceId={workspaceId} search={search} jwt={jwt} />
        </div>
    );
}
