'use client'
import React, { useEffect, useState } from 'react'
import Input from './Input'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';



const initialState = {

    email: "",
    password: ""
}


const LoginFrom = () => {
    const [hydrated, setHydrated] = useState(false);
    const [state, setState] = useState(initialState);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();



    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = state;
        if (!email || !password) {
            setError("ALL fields are require")
            return;
        };

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex) {
            setError("Please enter a valid email address")
            return;
        }

        if (password.length < 6) {
            setError("Password must be ata least 6 characters long..")
            return
        }

        try {
            setIsLoading(true);

            const res = await signIn("credentials", {
                email, password, redirect: false
            })

            if (res?.error) {
                setError("Invalid Credentials");
                setIsLoading(false);
                return;
            }
            router.push("/blog");

        } catch (error) {
            console.log(error);
        }

    }

    const handleChange = (event) => {
        setError("");
        setState({ ...state, [event.target.name]: event.target.value })
    }
    return (
        <section className='container'>
            <form onSubmit={handleSubmit}
                className='border-2 border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5'>
                <h2 className='text-cetner special-word'>
                    Login
                </h2>
                <Input
                    name={'email'}
                    label={"Email"}
                    type={"email"}
                    onChange={handleChange}
                    value={state.email}
                    placeholder={"enter your email"}
                />
                <Input
                    name={'password'}
                    label={"Password"}
                    type={"password"}
                    onChange={handleChange}
                    value={state.password}
                    placeholder={"enter your password"}
                />
                {
                    error && <div className='text-red-700'>{error}</div>
                }
                {
                    success && <div className='text-green-700'>{success}</div>
                }
                <button type='submit' className='btn w-full'>
                    {isLoading ? "Loading..." : "Login"}
                </button>

               
                <p className='text-center'>
                    Already a user? {" "}
                    <Link href={"/signup"} className='text-primaryColor'>
                        SingUp
                    </Link>

                </p>
            </form>
        </section>
    )
}

export default LoginFrom