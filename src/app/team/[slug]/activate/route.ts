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
    const supabase = await createClient()
    const { slug } = await nextPageProps.params;
    const loggedIn = await getSession();
    console.log('in activate', loggedIn)
    if (loggedIn?.teamId) {
        console.log('loggedIn', loggedIn);
        redirect(`/team`);
    }

    console.log('get team')
    const { data: team } = await supabase.from('team').select('*').eq('id', slug).single()
    console.log('team', team)
    if (!team) {
        return redirect("/");
    }
    const isAdmin = team.name === 'Admin';
    console.log('create session')   
    await createSession(team.id, isAdmin);

    if (!team.activated && !isAdmin) {
        console.log('activate team')
        await supabase.from('team').update({ activated: true }).eq('id', team.id)
        await supabase.from('activity').insert({
            team: team.id,
            challenge: 'b2c923b8-2c9b-4e5a-84b8-0fb54fbe2089'
        })
    }
    console.log('redirect to teampage')
    redirect(`/team`);
}
