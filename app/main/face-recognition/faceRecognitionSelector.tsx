'use client'

import type { NextPage } from 'next'
import { useState } from 'react';
import GroupSelection from './GroupSelection';
import { useRequireSession } from '../../../lib/useRequireSession';

const FaceRecognitionSelector: NextPage = () => {
    const [ option, setOption ] = useState<string>("live");
    const { data: session, status } = useRequireSession();
    
    if(status === "loading" || status === "unauthenticated" || !session) return <div className="text-emerald-400/80">Loading...</div> 
    
    const selectOption = (option:string) => {
        setOption(option);
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <p className="page-kicker">Vision</p>
                    <h1 className="page-title">
                        Face recognition 
                        {option === "live" && <span className='badge'>Live</span>}
                        {option === "snap" && <span className='badge'>Snap</span>}
                    </h1>
                </div>
                <div className="seg">
                    <button className={`seg-item ${option === "live" ? "seg-item-active" : ""}`} onClick={()=>selectOption("live")}>Live</button>
                    <button className={`seg-item ${option === "snap" ? "seg-item-active" : ""}`} onClick={()=>selectOption("snap")}>Snap</button>
                </div>
            </div>
            <GroupSelection option={option} userId={session.userId as string} accessToken={session.accessToken as string}/>
        </div>
    );
};

export default FaceRecognitionSelector;
