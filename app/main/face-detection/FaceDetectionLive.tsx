'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { BiStopCircle } from 'react-icons/bi';
import { FaceProcessingStream } from '../../../components/FaceProcessingStream'
import VideoElement from '../../../components/VideoElement';

function FaceDetectionLive(): any {
    const [videoStream, setVideoStream] = useState<MediaStream>();
    const { data: session, status } = useSession({ required: true });
    const faceDetectionStream: FaceProcessingStream = new FaceProcessingStream(`${process.env.NEXT_PUBLIC_API_URL}/api`);

    const startVideo = async () => {
        console.log('start video' + JSON.stringify(session));
        const stream:MediaStream = await faceDetectionStream.start(session?.apikey as string, {
            origin: { name: "frontend", args: null },
            processor: { name: "recognizer-api", args: { type: "detection" } },
            destination: { name: "frontend", args: null },
        });
        setVideoStream(stream);
    };

    const stopVideo = async () => {
        await faceDetectionStream.stop();
        setVideoStream(undefined);
    };

    return (
    <>
        <div className='flex flex-col'>
            {videoStream ? 
                <VideoElement className='video-stage' srcObject={videoStream} autoPlay={true} controls={true}/>
                : <video className='video-stage'/>}
            <div className='toolbar'>
                <button type="button" className="icon-btn-lg" onClick={startVideo} aria-label="Start">
                    <AiOutlinePlayCircle/>
                </button>
                <button type="button" className="icon-btn-lg" onClick={stopVideo} aria-label="Stop">
                    <BiStopCircle/>
                </button>
            </div>
        </div>
    </>
    )
};

export default FaceDetectionLive;
