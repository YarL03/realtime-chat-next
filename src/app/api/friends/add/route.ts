import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendValidation } from "@/lib/validations/add-friend"

import { fetchRedis } from "@/helpers/redis"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', {status: 401})
        }
        
        const body = await req.json()

        const {email: emailToAdd} = addFriendValidation.parse(body.email)

        const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
        {
            headers: {
                'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
            cache: 'no-store'
        })

        const data = await RESTResponse.json() as {result: string | null}

        const idToAdd = data.result

        if (!idToAdd) {
            return new Response('This person doesn\'t exist.', {status: 400})
        }

        if (idToAdd === session.user.id) {
            return new Response('Can\'t add yourself as a friend.', {status: 400})
        }

        //check if user is already added
        const isAlreadyAdded = await fetchRedis<0 | 1>('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) 

        if (isAlreadyAdded) {
            return new Response('Already added this user.', {status: 400})
        }

        //check if user is already your friend
        const isAlreadyFriends = await fetchRedis<0 | 1>('sismember', `user:${session.user.id}:friends`, idToAdd)

        if (isAlreadyFriends) {
            return new Response('You are already friends.', {status: 400})
        }

        await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

        return new Response('OK')

    }

    catch (err) {
        if (err instanceof z.ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }

        return new Response('Invalid request', {status: 400})
    }
}