import { createSession, getSession } from "@/lib/auth";
import { SIGNUP_CHALLENGE } from "@/lib/challenges";
import db from "@/lib/db";
import { NextPageProps } from "@/lib/types";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// this is a route to set the session cookie
// cant do that in server-component
export async function GET(request: NextRequest, nextPageProps: NextPageProps) {
    const { slug } = await nextPageProps.params;
    const loggedIn = await getSession();

    const team = db.getTeamById(slug);
    if (loggedIn?.teamId && team?.activated) {
        redirect(`/team/${slug}`);
        // return NextResponse.redirect(`/team/${slug}`)
    }

    if (!team) {
        return redirect("/");
    }
    await createSession(team.id);
    if (!team.activated) {
        db.activateTeam(team.id);
        db.addActivity({
            id: "1",
            team: db.getTeamById(team.id),
            challenge: SIGNUP_CHALLENGE,
        });
    }
    redirect(`/team/${team.id}/`);
}
