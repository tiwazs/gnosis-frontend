import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface DisplayFormCardProps {
    id: string,
    displayOption: string, 
    value: string, 
    description: string,
    className?: string
}

interface IFormInput {
    apiKey: string | null
}


const DisplayFormCard = ({id, displayOption, value, description, className}:DisplayFormCardProps) => {

    const [ showing, setShowing ] = useState(false);
    const [ apiKey, setApiKey ] = useState<string | null>(value);
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<IFormInput>();

    const onCancel = () => {
        reset();
        setShowing(!showing) 
    }

    const onGenerate = async () => {
        try{
            const response = await fetch(`/api/user/genapikey/${id}`);
            const data: User = await response.json();
            console.log(`Data: ${JSON.stringify(data)}`);
            setApiKey(data.apiKey);
        }catch(e){
            console.log(`Error: ${e}`);
        }
    }
    
    return (
        <div className={`card mb-4 ${className ?? ''}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-sm font-medium text-zinc-300" >{displayOption}</h1>
                    <p className="mt-2 truncate rounded-xl bg-gnosis-raised px-3 py-2 font-mono text-sm text-zinc-400">{`${(apiKey && showing) ? apiKey : "********" }`}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {showing && (
                        <button 
                            className="btn-primary" 
                         onClick={onGenerate}>Generate</button>
                    )}
                    <button type="button" onClick={onCancel} className="btn-secondary">{showing ? "Hide" : "Show"}</button>
                </div>
            </div>
            <p className="mt-3 text-sm text-zinc-500" >{description}</p>
        </div>
    );
}

export default DisplayFormCard;