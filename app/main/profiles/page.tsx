'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileList from "./ProfileList";
import { IoAddSharp } from 'react-icons/io5';
import { Suspense } from "react";
import NewProfileDialog from "./NewProfileDialog";

const ProfilesPage = () => {
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
        <div>              
            <div className="page-header">
                <div>
                    <p className="page-kicker">Library</p>
                    <h1 className="page-title">Profiles</h1>
                </div>
                <NewProfileDialog userId={session.userId as string} apikey={session.apikey as string} />
            </div>
            <div className='space-y-3'>
                <Suspense fallback={<div className="text-emerald-400/80">Loading...</div>}>
                    <ProfileList userId={session.userId as string} apikey={session.apikey as string} />
                </Suspense>
            </div>
        </div>
    );
};

export default ProfilesPage;