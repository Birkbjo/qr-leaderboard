import { redirect } from "next/navigation";
// import { getTeamById } from "@/lib/teams"
import { getSession } from "@/lib/auth";
import { NextPageProps } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { MessageRedirect } from "@/components/MessageRedirect";

const timeBetweenActivities = 5 * 60 * 1000;

function wrapNumber(value: number, min: number, max: number) {
    if (value < min) return max;
    if (value > max) return min;
    return value;
}
export const dynamic = "force-dynamic";
export default async function VersusPage({ params }: NextPageProps) {
    const session = await getSession();
    const param = await params;
    if (!session) {
        redirect(`/team/${param.slug}/activate`);
    }

    const supabase = await createClient();
    if (!session) {
        redirect("/");
    }

    if (param.slug === session.teamId) {
        console.log("Slug is session.teamId - redirecting to /team");
        redirect("/team");
    }

    const getData = async () => {
        const opponent = supabase
            .from("team")
            .select("*, next_challenge(*)")
            .eq("id", param.slug)
            .single();
        const currTeam = supabase
            .from("team")
            .select("*, next_challenge(*)")
            .eq("id", session.teamId)
            .single();
        const challenges = supabase
            .from("challenge")
            .select("*")
            .order("index", { ascending: false, nullsFirst: false });
        // .filter("index", ">=", 0);
        // .order("index", { ascending: false, nullsFirst: false }).limit(1).single()
        return Promise.all([opponent, currTeam, challenges]);
    };
    const [{ data: opponent }, { data: currTeam }, { data: challenges }] =
        await getData();
    if (!opponent || !opponent.activated || !challenges || !currTeam) {
        console.log("No opponent or challenges or currTeam");
        return (
            <MessageRedirect message="Fant ingen motstander, oppgaver eller lag. Er det riktig id for laget?" />
        );
    }
    const lastActivities = await supabase
        .from("activity")
        .select("*, challenge!inner(*)")
        .eq("challenge.versus", true)
        .or(`team.eq.${session.teamId},team_opponent.eq.${session.teamId}`)
        .gt(
            "created_at",
            new Date(Date.now() - timeBetweenActivities).toISOString()
        )
        .order("created_at", { ascending: false });

    if (lastActivities.data && lastActivities.data.length > 0) {
        return (
            <MessageRedirect
                time={10000}
                message="Du eller motstanderen har allerede registrert en aktivitet de siste 5 minuttene. Vennligst vent 5 minutter før du prøver igjen."
            />
        );
    }

    const maxChallengeIndex = challenges[0].index || 5;
    const minChallenge = 1;

    await supabase.from("activity").insert({
        team: currTeam.id,
        team_opponent: opponent.id,
        challenge: currTeam?.next_challenge?.id,
    });

    const currentChallenge = currTeam?.next_challenge;
    const updateNextChallenge = async (team: NonNullable<typeof currTeam>) => {
        const currChallengeIndex = team.next_challenge?.index ?? 1;
        const nextChallengeIndex =
            team.index % 2 === 0
                ? wrapNumber(
                      currChallengeIndex + 1,
                      minChallenge,
                      maxChallengeIndex
                  )
                : wrapNumber(
                      currChallengeIndex - 1,
                      minChallenge,
                      maxChallengeIndex
                  );

        const nextChallenge =
            challenges.find((c) => c.index === nextChallengeIndex)?.id ?? null;
        await supabase
            .from("team")
            .update({
                next_challenge: nextChallenge,
            })
            .eq("id", team.id);
    };

    await Promise.all([
        updateNextChallenge(currTeam),
        updateNextChallenge(opponent),
    ]);

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">
                <MessageRedirect
                    message={`Gratulerer, du har vunnet mot ${opponent.name} i ${currentChallenge?.title}!`}
                />
            </h1>
        </div>
    );
}
