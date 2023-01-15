import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface DisplayFormCardProps {
    id: string,
    displayOption: string, 
    option: "name" | "firstName" | "lastName" | "email" | "password" | "image" | "password",
    value: string, 
    description: string,
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


const DisplayFormCard = ({id, displayOption, option, value, description, className}:DisplayFormCardProps) => {

    const [ editing, setEditing ] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();

    const onSubmit:SubmitHandler<IFormInput> = async (data) => {
        console.log(`Submitting data:  ${JSON.stringify(data)}`);

        try{
            const response = await fetch(`/api/user/${id}`, {
                method: "PUT",
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
        <div className={`my-10 ${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex justify-between ">
                <div>
                    <h1 className=" font-bold text-gray-300 py-1 text-xl" >{displayOption}</h1>
                    <input 
                        {...register("id", {required: true})}
                        type="hidden"
                        name="postId"
                        value={id}
                    />
                    <input 
                        {...register(option, {required: true})}
                        type="text"
                        placeholder={value}
                        value={value}
                        className="rounded-lg p-1 text-gray-400 bg-[#2b2532]" 
                        disabled={!editing}
                    />
                </div>
                <div className="flex flex-row">
                    {editing && (
                        <input 
                            type="submit" 
                            className="border px-4 py-1 text-gray-400 rounded-2xl
                            border-green-700 shadow-lg bg-[#2b2532] hover:text-gray-200 shadow-green-700/50 hover:bg-green-700" 
                            value="Save"
                        />
                    )}
                    <button type="button" onClick={()=>setEditing(!editing)} className="text-gray-300 border px-4 py-1 rounded-2xl
                                border-green-700 shadow-lg bg-[#2b2532] hover:text-gray-200
                                shadow-green-700/50 hover:bg-[#3f3847]">{editing ? "Cancel" : "Edit"}</button>
                </div>
            </form>
            <hr className="pb-2 border-green-700" />
            <p className=" text-sm text-gray-300 " >{description}</p>
        </div>
    );
}

export default DisplayFormCard;