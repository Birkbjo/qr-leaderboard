import { createSession, getSession } from "@/lib/auth";
import { SIGNUP_CHALLENGE } from "@/lib/challenges";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { NextPageProps } from "@/lib/types";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// this is a route to set the session cookie
// cant do that in server-component
export async function GET(request: NextRequest, nextPageProps: NextPageProps) {
    const supabase = await createClient();
    const { slug } = await nextPageProps.params;
    const loggedIn = await getSession();
    if (loggedIn?.teamId) {
        redirect(`/team`);
    }

    const { data: team } = await supabase
        .from("team")
        .select("*")
        .eq("id", slug)
        .single();
    if (!team) {
        return redirect("/");
    }
    const isAdmin = team.name === "Admin";
    await createSession(team.id, isAdmin);

    if (!team.activated && !isAdmin) {
        const promises = [
            supabase.from("team").update({ activated: true }).eq("id", team.id),
            supabase.from("activity").insert({
                team: team.id,
                challenge: "b2c923b8-2c9b-4e5a-84b8-0fb54fbe2089",
            }),
        ];
        await Promise.all(promises);
    }
    redirect(`/team`);
}
