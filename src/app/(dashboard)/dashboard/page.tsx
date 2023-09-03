import { FC } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

const Dashboard: FC = async () => {
    const session = await getServerSession(authOptions)

    return (
        <pre>
            {JSON.stringify(session, null, 2)}
        </pre>
    )
}

export default Dashboard