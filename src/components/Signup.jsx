import React, { useState } from 'react'
import { Input, Button, Logo } from './index'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logIn } from '../store/authSlice'
import authService from '../appWrite/authService'
import { useForm } from 'react-hook-form'

function Signup() {
    const [error, seterror] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()

    const signup = async (data) => {
        seterror("")
        console.log("Signup function called!");
        try {
            const newUser = await authService.createAccount(data)
            if (newUser) {
                const userData = await authService.getCurrentUser()
                if (userData)
                    dispatch(logIn(userData))
                navigate("/")
            }
        } catch (error) {
            seterror(error.message)
        }
    }
    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(signup)}>
                    <div className='space-y-5'>
                        <Input
                            label="Email:"
                            placeholder="example@email.com"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />

                        <Input
                            label="Password:"
                            placeholder="Example@1234"
                            type="password"
                            {...register("password", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value) ||
                                        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one number"
                                }
                            })}
                        />

                        <Button type='submit' className='w-full '>Create Account</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup