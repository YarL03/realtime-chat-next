'use client'

import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { FC } from "react";

interface FriendRequestItemProps {
    friendRequest: IncomingFriendRequestType
    clickHandler: (mode: 'accept' | 'deny', senderId: string) => Promise<void>
}

export const FriendRequestItem: FC<FriendRequestItemProps> = ({friendRequest, clickHandler}) => {

    return (
        <div className="flex gap-4 items-center">
            <UserPlus className="text-black"/>
            <p className="font-medium text-lg">{friendRequest.senderEmail}</p>
            <button
                onClick={() => clickHandler('accept', friendRequest.senderId)}
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
                <Check className="font-semibold text-white w-3/4 h-3/4"/>
            </button>
            <button
                onClick={() => clickHandler('deny', friendRequest.senderId)}
                className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
                <X className="font-semibold text-white w-3/4 h-3/4"/>
            </button>
        </div>
    )
}