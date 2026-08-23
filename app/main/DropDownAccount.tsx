'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface DropUpAccountProps {
    up:boolean
}

const DropDownAccount = ({up}:DropUpAccountProps)=> {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
          router.push('/login');
        },
    })

    if(status === "loading") {
        return <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
    }
    return (
    <Menu as="div" className="relative inline-block text-left">
        <div>
        <Menu.Button className="inline-flex rounded-full ring-2 ring-white/10 transition hover:ring-emerald-400/50 focus:outline-none focus-visible:ring-emerald-400">
            <img className='h-8 w-8 rounded-full object-cover' src={session!.user!.image as string} alt="" />
        </Menu.Button>
        </div>

        <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        >
        <Menu.Items className={classNames(`absolute right-0 z-10 mt-2 w-60 origin-top-right divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-gnosis-raised shadow-glow focus:outline-none ${up ? `-top-2 -translate-y-full -left-1`:''}`)}>
            <div className="px-4 py-3">
                <p className="text-sm font-medium text-zinc-100">{session?.user?.name}</p>
                <p className="truncate text-xs text-zinc-500">{session?.user?.email}</p>
            </div>
            <div className="py-1">
                <Menu.Item>
                    {({ active }) => (
                        <a href={`/main/settings/${session?.user?.email}`} className={classNames( active ? 'bg-white/5 text-zinc-100' : 'text-zinc-400','block px-4 py-2.5 text-sm')}>
                            Account settings
                        </a>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => ( 
                        <button onClick={()=>signOut()} className={classNames( active ? 'bg-white/5 text-zinc-100' : 'text-zinc-400','block w-full px-4 py-2.5 text-left text-sm' )}>
                            Sign out
                        </button>
                    )}
                </Menu.Item>
            </div>
        </Menu.Items>
        </Transition>
    </Menu>
    )
}

export default DropDownAccount;
