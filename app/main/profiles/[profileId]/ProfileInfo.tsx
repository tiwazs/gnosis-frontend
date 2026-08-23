import { useEffect, useState } from 'react';
import ImageList from './ImageList'
import NewImageDialog from './NewImageDialog'

interface Profile {
    name: string;
    bio: string;
}

interface ProfileInfoProps {
    profileId: string
    apikey: string
}

const getProfile = async (profileId: string, apikey: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${profileId}`, {
        method: 'GET',
        headers: {
            "ngrok-skip-browser-warning": "69420",
            'Authorization': apikey
        }
    });
    const profile: Profile = await response.json();
    return profile;
}

export default function ProfileInfo({ profileId, apikey }: ProfileInfoProps) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile(profileId, apikey).then(data => {
            setProfile(data);
            setLoading(false);
        });
    }, [profileId, apikey]);

    const capitalize = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    if (loading || !profile) return <div>Loading...</div>;
    return (
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            <div className='md:col-span-1'>
                <p className="page-kicker">Profile</p>
                <h2 className='page-title'>{capitalize(profile.name)}</h2>
                <p className='mt-3 text-sm leading-relaxed text-zinc-400'>{profile.bio}</p>
            </div>
            <div className='md:col-span-3'>
                <div className="page-header">
                    <h2 className='text-lg font-semibold text-zinc-100'>Images</h2>
                    <NewImageDialog profileId={profileId} apikey={apikey} />
                </div>
                <ImageList profileId={profileId} apikey={apikey} />
            </div>
        </div>
    )
}
