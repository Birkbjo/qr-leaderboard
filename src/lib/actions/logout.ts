"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "../auth";

export const logout = async () => {
    await deleteSession();
    redirect("/")
}
