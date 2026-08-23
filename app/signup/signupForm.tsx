'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';


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
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormOptions>();
    const router = useRouter();

    const onSubmit: SubmitHandler<SignupFormOptions> = data => console.log(data);
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
