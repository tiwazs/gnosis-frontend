import React from 'react';
import { MdDarkMode } from 'react-icons/md';
import { IoLanguageSharp } from 'react-icons/io5';
import DropDownAccount from './DropDownAccount';
import Link from 'next/link';

const TopBar = () => {
    return (
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#120e16]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-full items-center justify-between px-4 sm:px-6">
                <Link href="/main" className="group flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/25">
                        G
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-emerald-300">
                        Gnosis
                    </span>
                </Link>
                <div className="flex items-center gap-1">
                    <button type="button" className="icon-btn" aria-label="Theme">
                        <MdDarkMode className="text-lg" />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Language">
                        <IoLanguageSharp className="text-lg" />
                    </button>
                    <div className="ml-1">
                        <DropDownAccount up={false}/>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
