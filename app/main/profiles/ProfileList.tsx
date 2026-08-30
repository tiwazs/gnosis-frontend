import { Profile } from '@prisma/client';
import React from 'react'
import { useQuery } from 'react-query';
import ProfileOption from './ProfileOption';

interface ProfilesProps {
    userId: string
    accessToken: string
}

const getProfiles = async (userId: string, accessToken: string) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/user/${userId}`, {
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

function ProfileList({userId, accessToken}: ProfilesProps) {
    // TODO: Remove this once use hook is fixed
    //const profiles = use( getProfiles(userId, accessToken) );
    const query = useQuery(["profiles",userId, accessToken], () => getProfiles(userId, accessToken) )
    if (query.isLoading) {
      return <h2 className="text-sm text-zinc-500">Loading...</h2>;
    }


    return (
        <>
            {query.data!.map( (profile) => (
                <div key={profile.id}>
                <ProfileOption
                    profileId={profile.id}
                    name={profile.name}
                    description={profile.bio!}
                    accessToken={accessToken}
                    coded={true}
                />
                </div>
            ))}
        </>
    );
}

export default ProfileList;