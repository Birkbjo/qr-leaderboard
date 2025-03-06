"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { HomeIcon } from "lucide-react";

export const MessageRedirect = ({
    message,
    redirectTo = "/team",
    time = 5000,
}: {
    message: string;
    redirectTo?: string;
    time?: number;
}) => {
    const router = useRouter();
    const replace = router.replace;
    useEffect(() => {
        const t = setTimeout(() => {
            replace(redirectTo);
        }, time ?? 5000);
        return () => clearTimeout(t);
    }, [replace, redirectTo, time]);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8 text-center">{message}</h1>
            <div className="flex justify-center items-center">
                <Button onClick={() => replace(redirectTo)}><HomeIcon className="" /></Button>
            </div>
        </div>
    );
};
