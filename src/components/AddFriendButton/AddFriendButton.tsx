'use client'

import { FC } from "react";

const AddFriendButton: FC = () => {

    return (
        <form className="max-w-sm">
            <label htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
        >
            Email
        </label>
        </form>
    )
}

export default AddFriendButton