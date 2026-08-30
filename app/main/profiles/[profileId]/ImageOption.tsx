import React from 'react'
import { IoTrashOutline } from 'react-icons/io5'
import { GiCheckMark } from 'react-icons/gi'
import { BsExclamationLg } from 'react-icons/bs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQueryClient } from 'react-query'
import { BiBarcodeReader } from 'react-icons/bi'

interface ImageOptionProps {
    imageId: string
    profileId: string
    name: string
    coder: string
    isCoded: boolean
    imgSrc: string
    accessToken: string
    className?: string
}

interface EncodeImage {
    profileId: string,
    imageIds: string[]
}

export default function ImageOption({imageId, profileId, name, coder, isCoded, imgSrc, accessToken, className}:ImageOptionProps) {
    const router = useRouter();
    // TODO: Remove this once use hook is fixed
    const queryClient = useQueryClient();


    const encodeImage = async () => {
        let encodeImageRequest: EncodeImage = {
            profileId: profileId,
            imageIds: [imageId]
        }

        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image/encode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(encodeImageRequest)
            });
            console.log(`Response: ${JSON.stringify(response)}`);

            // TODO: Remove this once use hook is fixed
            //router.refresh();        
            queryClient.invalidateQueries('images');
        }catch(e){
            console.log(`Error: ${e}`);
        }
    };

    const deleteImage = async () => {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image/${imageId}`, {
                method: "DELETE",
                headers: {
                    "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
                },
            });
            console.log(`Response: ${JSON.stringify(response)}`);

            // TODO: Remove this once use hook is fixed
            //router.refresh();        
            queryClient.invalidateQueries('images');
        }catch(e){
            console.log(`Error: ${e}`);
        }
  };

  return (
    <div className={`card card-hover group flex flex-row items-center justify-between ${className ?? ''}`}>
        <div className='flex items-center gap-4 px-1'>
            <div className='flex flex-col items-center'>
                <img className='h-44 w-auto rounded-xl object-cover ring-1 ring-white/10' src={imgSrc} alt={name} />
                <h5 className='mt-2 text-sm text-zinc-300'>{name}</h5>
            </div>
            {isCoded  ? <span className='pill-ok'> <GiCheckMark/> </span>: 
                        <span className='pill-warn'> <BsExclamationLg/> </span> }
        </div>
        <div className='flex'>
            <button type="button" className="icon-btn opacity-0 group-hover:opacity-100" onClick={encodeImage} aria-label="Encode"><BiBarcodeReader/></button>
            <button type="button" className="icon-btn opacity-0 hover:!text-red-300 group-hover:opacity-100" onClick={deleteImage} aria-label="Delete image"><IoTrashOutline/></button>
        </div>
    </div>
  )
}
