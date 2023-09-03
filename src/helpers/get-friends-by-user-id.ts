import { JSONParseAsync } from "@/lib/utils"
import { fetchRedis } from "./redis"

export async function getFriendsByUserId(userId: string) {
    try {
        if (!userId)
            return null

        const friendIds = await fetchRedis<string[]>('smembers', `user:${userId}:friends`)

        const friends = await Promise.all(
            friendIds.map(async id => await JSONParseAsync<User>(fetchRedis<string>('get', `user:${id}`)))
        )

        return friends
    }
    catch(err) {

    }
} 