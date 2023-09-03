'use client'

import { FC, useRef, useState } from "react"
import { format } from 'date-fns'

import { cn } from "@/lib/utils"
import Image from "next/image"

interface MessagesProps {
    initialMessages: Message[]
    sessionId: string
    sessionImg: string
    partnerImg: string
}

const Messages: FC<MessagesProps> = ({initialMessages, sessionId, sessionImg, partnerImg}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)

    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    const formatTimestamp = (timestamp: number) => format(timestamp, 'HH:mm')

    return (
        <div className="flex flex-col-reverse h-full flex-1 gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-roundeds scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            <div ref={scrollDownRef}>
                {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === sessionId
                    const hasNextMessageFromSameUser = messages[index + 1] && (messages[index + 1].senderId === message.senderId)


                    return (
                        <div
                            className="chat-message"
                            key={`${message.id}-${message.timestamp}`}
                        >
                            <div className={cn('flex items-end my-1.5', {
                                'justify-end': isCurrentUser
                            })}>
                                <div className={cn('flex flex-col text-base max-w-xs mx-2', {
                                    'order-1 items-end': isCurrentUser,
                                    'order-2 items-start': !isCurrentUser
                                })}>
                                    <span className={cn('px-4 py-2 rounded-lg iniline-block', {
                                        'bg-indigo-600 text-white': isCurrentUser,
                                        'bg-gray-200 text-gray-900': !isCurrentUser,
                                        'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                        'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser
                                    })}>
                                        {message.text}{' '}
                                        <span className="ml-2 text-xs text-gray-400">
                                            {formatTimestamp(message.timestamp)}
                                        </span>
                                    </span>
                                </div>
                                <div className={cn('relative w-7 h-7', {
                                    'order-2': isCurrentUser,
                                    'order-1': !isCurrentUser,
                                    'invisible': hasNextMessageFromSameUser
                                })}>
                                    <Image
                                        fill
                                        src={isCurrentUser ? sessionImg : partnerImg}
                                        alt="img"
                                        referrerPolicy="no-referrer"
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Messages