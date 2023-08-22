'use client'

import { FC, useState } from "react";
import axios, { AxiosError } from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";

import Button from "../ui/Button";
import { addFriendValidation } from "@/lib/validations/add-friend";

type FormData = z.infer<typeof addFriendValidation>

const AddFriendButton: FC = () => {
    const {register, handleSubmit, setError, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(addFriendValidation)
    })
    const [showSuccess, setShowSuccess] = useState(false)

    const addFriend = async (email: string) => {
        try {
            const validatedEmail = addFriendValidation.parse({email})

            await axios.post('/api/friends/add', {
                email: validatedEmail
            })

            setShowSuccess(true)
        }
        catch (err) {
            if (err instanceof z.ZodError) {
                setError('email', {message: err.message})
                return 
            }
            
            if (err instanceof AxiosError) {
                setError('email', {message: err.response?.data})
                return 
            }

            setError('email', {message: 'Something went wrong'})
        }
    }

    const onSubmit: SubmitHandler<FormData> = (data) => {
        addFriend(data.email)
    }

    return (
        <form 
            className="max-w-sm"
            onSubmit={handleSubmit(onSubmit)}
        >
            <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                Add a friend by email
            </label>
            <div className="mt-2 flex gap-4">
                <input
                    {...register('email')}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="you@example.ru"
                />
                <Button>Add</Button>
            </div>
            {errors.email && 
                <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
            </p>}
            {showSuccess && 
                <p className="mt-1 text-sm text-green-600">
                    Friend request sent!
            </p>}
        </form>
    )
}

export default AddFriendButton