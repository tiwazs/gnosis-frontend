'use client'

import { Group } from '@prisma/client'
import React, { useState } from 'react'
import { BiBarcodeReader } from 'react-icons/bi'
import { BsExclamationLg } from 'react-icons/bs'
import { GiCheckMark } from 'react-icons/gi'
import { IoTrashOutline } from 'react-icons/io5'
import { useQuery, useQueryClient } from 'react-query'
import AddProfileToGroupDialog from './AddProfileToGroupDialog'
import ProfileList from './ProfileList'

interface GroupInfoProps {
    groupId: string
    accessToken: string
}   

const getGroup = async (groupId: string, accessToken: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
        }})
    const group: Group = await response.json();
    return group;
}

export default function GroupInfo( {groupId, accessToken} : GroupInfoProps ) {
    const [ showing, setShowing ] = useState(false);

    const query = useQuery(["group",groupId, accessToken], () => getGroup(groupId, accessToken) )
    const queryClient = useQueryClient();
    if (query.isLoading) {
      return <h2>Loading...</h2>;
    }

    const capitalize = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const generateDataset = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/dataset/${groupId}`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
            }})
        const group: Group = await response.json();
        queryClient.invalidateQueries('group');
        return group;
    }

    const deleteDataset = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/dataset/${groupId}`, {
            method: 'PUT',
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
            }})
        const group: Group = await response.json();
        queryClient.invalidateQueries('group');
        return group;
    }
    
    return (
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            <div className='md:col-span-1'>
                <p className="page-kicker">Group</p>
                <h2 className='page-title'>{capitalize(query.data!.name)}</h2>
                <p className='mt-3 text-sm leading-relaxed text-zinc-400'>{query.data!.description}</p>
                <div className='card mt-6'>
                    <div className='mb-4 flex items-center justify-between gap-2'>
                        <h5 className='text-sm font-medium text-zinc-200'>Dataset</h5>
                        {query.data!.dataset ? <span className='pill-ok'>Ready <GiCheckMark className='inline'/></span> :
                                                                                <span className='pill-warn'>Pending <BsExclamationLg className='inline'/></span>  }
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <button type="button" className="btn-secondary text-sm" onClick={generateDataset}>Generate <BiBarcodeReader/></button>
                        <button type="button" className="btn-secondary text-sm" onClick={deleteDataset}>Delete <IoTrashOutline/></button>
                    </div>
                </div>
            </div>
            <div className='md:col-span-3'>
                <div className="page-header">
                    <h2 className='text-lg font-semibold text-zinc-100'>Profiles</h2>
                    <AddProfileToGroupDialog  accessToken={accessToken} groupId={groupId} />
                </div>
                <ProfileList groupId={groupId} accessToken={accessToken} />
            </div>
        </div>
    )
}
