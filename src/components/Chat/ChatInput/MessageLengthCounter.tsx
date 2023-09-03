import { FC } from "react";
import { Control, UseFormWatch, useWatch } from "react-hook-form";

interface MessageLengthCounterProps {
    control: Control<{chatInput: string}>
}

const MessageLengthCounter: FC<MessageLengthCounterProps> = ({control}) => {
    const messageWatch = useWatch({control, name: 'chatInput'})
    // const messageWatch = watch('chatInput')

    return (
        <div className="p-2 text-gray-600 opacity-95 text-sm">
        <span>
            {`${messageWatch.length}/1000`}
        </span>
        </div>
    )
}

export default MessageLengthCounter