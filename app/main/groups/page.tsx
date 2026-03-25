'use client';

import type { NextPage } from 'next'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import GroupList from './GroupList';
import NewGroupDialog from './NewGroupDialog';

const GroupsPage = () => {
    //const { data: session, status } = useSession({ required: true });
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login');
        },
    })
    const router = useRouter();

    if(status === "loading") return <div className="text-green-700">Loading...</div>  

    return (
        <div className="bg-[#221c28]">              
            <div className='flex justify-center'>
                <h5 className='text-lg'>Groups</h5>
            </div>
            <div className='flex'>
                <NewGroupDialog userId={session.userId as string} apikey={session.apikey as string} />
            </div>
            <div>
                <hr className="p-2 border-green-700" />
            </div>
            <div className=' space-y-4'>
                <Suspense fallback={<div className="text-green-700">Loading...</div>}>
                    <GroupList userId={session.userId as string} apikey={session.apikey as string} />
                </Suspense>
            </div>
        </div>
    );
};

export default GroupsPage;