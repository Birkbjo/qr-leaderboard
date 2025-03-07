import { createClient } from "@/lib/supabase/server";
import Leaderboard from "./Leaderboard";

export default async function LeaderboardData() {
    const supabase = await createClient();

    const getTeams = async () => {
        const { data: teams } = await supabase.from("leaderboard").select("*");
        return teams;
    };

    return <Leaderboard teamsPromise={getTeams()} />;
}
