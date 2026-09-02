'use client';

import { useRequireSession } from "../../../../lib/useRequireSession";
import { Suspense } from "react";
import ProfileInfo from "./ProfileInfo";

type ProfilePageProps = {
    params: {
        profileId: string;
    }
}

const ProfilePage = ( {params: {profileId}}: ProfilePageProps ) => {
    //const { data: session, status } = useSession({ required: true });
    const { data: session, status } = useRequireSession();

    if(status === "loading" || status === "unauthenticated") return <div className="text-emerald-400/80">Loading...</div>  

    return (
        <>                          
            <Suspense fallback={<div className="text-emerald-400/80">Loading...</div>}>
                <ProfileInfo profileId={profileId} accessToken={session.accessToken as string} />
            </Suspense>
        </>
    );
};

export default ProfilePage;