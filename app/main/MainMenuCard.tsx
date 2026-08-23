'use client'

import React from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { BsCameraReels } from 'react-icons/bs';
import Link from 'next/link';

interface MainMenuCardProps {
    title: string;
    description: string;
    icon: string;
    redirectPath: string;
    className?: string;
}

const MainMenuCard = ({title,description,icon,redirectPath,className}:MainMenuCardProps) => {
    return (
        <Link href={`${redirectPath}`} className={`card card-hover group flex h-full flex-col ${className ?? ''}`}>
            <div className='flex items-center gap-3'>
                <img  className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10" src={`${icon}`} alt="" />
                <h5 className='text-base font-semibold text-zinc-100'>{title}</h5>
            </div>
            <p className='mt-3 flex-1 text-sm leading-relaxed text-zinc-400'>{description}</p>
            <div className='mt-5 flex gap-2 text-zinc-500'>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/20 text-lg ring-1 ring-white/5 transition group-hover:text-emerald-300">
                    <AiOutlineCamera/>
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/20 text-lg ring-1 ring-white/5 transition group-hover:text-emerald-300">
                    <BsCameraReels/>
                </span>
            </div>
        </Link>
    );
};

export default MainMenuCard;
