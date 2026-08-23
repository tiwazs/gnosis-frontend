'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { BiStopCircle } from 'react-icons/bi';
import { FaceProcessingStream } from '../../../components/FaceProcessingStream'
import VideoElement from '../../../components/VideoElement';

interface FaceRecognitionLiveProps {
    groupId: string;
}

function FaceRecognitionLive({groupId}: FaceRecognitionLiveProps): any {
    const [videoStream, setVideoStream] = useState<MediaStream>();
    const { data: session, status } = useSession({ required: true });
    const faceRecognitionStream: FaceProcessingStream = new FaceProcessingStream(`${process.env.NEXT_PUBLIC_API_URL}/api`);

    const startVideo = async () => {
        console.log('start video' + JSON.stringify(session) + " group "  + groupId);
        const stream:MediaStream = await faceRecognitionStream.start(session?.apikey as string, {
            origin: { name: "frontend", args: null },
            processor: { name: "recognizer-api", args: { type: "recognition", groupId: groupId } },
            destination: { name: "frontend", args: null },
        });
        setVideoStream(stream);
    };

    const stopVideo = async () => {
        await faceRecognitionStream.stop();
        setVideoStream(undefined);
    };

    return (
    <>
        <div className='flex flex-col'>
            {videoStream ? 
                <VideoElement className='border border-green-600 rounded-lg w-full h-full' srcObject={videoStream} autoPlay={true} controls={true}/>
                : <video className='border border-green-600 rounded-lg w-full h-full'/>}
            <div className='bg-[#2b2532] focus:bg-[#3f3847] rounded-lg p-4 my-4'>
                <div>
                </div>
                <div className='flex items-center justify-center space-x-16'>
                    <h5 className="hover:text-gray-200 border border-green-700 shadow-lg shadow-green-700/50 active:bg-green-700 rounded-lg px-4 py-1 hover:bg-[#3f3847]
                             active:translate-y-1 text-4xl cursor-pointer text-gray-400 " onClick={startVideo}><AiOutlinePlayCircle/></h5>
                    <h5 className="hover:text-gray-200 border border-green-700 shadow-lg shadow-green-700/50 active:bg-green-700 rounded-lg px-4 py-1 hover:bg-[#3f3847]
                             active:translate-y-1 text-4xl cursor-pointer text-gray-400 " onClick={stopVideo}><BiStopCircle/></h5>
                </div>
            </div>
        </div>
    </>
    )
};

export default FaceRecognitionLive;