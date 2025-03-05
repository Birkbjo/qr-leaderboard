import { Refresh } from "./Refresh";
import { AnimatedPoints } from "@/components/AnimatedPoints";
import { createClient } from "@/lib/supabase/server";
import { Team } from "@/lib/teams/teams.conf";
import Leaderboard from "./Leaderboard";

export default async function LeaderboardData() {
    const supabase = await createClient();

    const getTeams = async () => {
        const { data: teams } = await supabase.from("leaderboard").select("*");
        return teams;
    }

    return <Leaderboard teamsPromise={getTeams()} />
}

