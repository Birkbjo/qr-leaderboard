"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Refresh = () => {
    const router = useRouter();
    useEffect(() => {
        setInterval(() => {
            router.refresh();
        }, 5000);
    }, [router]);
    return null;
};
