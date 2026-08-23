'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { AiFillGithub } from 'react-icons/ai';

import { signIn, useSession } from "next-auth/react";
import { useEffect } from 'react';

interface LoginFormClassOptions {
    className?: string
}

interface LoginFormOptions {
    email: string,
    password: string
}

const LoginForm = ({className}: LoginFormClassOptions) => {
    const { data: session, status } = useSession();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginFormOptions>();
    const router = useRouter();

    useEffect(() => {
        if(status === "loading") return;
        if(session) router.push("/main");
    }, [session, status]);

    const onSubmit: SubmitHandler<LoginFormOptions> = data => console.log(data);
    const redirectToSignup = () => router.push('/signup');
 
    return (
        <div className={`${className ?? ''}`}>
            <form className='card space-y-4' onSubmit={handleSubmit(onSubmit)}>
                <input 
                    {...register("email", { required: true })}
                    className='input-field'
                    type="text"
                    name="email"
                    placeholder="Email"
                />                                
                <input
                    {...register("password", { required: true })} 
                    className='input-field'
                    type="password" 
                    name="password" 
                    placeholder="Password"
                />
                <button type="submit" className='btn-primary w-full py-2.5'>
                    Login
                </button>
                <div className='pt-2 text-center'>
                    <p className='text-xs uppercase tracking-widest text-zinc-500'>Or continue with</p>
                    <button type="button" className='icon-btn mx-auto mt-3 h-11 w-11 text-2xl' onClick={() => signIn()}>
                        <AiFillGithub/>
                    </button>
                </div>
                <p className='text-center text-sm text-zinc-400'>
                    Don't have an account?{' '}
                    <span className='cursor-pointer font-medium text-emerald-400 hover:text-emerald-300' onClick={redirectToSignup}>
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
