import { Group } from '@prisma/client';
import React from 'react'
import { useQuery } from 'react-query';
import GroupOption from './GroupOption';

interface GroupsProps {
    userId: string
    apikey: string
}

const getGroups = async (userId: string, apikey: string) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/user/${userId}`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
            }})
        const groups: Group[] = await response.json();
        return groups;
    }catch(e){
        console.log(`Error: ${e}`);
        return [];
    }
}

function GroupList({userId, apikey}: GroupsProps) {
    // TODO: Remove this once use hook is fixed
    //const profiles = use( getProfiles(userId, apikey) );
    const query = useQuery(["groups",userId, apikey], () => getGroups(userId, apikey) )
    if (query.isLoading) {
      return <h2 className="text-sm text-zinc-500">Loading...</h2>;
    }


    return (
        <>
            {query.data!.map( (group) => (
                <div key={group.id}>
                <GroupOption
                    groupId={group.id}
                    name={group.name}
                    description={group.description!}
                    dataset={group.dataset!}
                    apikey={apikey} 
                />
                </div>
            ))}
        </>
    );
}

export default GroupList;