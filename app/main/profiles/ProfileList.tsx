import { Profile } from '@prisma/client';
import React from 'react'
import { useQuery } from 'react-query';
import ProfileOption from './ProfileOption';

interface ProfilesProps {
    userId: string
    apikey: string
}

const getProfiles = async (userId: string, apikey: string) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/user/${userId}`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
            }})
        const profiles: Profile[] = await response.json();
        return profiles;
    }catch(e){
        console.log(`Error: ${e}`);
        return [];
    }
}

function ProfileList({userId, apikey}: ProfilesProps) {
    // TODO: Remove this once use hook is fixed
    //const profiles = use( getProfiles(userId, apikey) );
    const query = useQuery(["profiles",userId, apikey], () => getProfiles(userId, apikey) )
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
                    apikey={apikey}
                    coded={true}
                />
                </div>
            ))}
        </>
    );
}

export default ProfileList;