'use client';

import React, { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useQueryClient } from "react-query";
import { deleteDevice, type Device } from "../../../../../services/deviceService";

interface DeviceCardProps {
    device: Device;
    workspaceId: string;
    jwt: string;
}

export default function DeviceCard({ device, workspaceId, jwt }: DeviceCardProps) {
    const queryClient = useQueryClient();
    const [busy, setBusy] = useState(false);

    const onDelete = async () => {
        if (busy) {
            return;
        }
        setBusy(true);
        try {
            await deleteDevice(jwt, device.id);
            queryClient.invalidateQueries(["devices", workspaceId]);
        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            setBusy(false);
        }
    };

    return (
        <article className="card card-hover group flex min-h-[140px] flex-col justify-between">
            <div>
                <div className="flex items-start justify-between gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                        Device
                    </p>
                    <div className="flex items-center gap-1">
                        <span className={device.status ? "pill-ok" : "pill-warn"}>
                            {device.status ? "Online" : "Offline"}
                        </span>
                        <button
                            type="button"
                            className="icon-btn hover:!text-red-300"
                            onClick={onDelete}
                            disabled={busy}
                            aria-label="Delete device"
                        >
                            <IoTrashOutline />
                        </button>
                    </div>
                </div>
                <h2 className="mt-2 truncate text-lg font-semibold text-zinc-100">{device.name}</h2>
            </div>
            <p className="mt-4 truncate text-sm text-zinc-500">
                {device.description?.trim() || "No description"}
            </p>
        </article>
    );
}
