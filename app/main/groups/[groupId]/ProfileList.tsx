import { Profile } from '@prisma/client';
import React from 'react'
import { useQuery } from 'react-query';
import ProfileOption from './ProfileOption';

interface ProfilesProps {
    groupId: string
    accessToken: string
}

const getProfiles = async (groupId: string, accessToken: string) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/group/${groupId}`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
            }})
        const profiles: Profile[] = await response.json();
        return profiles;
    }catch(e){
        console.log(`Error: ${e}`);
        return [];
    }
}

function ProfileList({groupId, accessToken}: ProfilesProps) {
    // TODO: Remove this once use hook is fixed
    //const profiles = use( getProfiles(userId, accessToken) );
    const query = useQuery(["group-profiles",groupId, accessToken], () => getProfiles(groupId, accessToken) )
    if (query.isLoading) {
      return <h2>Loading...</h2>;
    }


    return (
        <div>
            {query.data!.map( (profile) => (
                <div key={profile.id} className="my-2">
                <ProfileOption
                    profileId={profile.id}
                    groupId={groupId}
                    name={profile.name}
                    description={profile.bio!}
                    accessToken={accessToken}
                    coded={true}
                />
                </div>
            ))}
        </div>
    );
}

export default ProfileList;