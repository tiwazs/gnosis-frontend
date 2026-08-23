'use client'

import type { NextPage } from 'next'
import { useState } from 'react';
import FaceDetectionLive from './FaceDetectionLive';
import FaceDetectionSnap from './FaceDetectionSnap';

const FaceDetectionSelector: NextPage = () => {
    const [ option, setOption ] = useState<string>("live");
    
    const selectOption = (option:string) => {
        setOption(option);
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <p className="page-kicker">Vision</p>
                    <h1 className="page-title">
                        Face detection
                        {option === "live" && <span className='badge'>Live</span>}
                        {option === "snap" && <span className='badge'>Snap</span>}
                    </h1>
                </div>
                <div className="seg">
                    <button className={`seg-item ${option === "live" ? "seg-item-active" : ""}`} onClick={()=>selectOption("live")}>Live</button>
                    <button className={`seg-item ${option === "snap" ? "seg-item-active" : ""}`} onClick={()=>selectOption("snap")}>Snap</button>
                </div>
            </div>
            <div>
                {option === "live" && <FaceDetectionLive />}
                {option === "snap" && <FaceDetectionSnap />}
            </div>
        </>
    );
};

export default FaceDetectionSelector;
