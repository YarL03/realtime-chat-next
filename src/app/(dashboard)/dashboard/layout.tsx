import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import FriendRequestsSidebarOptions from "@/components/FriendRequestsSidebarOption/FriendRequestsSidebarOptions";
import SignOutButton from "@/components/SignOutButton/SignOutButton";

import { authOptions } from "@/lib/auth";

import { Icon, Icons } from "@/components/ui/Icons";
import { fetchRedis } from "@/helpers/redis";

interface ISidebarOption {
    id: number
    name: string
    href: string
    Icon: Icon
}

const sidebarOptions: ISidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus'
    }
]

const Layout = async ({children}: {children: ReactNode}) => {
    const session = await getServerSession(authOptions)

    if (!session)
        notFound()

    const unseenRequestsCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as User[]).length

    return (
        <div
            className="w-full h-screen flex"
        >
            <div
                className="w-full h-screen flex max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                <Link href="/dashboard" className="h-16 flex shrink-0 items-center">
                    <Image
                        src={require('../../../assets/logo.png')}
                        alt="logo"
                        className="h-8 w-auto"
                    />
                </Link>
                <div className="text-xs font-semibold loading-6 text-gray-400">
                    Your chats
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                       <li>
                            /1/1 chats that user has
                        </li>
                        <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                                Overview
                            </div>
                            <ul className="-mx-2 mt-2 space-y-1">
                                {sidebarOptions.map(option => {
                                    const Icon = Icons[option.Icon]

                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                            >
                                                <span className="text=gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                                    <Icon className="h-4 w-4"/>
                                                </span>
                                                <span className="truncate">{option.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>

                        <li>
                            <FriendRequestsSidebarOptions
                                sessionId={session.user.id}
                                initialUnseenRequestsCount={unseenRequestsCount}
                            />
                        </li>
                        
                        <li className="-mx-6 mt-auto flex items-center">
                            <div className="flex flex-1 flex-shrink-0 items-center gap-x-1.5 px-3 py-3 text-sm font-semibold leading-6 text-gray-dash-900">
                                <div className="relative h-8 w-8 bg-gray-50">
                                    <Image
                                        fill
                                        alt="avatar"
                                        referrerPolicy="no-referrer"
                                        className="rounded-full"
                                        src={session.user.image || ''}
                                    />
                                </div>
                                <div className="flex flex-col w-[193px]">
                                    <span className="truncate">{session.user.name}</span>
                                    <span className="text-xs text-zinc-400 truncate">
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>
                            <SignOutButton className="h-full aspect-square flex flex-shrink-0"/>
                        </li>
                    </ul>
                </nav>
            </div>
            {children}
        </div>
    )
}

export default Layout