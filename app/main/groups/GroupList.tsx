import { Group } from '@prisma/client';
import React from 'react'
import { useQuery } from 'react-query';
import GroupOption from './GroupOption';

interface GroupsProps {
    userId: string
    accessToken: string
}

const getGroups = async (userId: string, accessToken: string) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/user/${userId}`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
            }})
        const groups: Group[] = await response.json();
        return groups;
    }catch(e){
        console.log(`Error: ${e}`);
        return [];
    }
}

function GroupList({userId, accessToken}: GroupsProps) {
    // TODO: Remove this once use hook is fixed
    //const profiles = use( getProfiles(userId, accessToken) );
    const query = useQuery(["groups",userId, accessToken], () => getGroups(userId, accessToken) )
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
                    accessToken={accessToken} 
                />
                </div>
            ))}
        </>
    );
}

export default GroupList;