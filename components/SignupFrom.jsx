'use client';

import React, { useEffect, useState } from 'react'
import Input from './Input'
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const initialState = {
    name: "",
    email: "",
    password: ""
}

const SignupFrom = () => {
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
        const { name, email, password } = state;
        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            setIsLoading(true);
            const newUser = { name, email, password };
            const response = await fetch("/api/signup", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                setSuccess("Registration Successful");
                setTimeout(() => {
                    router.push("/login", { scroll: false });
                }, 1000);
            } else {
                const data = await response.json(); // Get error message from response
                setError(data.message || "Error occurred while registering");
            }
        } catch (error) {
            setError("Error occurred while registering");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event) => {
        setError("");
        setState({ ...state, [event.target.name]: event.target.value })
    }
    return (
        <section className='container'>
            <form onSubmit={handleSubmit}
                className='border-2 border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5'>
                <h2 className='text-cetner special-word'>
                    Sign up
                </h2>
                <Input
                    name={'name'}
                    label={"Name"}
                    type={"text"}
                    placeholder={"enter your name"}
                    onChange={handleChange}
                    value={state.name}
                />
                <Input
                    name={'email'}
                    label={"Email"}
                    type={"email"}
                    placeholder={"enter your email"}
                    onChange={handleChange}
                    value={state.email}
                />
                <Input
                    name={'password'}
                    label={"Password"}
                    type={"password"}
                    placeholder={"enter your password"}
                    onChange={handleChange}
                    value={state.password}
                />
                {
                    error && <div className='text-red-700'>{error}</div>
                }
                {
                    success && <div className='text-green-700'>{success}</div>
                }
                <button type='submit' className='btn w-full'>
                    {isLoading ? "Loading" : "Sign up"}
                </button>
                
                <p className='text-center'>
                    Already a user? {" "}
                    <Link href={"/login"} className='text-primaryColor'>
                        Login
                    </Link>
                </p>
            </form>


        </section>
    )
}

export default SignupFrom