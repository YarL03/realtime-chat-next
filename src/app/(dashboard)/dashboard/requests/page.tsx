import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

import { fetchRedis } from "@/helpers/redis"

import { authOptions } from "@/lib/auth"
import FrinedRequests from "@/components/FriendRequests"
import { JSONParseAsync } from "@/lib/utils"

const FriendRequestsPage = async () => {
    const session = await getServerSession(authOptions)

    if (!session)
        notFound()

    const incomingSenderIds = await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as string[]

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const sender = await JSONParseAsync<User>(fetchRedis<string>('get', `user:${senderId}`))
            
            return {
                senderId,
                senderEmail: sender.email
            }
        })
    )
        
    return (
        <main className="pt-8">
            <h1 className="fonr-bold text-5xl mb-8">Friend requests</h1>
            <div className="flex flex-col gap-4">
                <FrinedRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
            </div>
        </main>
    )
}

export default FriendRequestsPage