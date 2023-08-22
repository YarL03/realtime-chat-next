import { LucideProps, UserPlus } from "lucide-react";
import { AppProps } from "next/app";
import Image from "next/image";
import { DetailedHTMLProps, FC, HTMLAttributes, ImgHTMLAttributes } from "react";


export const Icons = {
    Logo: ({className}: {className?: string}) => (
        <Image
            className={className}
            src={require('../../assets/logo.png')}
            alt="logo"
        />
    ),
    UserPlus
}

export type Icon = keyof typeof Icons