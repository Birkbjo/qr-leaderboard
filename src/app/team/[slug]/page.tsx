import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// import { getTeamById } from "@/lib/teams"
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { NextPageProps } from "@/lib/types";
import Leaderboard from "@/app/leaderboard/LeaderboardServer";
import { createClient } from "@/lib/supabase/server";

export default async function TeamPage({ params }: NextPageProps) {
    const param = await params;
    const supabase = await createClient();
    const session = await getSession();

    if (!session) {
        redirect("/");
    }
    const { data: opponent } = await supabase
        .from("team")
        .select("*")
        .eq("id", param.slug)
        .single();
    if (!opponent) {
        redirect("/");
    }
    if (opponent.id === session.teamId || !opponent.activated) {
        redirect(`/team`);
    }
    console.log("team", opponent);

    const currTeam = db.getTeamById(session.teamId);
    const isVersus = opponent.id !== session?.teamId;
    // if(isVersus) {
    //     redirect(`/challenge/${team.id}/`)
    // }

    const activities = db.getTeamActivities(opponent.id);
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8 text-center">
                You won against <br /> {opponent.name}
            </h1>

            <Leaderboard />
        </div>
    );
}
