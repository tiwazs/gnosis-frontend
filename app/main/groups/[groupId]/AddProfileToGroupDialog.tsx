import { Dialog, Transition } from '@headlessui/react'
import { Profile } from '@prisma/client';
import { Fragment, SVGProps, useEffect, useState } from 'react'
import { IoAddSharp } from 'react-icons/io5'
import { useQuery, useQueryClient } from 'react-query';
import { RadioGroup } from '@headlessui/react'

interface AddProfileToGroupDialogProps {
    groupId: string;
    apikey: string;
}

const getUnassignedProfiles = async (groupId: string, apikey: string) => {
  try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/not-in-group/${groupId}`, {
          method: 'GET',
          headers: {
              "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
          }})
      const profiles: Profile[] = await response.json();
      return profiles;
  }catch(e){
      console.log(`Error: ${e}`);
      return [];
  }
}

interface ProfileSel {
  profile: Profile;
  toAdd: boolean;
}

export default function AddProfileToGroupDialog({groupId, apikey}:AddProfileToGroupDialogProps) {
    let [isOpen, setIsOpen] = useState(false);

    // List of the unsassigned profiles to the group to populate the list radiogroup
    const query = useQuery(["unassigned-profiles",groupId, apikey], () => getUnassignedProfiles(groupId, apikey) );
    
    // List of profiles to add to group
    let [profilesSel, setProfilesSel] = useState<ProfileSel[]>([]);

    // The selected profile in the list radiogroup
    const [selected, setSelected] = useState()
    
    const queryClient = useQueryClient();

    useEffect(() => {

      // Qhen the dialog is rendered and the query is successful, map the profiles to a list of profiles to add, 
      // with the toAdd flag set to false
      if (query.status === 'success') {
          const profiles: Profile[] = query.data;
          const profilesToAdd: ProfileSel[] = profiles.map((profile: Profile) => {
            return {profile: profile, toAdd: false};
          });
          setProfilesSel(profilesToAdd);
      }

    }, [query.status, query.data]);
    

    // This method is called when the user clicks on a profile in the list radiogroup.
    // It toggles the toAdd flag for the profile and updates the profilesSel array state
    const onProfileSelChange = (profile: Profile) => {
      const newProfilesSel = profilesSel.map((profileSel: ProfileSel) => {
        if (profileSel.profile.id === profile.id) {
          return {profile: profile, toAdd: !profileSel.toAdd};
        } else {
          return profileSel;
        }
      });
      setProfilesSel(newProfilesSel);
    }
    
    if (query.isLoading) {
      return <h2>Loading...</h2>;
    }
    

    // Method request the addition of the selected profiles to the group
    const addProfiles = async () => {
        const profilesIdsToAdd: string[] = profilesSel.filter( (profileSel: ProfileSel) => profileSel.toAdd).map( (profileSel: ProfileSel) => profileSel.profile.id);

        const data = {
            "profileIds": profilesIdsToAdd,
            "groupId": groupId
        }

        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile-group/many`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                'Authorization': apikey
                },
                body: JSON.stringify(data)
            });
            console.log(`Response: ${JSON.stringify(response)}`);
            setIsOpen(false);

            // TODO: Remove this once use hook is fixed
            //router.refresh();        
            await queryClient.invalidateQueries('group-profiles');
            await queryClient.invalidateQueries('unassigned-profiles');
        }catch(e){
            console.log(`Error: ${e}`);
            setIsOpen(false);
        }
    };

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="inset-0 justify-center">
        <button
          type="button"
          onClick={openModal}
          className="icon-btn-lg h-11 w-11 text-xl"
          aria-label="Add profiles"
        >
          <IoAddSharp className='text-2xl font-thin text-gray-400"' />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="modal-backdrop" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="modal-panel">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-zinc-100"
                  >
                    Add Profiles
                  </Dialog.Title>

                  {/* Insides of the Modal */}
                  <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        Add profiles to this group.
                      </p>

                      {/* Radio Selection */}
                      {/* When selection changes, trigger onProfileSelChange and passes the "value" of the selected radioGroup.Option */}
                      <RadioGroup value={selected} onChange={onProfileSelChange}>
                        <RadioGroup.Label></RadioGroup.Label>
                        {profilesSel.map((profileSel) => (
                            <RadioGroup.Option
                                key={profileSel.profile.name}
                                value={profileSel.profile}
                                className={({ checked }) =>
                                  `${
                                    checked ? 'bg-gnosis-hover' : 'bg-gnosis-raised'
                                  }
                                    relative flex cursor-pointer rounded-lg my-2 px-5 py-4 shadow-md focus:outline-none text-white`
                                }
                              >
                                {({ checked }) => (
                                  <>
                                    <div className="flex w-full items-center justify-between">
                                      <div className="flex items-center">
                                        <div className="text-sm">
                                          <RadioGroup.Label
                                            as="p"
                                            className={`font-medium  ${
                                              checked ? 'text-white' : 'text-gray-300'
                                            }`}
                                          >
                                            {profileSel.profile.name}
                                          </RadioGroup.Label>
                                          <RadioGroup.Description
                                            as="span"
                                            className={`inline ${
                                              checked ? 'text-sky-100' : 'text-gray-300'
                                            }`}
                                            >
                                          </RadioGroup.Description>
                                        </div>
                                      </div>
                                      {profileSel.toAdd && (
                                        <div className="shrink-0 text-white">
                                          <CheckIcon className="h-6 w-6" />
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                      {/* Radio Selection */}

                      <div className="mt-4 flex justify-between">
                          <button
                          type="button"
                          className="btn-secondary"
                          onClick={closeModal}
                          >
                          Cancel
                          </button>
                          <button type="button" className='btn-primary' onClick={addProfiles}>Add</button>
                      </div>
                  </div>
                  {/* Insides of the Modal */}

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
