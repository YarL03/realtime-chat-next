'use client'

import { FC, PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider: FC<PropsWithChildren> = ({children}) => {

    return (
        <>
            <Toaster position="top-center"/>
            {children}
        </>
    )
}

export default ToastProvider