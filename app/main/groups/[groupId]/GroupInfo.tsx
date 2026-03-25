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
    apikey: string
}   

const getGroup = async (groupId: string, apikey: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
        }})
    const group: Group = await response.json();
    return group;
}

export default function GroupInfo( {groupId, apikey} : GroupInfoProps ) {
    const [ showing, setShowing ] = useState(false);

    const query = useQuery(["group",groupId, apikey], () => getGroup(groupId, apikey) )
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
                'Authorization': apikey
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
                'Authorization': apikey
            }})
        const group: Group = await response.json();
        queryClient.invalidateQueries('group');
        return group;
    }
    
    return (
        <div className='flex flex-col md:grid md:grid-cols-4 gap-4'>
            <div className='md:col-span-1'>
                <h2 className='text-gray-200 text-4xl'>{capitalize(query.data!.name)}</h2>
                <p className=' my-4 text-gray-400 text-sm'>{query.data!.description}</p>
                <div className=''>
                    <div className='flex justify-between items-center'>
                        <h5 className='text-gray-200 text-2xl'>Dataset</h5>
                        <h5 className='my-2 text-gray-300 p-1'>{query.data!.dataset ? <span className='bg-green-700 rounded-lg p-1'>Generated<GiCheckMark className='inline-flex'/></span> :
                                                                                <span className='bg-yellow-700 rounded-lg p-1'>Pending<BsExclamationLg className='inline-flex'/></span>  } 
                        </h5>
                    </div>
                    <div className='flex justify-around'>
                        <h5 className="rounded-lg p-2 bg-[#2b2532] hover:bg-[#3f3847]
                                    active:translate-y-1 text-lg cursor-pointer text-gray-300 inline-flex " onClick={generateDataset}>Generate <BiBarcodeReader/></h5>
                        <h5 className="rounded-lg p-2 bg-[#2b2532] hover:bg-[#3f3847]
                                    active:translate-y-1 text-xl cursor-pointer text-gray-300 inline-flex" onClick={deleteDataset}>Delete <IoTrashOutline/></h5>
                    </div>
                </div>
            </div>
            <div className='md:col-span-3'>
                <h2 className='text-gray-200 text-2xl'>Profiles</h2>
                <AddProfileToGroupDialog  apikey={apikey} groupId={groupId} />
                <div>
                    <hr className="p-2 border-green-700" />
                    <ProfileList groupId={groupId} apikey={apikey} />
                </div>
            </div>
        </div>
    )
}
