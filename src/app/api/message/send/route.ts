import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { JSONParseAsync } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', {status: 401})
        }

        const body = await req.json()

        const {chatId, text} = z.object({
            chatId: z.string(),
            text: z.string()
        }).parse(body)

        const [userId1, userId2] = chatId.split('--')

        if (userId1 !== session.user.id && userId2 !== session.user.id)
            return new Response('Unauthorized', {status: 401})

        const friendId = session.user.id === userId1 ? userId2 : userId1

        const friendsList = await fetchRedis<string[]>('smembers', `user:${session.user.id}:friends`)

        const isFriend = friendsList.includes(friendId)

        if (!isFriend)
            return new Response('Unauthorized', {status: 401})

        const sender = await JSONParseAsync<User>(fetchRedis<string>('get', `user:${session.user.id}`))

        const timestamp = Date.now()

        const message: Message = {
            id: nanoid(),
            text,
            senderId: session.user.id,
            receiverId: friendId,
            timestamp
        }

        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message)
        })

        return new Response()

    } catch (err) {
        if (err instanceof z.ZodError) 
            return new Response('Invalid request payload', {status: 422})

        return new Response('Internal error', {status: 500})
    }
}