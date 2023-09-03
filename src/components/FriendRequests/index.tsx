'use client'

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { FriendRequestItem } from "./FriendRequestItem";

interface FrinedRequestsProps {
    incomingFriendRequests: IncomingFriendRequestType[]
    sessionId: string
}

const FrinedRequests: FC<FrinedRequestsProps> = ({incomingFriendRequests}) => {
    const router = useRouter()
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequestType[]>(incomingFriendRequests)

    const friendRequestClickHandler = async (mode: 'deny' | 'accept', senderId: string) => {
        await axios.post(`/api/friends/${mode}`, {id: senderId})

        setFriendRequests((curr) => curr.filter(item => item.senderId !== senderId))

        router.refresh()
    }

    return (
        <>
            {!friendRequests.length
                ?   <p className="text-sm text-zinc-500">Nothing to show here...</p>
                :   (friendRequests.map(item => (
                    <FriendRequestItem clickHandler={friendRequestClickHandler} key={item.senderId} friendRequest={item}/>
                )))
            }
        </>
    )
}

export default FrinedRequests