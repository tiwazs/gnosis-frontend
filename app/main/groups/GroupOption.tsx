import React from 'react'
import { IoTrashOutline } from 'react-icons/io5'
import { GiCheckMark } from 'react-icons/gi'
import { BsExclamationLg } from 'react-icons/bs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQueryClient } from 'react-query'

interface GroupOptionProps {
    groupId: string
    name: string
    description: string
    dataset: string
    accessToken: string
    className?: string
}

export default function GroupOption({groupId, name, description, dataset, accessToken, className}:GroupOptionProps) {
    const router = useRouter();
    // TODO: Remove this once use hook is fixed
    const queryClient = useQueryClient();

    const deleteGroup = async () => {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}`, {
                method: "DELETE",
                headers: {
                    "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
                },
            });
            console.log(`Response: ${JSON.stringify(response)}`);

            // TODO: Remove this once use hook is fixed
            //router.refresh();        
            queryClient.invalidateQueries('groups');
        }catch(e){
            console.log(`Error: ${e}`);
        }
  };

  return (
    <div className={`list-row ${className ?? ''} group`}>
        <Link href={`/main/groups/${groupId}`} className="min-w-0 flex-1">
            <div className='flex items-center gap-4 px-1 py-1'>
                <img className='h-11 w-11 rounded-full object-cover ring-1 ring-emerald-400/30' src="/no_avatar.webp" alt="" />
                <div className='min-w-0'>
                    <h5 className='truncate font-medium text-zinc-100'>{name}</h5>
                    <p className='truncate text-sm text-zinc-500'>{description}</p>
                </div>
            </div>
        </Link>
        <div className='flex shrink-0 items-center'>
            <span className="icon-btn opacity-0 group-hover:opacity-100" title={dataset ? 'Dataset ready' : 'Dataset missing'}>{dataset ? <GiCheckMark/> : <BsExclamationLg/> }</span>
            <button type="button" className="icon-btn opacity-0 hover:!text-red-300 group-hover:opacity-100" onClick={deleteGroup} aria-label="Delete group"><IoTrashOutline/></button>
        </div>
    </div>
  )
}
