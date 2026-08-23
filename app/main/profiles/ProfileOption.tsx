import React from 'react'
import { IoTrashOutline } from 'react-icons/io5'
import { GiCheckMark } from 'react-icons/gi'
import { BsExclamationLg } from 'react-icons/bs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQueryClient } from 'react-query'

interface ProfileOptionProps {
    profileId: string
    name: string
    description: string
    coded: boolean
    apikey: string
    className?: string
}

export default function ProfileOption({profileId, name, description, coded, apikey, className}:ProfileOptionProps) {
    const router = useRouter();
    // TODO: Remove this once use hook is fixed
    const queryClient = useQueryClient();

    const deleteProfile = async () => {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${profileId}`, {
                method: "DELETE",
                headers: {
                    "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
                },
            });
            console.log(`Response: ${JSON.stringify(response)}`);

            // TODO: Remove this once use hook is fixed
            //router.refresh();        
            queryClient.invalidateQueries('profiles');
        }catch(e){
            console.log(`Error: ${e}`);
        }
  };

  return (
    <div className={`list-row ${className ?? ''} group`}>
        <Link href={`/main/profiles/${profileId}`} className="min-w-0 flex-1">
            <div className='flex items-center gap-4 px-1 py-1'>
                <img className='h-11 w-11 rounded-full object-cover ring-1 ring-emerald-400/30' src="/no_avatar.webp" alt="" />
                <div className='min-w-0'>
                    <h5 className='truncate font-medium text-zinc-100'>{name}</h5>
                    <p className='truncate text-sm text-zinc-500'>{description}</p>
                </div>
            </div>
        </Link>
        <div className='flex shrink-0 items-center'>
            <span className="icon-btn opacity-0 group-hover:opacity-100">{coded ? <GiCheckMark/> : <BsExclamationLg/> }</span>
            <button type="button" className="icon-btn opacity-0 hover:!text-red-300 group-hover:opacity-100" onClick={deleteProfile} aria-label="Delete profile"><IoTrashOutline/></button>
        </div>
    </div>
  )
}
