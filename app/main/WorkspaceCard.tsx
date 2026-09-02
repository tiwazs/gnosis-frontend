import React from "react";
import type { Workspace } from "../../services/workspaceService";

interface WorkspaceCardProps {
    workspace: Workspace;
}

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
    const created = formatDate(workspace.created_at);

    return (
        <article className="card card-hover flex min-h-[140px] flex-col justify-between">
            <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/80">
                    Workspace
                </p>
                <h2 className="mt-2 truncate text-lg font-semibold text-zinc-100">{workspace.name}</h2>
            </div>
            {created ? (
                <p className="mt-4 text-sm text-zinc-500">Created {created}</p>
            ) : (
                <p className="mt-4 text-sm text-zinc-500">Ready to use</p>
            )}
        </article>
    );
}
