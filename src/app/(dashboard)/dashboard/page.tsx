import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

const Dashboard: FC = async () => {
    const session = await getServerSession(authOptions)

    return (
        <pre>
            {JSON.stringify(session, null, 2)}
        </pre>
    )
}

export default Dashboard