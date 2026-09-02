import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoAddSharp } from "react-icons/io5";
import { useQueryClient } from "react-query";
import { createWorkspace } from "../../services/workspaceService";

interface CreateWorkspaceFormOptions {
    name: string;
}

export default function NewWorkspaceDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const { register, handleSubmit, reset } = useForm<CreateWorkspaceFormOptions>();
    const queryClient = useQueryClient();

    const onSubmit: SubmitHandler<CreateWorkspaceFormOptions> = async (data) => {
        setSubmitError("");
        try {
            await createWorkspace(data.name.trim());
            reset();
            setIsOpen(false);
            queryClient.invalidateQueries("workspaces");
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Could not create workspace");
        }
    };

    function closeModal() {
        setIsOpen(false);
        setSubmitError("");
    }

    function openModal() {
        setSubmitError("");
        setIsOpen(true);
    }

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="btn-icon h-11 w-11 shrink-0 text-xl"
                aria-label="New workspace"
            >
                <IoAddSharp />
            </button>

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
                                    <Dialog.Title as="h3" className="text-lg font-semibold text-zinc-100">
                                        New workspace
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-zinc-400">
                                        Create a workspace to group devices and vision pipelines.
                                    </p>
                                    <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                                        <input
                                            {...register("name", { required: true, minLength: 1 })}
                                            className="input-field my-3"
                                            type="text"
                                            name="name"
                                            placeholder="Name"
                                        />
                                        {submitError && <p className="mb-3 text-sm text-red-400">{submitError}</p>}
                                        <div className="mt-4 flex justify-between">
                                            <button type="button" className="btn-secondary" onClick={closeModal}>
                                                Cancel
                                            </button>
                                            <input type="submit" value="Create" className="btn-primary cursor-pointer" />
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
