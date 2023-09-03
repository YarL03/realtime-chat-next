import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

import { fetchRedis } from "@/helpers/redis";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', {status: 401})
        }

        const body = await req.json()

        const {id: idToAdd} = z.object({id: z.string()}).parse(body)

        const isAlreadyFriends = await fetchRedis<0 | 1>('sismember', `user:${session.user.id}:friends`, idToAdd)

        if (isAlreadyFriends) {
            return new Response('Already friends', {status: 400})
        }

        const hasFriendRequest = await fetchRedis<0 | 1>('sismember', `user:${session.user.id}:incoming_friend_requests`, idToAdd)

        if (!hasFriendRequest) {
            return new Response('No friend request', {status: 400})
        }

        await Promise.all([
            db.sadd(`user:${session.user.id}:friends`, idToAdd),
            db.sadd(`user:${idToAdd}:friends`, session.user.id),
            db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)
        ])

        return new Response()
    }
    
    catch (err) {
        if (err instanceof z.ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }


        return new Response('Invalid request', {status: 400})
    }
}