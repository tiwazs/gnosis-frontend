'use client';

import { useRequireSession } from "../../../../lib/useRequireSession";
import { Suspense } from "react";
import GroupInfo from "./GroupInfo";

type GroupPageProps = {
    params: {
        groupId: string;
    }
}

const ProfilePage = ( {params: {groupId}}: GroupPageProps ) => {
    //const { data: session, status } = useSession({ required: true });
    const { data: session, status } = useRequireSession();

    if(status === "loading" || status === "unauthenticated" || !session) return <div className="text-emerald-400/80">Loading...</div>  

    return (
        <>                          
            <Suspense fallback={<div className="text-emerald-400/80">Loading...</div>}>
                <GroupInfo groupId={groupId} accessToken={session.accessToken as string} />
            </Suspense>
        </>
    );
};

export default ProfilePage;