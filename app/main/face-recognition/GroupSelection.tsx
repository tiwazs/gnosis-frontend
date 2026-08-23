import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
//import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import {AiOutlineCheck, AiOutlineDown } from 'react-icons/ai'
import { Group } from '@prisma/client'
import { useQuery } from 'react-query'
import FaceRecognitionSnap from './FaceRecognitionSnap'
import FaceRecognitionLive from './FaceRecognitionLive'

const getCodedGroups = async (userId: string, apikey: string) => {
  try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/user/coded/${userId}`, {
          method: 'GET',
          headers: {
              "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
          }})
      const groups: Group[] = await response.json();
      return groups;
  }catch(e){
      console.log(`Error: ${e}`);
      return [];
  }
}

interface GroupSelectionProps {
  option: string;
  userId: string;
  apikey: string;
}

export default function GroupSelection({option, userId, apikey}: GroupSelectionProps) {
    const query = useQuery(["coded-groups", userId, apikey], () => getCodedGroups(userId, apikey) );
    const [selected, setSelected] = useState<Group | undefined>(undefined)
    
    // List of the coded available groups
    if(query.isLoading) return <div className="text-emerald-400/80">Loading...</div>

  return (
    <div>
    <div className="mb-6 w-full max-w-sm">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-xl border border-white/10 bg-gnosis-raised py-2.5 pl-3 pr-10 text-left text-sm text-zinc-200 shadow-sm outline-none transition hover:bg-gnosis-hover focus-visible:ring-2 focus-visible:ring-emerald-400/50">
            <span className="block truncate">{selected ? selected.name : "Select A Group"}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <AiOutlineDown
                className="h-4 w-4 text-gray-400 text-xs"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-gnosis-raised py-1 text-sm shadow-glow focus:outline-none">
              {query.data!.map((group, groupIdx) => (
                <Listbox.Option
                  key={groupIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-gnosis-hover text-emerald-300' : 'text-zinc-300'
                    }`
                  }
                  value={group}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {group.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-400">
                          <AiOutlineCheck className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
    <div>
          {option === "live" && <FaceRecognitionLive groupId={selected?.dataset ? selected.dataset.split(".")[0] : ""}/>}
          {option === "snap" && <FaceRecognitionSnap groupId={selected?.dataset ? selected.dataset.split(".")[0] : ""}/>}
    </div>
    </div>
  )
}
