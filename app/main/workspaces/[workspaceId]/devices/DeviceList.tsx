import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { getDevicesByWorkspace } from "../../../../../services/deviceService";
import DeviceCard from "./DeviceCard";

interface DeviceListProps {
    workspaceId: string;
    search: string;
    jwt: string;
}

function DeviceList({ workspaceId, search, jwt }: DeviceListProps) {
    const query = useQuery(["devices", workspaceId, jwt], () => getDevicesByWorkspace(jwt, workspaceId), {
        enabled: Boolean(workspaceId && jwt),
    });

    const filtered = useMemo(() => {
        const devices = query.data ?? [];
        const term = search.trim().toLowerCase();
        if (!term) {
            return devices;
        }
        return devices.filter((device) => {
            const haystack = `${device.name} ${device.description ?? ""}`.toLowerCase();
            return haystack.includes(term);
        });
    }, [query.data, search]);

    if (query.isLoading) {
        return <h2 className="text-sm text-zinc-500">Loading...</h2>;
    }

    if (query.isError) {
        return (
            <div className="empty-state">
                {(query.error as Error).message || "Could not load devices"}
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="empty-state">
                {search.trim()
                    ? "No devices match that search."
                    : "No devices yet. Create one with the + button."}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((device) => (
                <DeviceCard key={device.id} device={device} workspaceId={workspaceId} jwt={jwt} />
            ))}
        </div>
    );
}

export default DeviceList;
