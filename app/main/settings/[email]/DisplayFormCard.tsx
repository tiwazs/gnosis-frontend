import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface DisplayFormCardProps {
    id: string,
    displayOption: string, 
    option: "name" | "firstName" | "lastName" | "email" | "password" | "image" | "password",
    value: string, 
    description: string,
    obscured: boolean | null,
    className?: string
}

interface IFormInput {
    id: string,
    name: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    image: string | null,
    password: string | null
}


const DisplayFormCard = ({id, displayOption, option, value, description, obscured, className}:DisplayFormCardProps) => {

    const [ editing, setEditing ] = useState(false);
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<IFormInput>();

    const onCancel = () => {
        reset();
        setEditing(!editing) 
    }

    const onSubmit:SubmitHandler<IFormInput> = async (data) => {
        console.log(`Submitting data:  ${JSON.stringify(data)}`);

        try{
            const gateway = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
            const response = await fetch(`${gateway}/api/user/id/${id}`, {
                method: "PUT",
                credentials: "omit",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            console.log(`Response: ${JSON.stringify(response)}`);
            setEditing(false);
        }catch(e){
            console.log(`Error: ${e}`);
            setEditing(false);
        }
    }
    
    return (
        <div className={`card mb-4 ${className ?? ''}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-sm font-medium text-zinc-300" >{displayOption}</h1>
                    <input 
                        {...register("id", {required: true})}
                        type="hidden"
                        name="postId"
                        value={id}
                    />
                    <input 
                        {...register(option, {required: true})}
                        type={`${obscured ? "password" : "text"}`}
                        placeholder={`${(obscured && value) ?  "*******": value}`}
                        className="input-field mt-2 max-w-md" 
                        disabled={!editing}
                    />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {editing && (
                        <input 
                            type="submit" 
                            className="btn-primary cursor-pointer" 
                            value="Save"
                        />
                    )}
                    <button type="button" onClick={onCancel} className="btn-secondary">{editing ? "Cancel" : "Edit"}</button>
                </div>
            </form>
            <p className="mt-3 text-sm text-zinc-500" >{description}</p>
        </div>
    );
}

export default DisplayFormCard;