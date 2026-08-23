'use client';

import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { BiStopCircle } from 'react-icons/bi';
import { FaceProcessingStream } from '../../../components/FaceProcessingStream'
import VideoElement from '../../../components/VideoElement';

function FaceDetectionLive(): any {
    const [videoStream, setVideoStream] = useState<MediaStream>();
    const { data: session, status } = useSession({ required: true });
    const faceDetectionStream = useRef(new FaceProcessingStream(`${process.env.NEXT_PUBLIC_API_URL}/api`)).current;

    const startVideo = async () => {
        try {
            console.log('start video' + JSON.stringify(session));
            const stream:MediaStream = await faceDetectionStream.start(session?.apikey as string, {
                origin: { name: "frontend", args: null },
                processor: { name: "recognizer-api", args: { type: "detection" } },
                destination: { name: "frontend", args: null },
            });
            setVideoStream(stream);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    const stopVideo = async () => {
        await faceDetectionStream.stop();
        setVideoStream(undefined);
    };

    return (
    <>
        <div className='flex flex-col'>
            {videoStream ? 
                <VideoElement className='video-frame' srcObject={videoStream} autoPlay={true} playsInline={true} controls={true}/>
                : <video className='video-frame'/>}
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
