'use client'

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { apiFetch } from "../../../../lib/apiFetch";

interface SettingFieldProps {
    userId: string;
    jwt: string;
    label: string;
    field: "name" | "firstName" | "lastName" | "email" | "password";
    value: string;
    description: string;
    password?: boolean;
}

type FieldForm = {
    value: string;
}

const SettingField = ({ userId, jwt, label, field, value, description, password }: SettingFieldProps) => {
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(value);
    const [status, setStatus] = useState<string | null>(null);
    const { register, handleSubmit, reset } = useForm<FieldForm>({
        defaultValues: { value: password ? "" : value },
    });

    const cancel = () => {
        reset({ value: password ? "" : saved });
        setEditing(false);
        setStatus(null);
    };

    const onSubmit: SubmitHandler<FieldForm> = async (data) => {
        setStatus(null);
        try {
            const gateway = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
            const response = await apiFetch(`${gateway}/api/user/id/${userId}`, {
                method: "PUT",
                credentials: "omit",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ [field]: data.value }),
            });
            const body = await response.json().catch(() => ({}));
            if (!response.ok) {
                setStatus(body.message ?? "Could not save");
                return;
            }
            if (!password) setSaved(data.value);
            reset({ value: password ? "" : data.value });
            setEditing(false);
            setStatus("Saved");
        } catch {
            setStatus("Could not save");
        }
    };

    return (
        <div className="card mb-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1">
                    <label className="text-sm font-medium text-zinc-300">{label}</label>
                    <input
                        {...register("value", {
                            required: true,
                            minLength: password ? 8 : undefined,
                        })}
                        type={password ? "password" : "text"}
                        placeholder={password ? "New password (8+ characters)" : saved}
                        className="input-field mt-2 max-w-md"
                        disabled={!editing}
                    />
                    <p className="mt-2 text-sm text-zinc-500">{description}</p>
                    {status && (
                        <p className={`mt-2 text-xs ${status === "Saved" ? "text-emerald-400" : "text-red-400"}`}>
                            {status}
                        </p>
                    )}
                </div>
                <div className="flex shrink-0 gap-2">
                    {editing && (
                        <button type="submit" className="btn-primary">Save</button>
                    )}
                    <button type="button" onClick={editing ? cancel : () => setEditing(true)} className="btn-secondary">
                        {editing ? "Cancel" : "Edit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingField;
