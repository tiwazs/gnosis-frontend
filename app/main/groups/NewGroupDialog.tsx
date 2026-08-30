import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoAddSharp } from 'react-icons/io5'
import { useQueryClient } from 'react-query';

interface CreateGroupFormOptions {
    userId: string;
    name: string;
    description?: string;
    dataset?: string;
}

interface NewGroupDialogProps {
    userId: string;
    accessToken: string;
}

export default function NewGroupDialog({userId, accessToken}:NewGroupDialogProps) {
    let [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateGroupFormOptions>();
    
    // TODO: Remove this once use hook is fixed
    const queryClient = useQueryClient();

    const onSubmit: SubmitHandler<CreateGroupFormOptions> = async data => {
        console.log(`Submitting data:  ${JSON.stringify(data)}`);

        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            });
            console.log(`Response: ${JSON.stringify(response)}`);
            setIsOpen(false);

            // TODO: Remove this once use hook is fixed
            //router.refresh();        
            queryClient.invalidateQueries('groups');
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
      <div>
        <button
          type="button"
          onClick={openModal}
          className="icon-btn-lg h-11 w-11 text-xl"
          aria-label="New group"
        >
          <IoAddSharp />
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
                    New Group
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-zinc-400">
                      Create a new group and assign profiles to it. then use the group dataset on the face recognition app.
                    </p>
                    <form className='rounded-2xl flex-row justify-between ' onSubmit={handleSubmit(onSubmit)}>
                        <div className='mx-4'>

                            <div>
                                <input 
                                    {...register("userId", {required: true})}
                                    type="hidden"
                                    name="userId"
                                    value={userId}
                                />
                            </div>
                            <div>
                                <input 
                                    {...register("name", { required: true })}
                                    className='input-field my-3'
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                />                                
                            </div>
                            <div>
                                <textarea 
                                    {...register("description", { required: true, maxLength: 1000 })}
                                    className='input-field my-3'
                                    name="description"
                                    placeholder="description"
                                />                                
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                            type="button"
                            className="btn-secondary"
                            onClick={closeModal}
                            >
                            Cancel
                            </button>
                            <input type="submit" value="Create" className='btn-primary cursor-pointer'/>
                        </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
