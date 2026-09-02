import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { getWorkspaces } from "../../services/workspaceService";
import WorkspaceCard from "./WorkspaceCard";

interface WorkspaceListProps {
    search: string;
    jwt: string;
}

function WorkspaceList({ search, jwt }: WorkspaceListProps) {
    const query = useQuery(["workspaces", jwt], () => getWorkspaces(jwt));

    const filtered = useMemo(() => {
        const workspaces = query.data ?? [];
        const term = search.trim().toLowerCase();
        if (!term) {
            return workspaces;
        }
        return workspaces.filter((workspace) => workspace.name.toLowerCase().includes(term));
    }, [query.data, search]);

    if (query.isLoading) {
        return <h2 className="text-sm text-zinc-500">Loading...</h2>;
    }

    if (query.isError) {
        return (
            <div className="empty-state">
                {(query.error as Error).message || "Could not load workspaces"}
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="empty-state">
                {search.trim()
                    ? "No workspaces match that search."
                    : "No workspaces yet. Create one with the + button."}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
        </div>
    );
}

export default WorkspaceList;
