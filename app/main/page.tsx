'use client';

import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useRequireSession } from '../../lib/useRequireSession';
import NewWorkspaceDialog from './NewWorkspaceDialog';
import WorkspaceList from './WorkspaceList';

const WorkspacesPage = () => {
    const [search, setSearch] = useState('');
    const { data: session, status } = useRequireSession();

    if (status === 'loading' || status === 'unauthenticated' || !session?.accessToken) {
        return <div className="text-emerald-400/80">Loading...</div>;
    }

    const jwt = session.accessToken;

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="page-kicker">Overview</p>
                    <h1 className="page-title">Workspaces</h1>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <label className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
                        <span className="sr-only">Search workspaces</span>
                        <IoSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            className="input-field pl-9"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search workspaces"
                        />
                    </label>
                    <NewWorkspaceDialog jwt={jwt} />
                </div>
            </div>
            <WorkspaceList search={search} jwt={jwt} />
        </div>
    );
};

export default WorkspacesPage;
