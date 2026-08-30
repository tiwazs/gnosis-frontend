'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface SignupFormClassOptions {
    className?: string
}

interface SignupFormOptions {
    name: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

const SignupForm = ({className}: SignupFormClassOptions) => {
    const { register, handleSubmit } = useForm<SignupFormOptions>();
    const router = useRouter();
    const [error, setError] = useState("");

    const onSubmit: SubmitHandler<SignupFormOptions> = async (data) => {
        setError("");
        const api = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
        const response = await fetch(`${api}/api/access/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            setError(body.error || "Could not create account");
            return;
        }
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        if (result?.error) {
            router.push("/login");
            return;
        }
        router.push("/main");
        router.refresh();
    };
    const redirectToLogin = () => router.push('/login');

    return (
        <div className={`${className ?? ''}`}>
            <form className='card space-y-3' onSubmit={handleSubmit(onSubmit)}>
                <input 
                    {...register("name", { required: true })}
                    className='input-field'
                    type="text"
                    name="name"
                    placeholder="Username"
                />                                
                <input 
                    {...register("email", { required: true })}
                    className='input-field'
                    type="text"
                    name="email"
                    placeholder="email@domain.com"
                />                                
                <input
                    {...register("password", { required: true })} 
                    className='input-field'
                    type="password" 
                    name="password" 
                    placeholder="Password"
                />
                <div className="grid grid-cols-2 gap-3">
                    <input
                        {...register("firstName", { required: true })} 
                        className='input-field'
                        type="text" 
                        name="firstName" 
                        placeholder="First name"
                    />
                    <input
                        {...register("lastName", { required: true })} 
                        className='input-field'
                        type="text" 
                        name="lastName" 
                        placeholder="Last name"
                    />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button type="submit" className='btn-primary mt-2 w-full py-2.5'>
                    Sign up
                </button>
                <p className='pt-1 text-center text-sm text-zinc-400'>
                    Already have an account?{' '}
                    <span className='cursor-pointer font-medium text-emerald-400 hover:text-emerald-300' onClick={redirectToLogin}>
                        Sign in
                    </span>
                </p>
            </form>
        </div>
    );
};

export default SignupForm;
