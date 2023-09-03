'use client'

import Button from "@/components/ui/Button";
import axios from "axios";
import { FC, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import TextareaAutosize from 'react-textarea-autosize'
import MessageLengthCounter from "./MessageLengthCounter";

interface ChatInputProps {
    chatPartner: User
    chatId: string
}

const ChatInput: FC<ChatInputProps> = ({chatPartner, chatId}) => {
    const {control, getValues, setValue, watch} = useForm<{chatInput: string}>({
        defaultValues: {
            chatInput: ''
        }
    })
    const [loading, setLoading] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    
    const sendMessage = async () => {
        const message: string | undefined = getValues('chatInput')

        if (!message || !(message && message.trim()))
            return
        
        setLoading(true)

        try {
            
            await axios.post('/api/message/send', {
                text: message.trim(),
                chatId,
            })

            setValue('chatInput', '')
            textareaRef.current?.focus()
        }
        catch (err) {
            toast.error('Something went wrong. Please try again!')   
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-between border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <div className="flex-[0.98] items-center flex overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 cursor-text mr-4">
                <Controller
                    name="chatInput"
                    control={control}
                    render={({field: {value, onChange}}) => (
                        <TextareaAutosize
                            ref={textareaRef}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    sendMessage()
                                }
                            }}
                            rows={1}
                            value={value}
                            onChange={(e) => {
                                if (value.length >= 1000 && e.currentTarget.value.length >= value.length)
                                    return

                                onChange(e.currentTarget.value.length > 1000 ? e.currentTarget.value.slice(0, e.currentTarget.value.length - (e.currentTarget.value.length - 1000)) : e)
                            }}
                            placeholder={`Message ${chatPartner.name}`}
                            className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 text-sm sm:leading-6"
                        />
                    )}
                />
                <MessageLengthCounter control={control}/>   
            </div>
            <Button
                onClick={sendMessage}
                isLoading={loading}
            >
                {!loading && 'Post'}
            </Button>
        </div>
    )
}

export default ChatInput