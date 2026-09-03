'use client';

import { useRequireSession } from '../../../lib/useRequireSession';
import { Suspense } from 'react';
import GroupList from './GroupList';
import NewGroupDialog from './NewGroupDialog';

const GroupsPage = () => {
    //const { data: session, status } = useSession({ required: true });
    const { data: session, status } = useRequireSession();

    if(status === "loading" || status === "unauthenticated" || !session) return <div className="text-emerald-400/80">Loading...</div>  

    return (
        <div>              
            <div className="page-header">
                <div>
                    <p className="page-kicker">Library</p>
                    <h1 className="page-title">Groups</h1>
                </div>
                <NewGroupDialog userId={session.userId as string} accessToken={session.accessToken as string} />
            </div>
            <div className='space-y-3'>
                <Suspense fallback={<div className="text-emerald-400/80">Loading...</div>}>
                    <GroupList userId={session.userId as string} accessToken={session.accessToken as string} />
                </Suspense>
            </div>
        </div>
    );
};

export default GroupsPage;