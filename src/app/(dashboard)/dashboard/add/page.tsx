'use client'

import { FC } from "react";

import AddFriendButton from "@/components/AddFriendButton/AddFriendButton";

const AddFriend: FC = () => {

    return (
        <main
            className="pt-8"
        >
            <h1 className="fonr-bold text-5xl mb-8">Add a friend</h1>
            <AddFriendButton/>
        </main>
    )
}

export default AddFriend