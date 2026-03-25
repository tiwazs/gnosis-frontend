import { Image } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import ImageOption from './ImageOption';

interface ImagesProps {
    profileId: string
    apikey: string
}

interface ImageExt extends Image {
    imageBase64: string;
}

const getImages = async (profileId: string, apikey: string) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image/profile/${profileId}?base64=true`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
            }})
        const images: ImageExt[] = await response.json();
        return images;
    }catch(e){
        console.log(`Error: ${e}`);
        return [];
    }
}

function ProfileList({profileId, apikey}: ImagesProps) {
    // TODO: Remove this once use hook is fixed
    //const profiles = use( getProfiles(userId, apikey) );
    const query = useQuery(["images",profileId, apikey], () => getImages(profileId, apikey) )
    const [images, setImages] = useState<string[]>([]);
    
    useEffect(() => {
        // When re-rendering, we need to convert the base64 images to buffers and create URLs for them
        if (query.status === 'success') {
            // Reading the image data and converting it to buffers
            const imageBufferList = query.data!.map( (image) => Buffer.from( image.imageBase64, 'base64') );
            
            // Creating a URL for each image buffer and returning the list of URLs
            const imageUrls = imageBufferList.map( (imageBuffer) => URL.createObjectURL( new Blob([imageBuffer]) ) );
            setImages(imageUrls);
        }
    }, [query.status, query.data]);
    
    if (query.isLoading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className='flex flex-col gap-4 md:grid md:grid-cols-2'>
            {query.data!.map( (image, index) => (
                <div key={image.id}>
                <ImageOption
                    imageId={image.id}
                    profileId={image.profileId}
                    name={image.name}
                    coder={image.coder ? image.coder : ""}
                    imgSrc={images[index]}
                    apikey={apikey}
                    isCoded={image.isCoded}
                />
                </div>
            ))}
        </div>
    );
}

export default ProfileList;