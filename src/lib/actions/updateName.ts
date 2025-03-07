"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth";
import { createClient } from "../supabase/server";

export async function updateName(formData: FormData) {
    console.log("updateName");
    const session = await getSession();
    if (!session || !session.teamId) {
        throw new Error("Unauthorized");
    }

    const newName = formData.get("name") as string;

    const supabase = await createClient();
    const { data, error, status } = await supabase
        .from("team")
        .update({ given_name: newName })
        .eq("id", session.teamId);

    console.log({ data, error, status });
    // revalidatePath("/team");
    // return data;
}
