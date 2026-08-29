'use client'

import { User } from "@prisma/client";
import { useState } from "react";

interface DisplayFormCardProps {
    id: string,
    displayOption: string,
    value: string,
    description: string,
    className?: string
}

const DisplayFormCard = ({id, displayOption, value, description, className}:DisplayFormCardProps) => {
    const [showing, setShowing] = useState(false);
    const [apiKey, setApiKey] = useState(value || "");
    const [status, setStatus] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const onGenerate = async () => {
        setBusy(true);
        setStatus(null);
        try {
            const response = await fetch(`/api/user/genapikey/${id}`);
            const data: User & { message?: string } = await response.json();
            if (!response.ok || !data.apiKey) {
                setStatus(data.message ?? "Could not generate API key");
                return;
            }
            setApiKey(data.apiKey);
            setShowing(true);
            setStatus("New key generated. Copy it now; generating again replaces it.");
        } catch (e) {
            setStatus(`Could not generate API key: ${e}`);
        } finally {
            setBusy(false);
        }
    }

    const onCopy = async () => {
        if (!apiKey) return;
        try {
            await navigator.clipboard.writeText(apiKey);
            setStatus("Copied to clipboard");
        } catch {
            setStatus("Could not copy");
        }
    }

    const revealed = showing && apiKey ? apiKey : (showing && !apiKey ? "No API key yet. Generate one to use the API." : "********");

    return (
        <div className={`card mb-4 ${className ?? ''}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-sm font-medium text-zinc-300">{displayOption}</h1>
                    <p className="mt-2 break-all rounded-xl bg-gnosis-raised px-3 py-2 font-mono text-sm text-zinc-400">{revealed}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {showing && apiKey && (
                        <button type="button" className="btn-secondary" onClick={onCopy}>Copy</button>
                    )}
                    <button type="button" className="btn-primary" disabled={busy} onClick={onGenerate}>
                        {busy ? "…" : "Generate"}
                    </button>
                    <button type="button" onClick={() => setShowing(!showing)} className="btn-secondary">
                        {showing ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            <p className="mt-3 text-sm text-zinc-500">{description}</p>
            {status && (
                <p className={`mt-2 text-xs ${status.startsWith("Could not") ? "text-red-400" : "text-emerald-400"}`}>
                    {status}
                </p>
            )}
        </div>
    );
}

export default DisplayFormCard;
