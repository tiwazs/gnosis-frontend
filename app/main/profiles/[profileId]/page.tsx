'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import ProfileInfo from "./ProfileInfo";

type ProfilePageProps = {
    params: {
        profileId: string;
    }
}

const ProfilePage = ( {params: {profileId}}: ProfilePageProps ) => {
    //const { data: session, status } = useSession({ required: true });
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login');
        },
    })
    const router = useRouter();

    if(status === "loading") return <div className="text-emerald-400/80">Loading...</div>  

    return (
        <>                          
            <Suspense fallback={<div className="text-emerald-400/80">Loading...</div>}>
                <ProfileInfo profileId={profileId} apikey={session.apikey as string} />
            </Suspense>
        </>
    );
};

export default ProfilePage;