import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import Image from "next/image";
import Messages from "@/components/Chat/Messages";

import { messageArrayValidator } from "@/lib/validations/message";

import { fetchRedis } from "@/helpers/redis";

import { authOptions } from "@/lib/auth";
import { JSONParseAsync } from "@/lib/utils";
import ChatInput from "@/components/Chat/ChatInput";

interface ChatProps {
    params: {
        chatId: string
    }
}

async function getChatMessages(chatId: string) {
    try {
        const dbMessages = await JSONParseAsync<Message[]>(fetchRedis<string[]>(
            'zrange',
            `chat:${chatId}:messages`,
            0,
            -1
        ))

        // const reversedMessages = [...dbMessages].reverse()

        const messages = messageArrayValidator.parse(dbMessages)

        return messages 
    }
    catch (err) {
        notFound()
    }
}

const Chat = async ({params}: ChatProps) => {
    const {chatId} = params
    
    const session = await getServerSession(authOptions)
    
    if (!session) 
        notFound()

    const [userId1, userId2] = chatId.split('--')

    if (!userId2 || (session.user.id !== userId1 && session.user.id !== userId2))
        notFound()
    
    const chatPartnerId = session?.user.id === userId1 ? userId2 : userId1

    const [chatPartner, initialMessages] = await Promise.all([
        JSONParseAsync<User>(fetchRedis<string>('get', `user:${chatPartnerId}`)),
        getChatMessages(chatId)
    ])


    return (
        <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-2rem)]">
            <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                            <Image
                                fill
                                referrerPolicy="no-referrer"
                                src={chatPartner.image}
                                alt={`${chatPartner.name} profile picture`}
                                className="rounded-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="text-xl flex items-center">
                            <span className="text-gray-700 mr-3 font-semibold">
                                {chatPartner.name}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600">
                            {chatPartner.email}
                        </span>
                    </div>
                </div>
            </div>
            <Messages
                sessionImg={session.user.image as string}
                partnerImg={chatPartner.image}
                initialMessages={initialMessages}
                sessionId={session.user.id}
            />
            <ChatInput chatPartner={chatPartner} chatId={chatId}/>
        </div>
    )
}

export default Chat