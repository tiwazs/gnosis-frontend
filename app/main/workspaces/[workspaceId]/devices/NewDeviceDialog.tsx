import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { createDeviceRegistrationToken, RegistrationToken } from "../../../../../services/workspaceService";

interface NewDeviceDialogProps {
    workspaceId: string;
    jwt: string;
}

export default function NewDeviceDialog({ workspaceId, jwt }: NewDeviceDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [pairing, setPairing] = useState<RegistrationToken | null>(null);

    async function generateToken() {
        setBusy(true);
        setError("");
        setCopied(false);
        try {
            const token = await createDeviceRegistrationToken(jwt, workspaceId);
            setPairing(token);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not generate pairing token");
        } finally {
            setBusy(false);
        }
    }

    async function copyToken(token: string) {
        try {
            await navigator.clipboard.writeText(token);
            setCopied(true);
        } catch {
            setError("Could not copy token");
        }
    }

    function closeModal() {
        setIsOpen(false);
        setError("");
        setCopied(false);
        setPairing(null);
        setBusy(false);
    }

    function openModal() {
        setError("");
        setCopied(false);
        setPairing(null);
        setIsOpen(true);
    }

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="btn-icon h-11 w-11 shrink-0 text-xl"
                aria-label="Pair device"
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
                                        Pair a device
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-zinc-400">
                                        Generate a registration token, copy it, and enter it on the device. The
                                        device is created when it pairs.
                                    </p>

                                    {pairing ? (
                                        <div className="mt-4 text-left">
                                            <p className="text-xs uppercase tracking-wide text-zinc-500">
                                                Registration token
                                            </p>
                                            <p className="mt-2 break-all rounded-xl bg-gnosis-raised px-3 py-2 font-mono text-sm text-emerald-300">
                                                {pairing.token}
                                            </p>
                                            <p className="mt-2 text-xs text-zinc-500">
                                                Expires {new Date(pairing.expires_at).toLocaleString()}
                                            </p>
                                            {copied && (
                                                <p className="mt-2 text-xs text-emerald-400">Copied</p>
                                            )}
                                        </div>
                                    ) : null}

                                    {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                                    <div className="mt-4 flex justify-between">
                                        <button type="button" className="btn-secondary" onClick={closeModal}>
                                            Close
                                        </button>
                                        {pairing ? (
                                            <button
                                                type="button"
                                                className="btn-primary"
                                                onClick={() => copyToken(pairing.token)}
                                            >
                                                Copy token
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn-primary"
                                                disabled={busy}
                                                onClick={generateToken}
                                            >
                                                {busy ? "…" : "Generate token"}
                                            </button>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
