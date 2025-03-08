import { redirect } from "next/navigation";
// import { getTeamById } from "@/lib/teams"
import { getSession } from "@/lib/auth";
import { AnimatedPoints } from "@/components/AnimatedPoints";
import { NextPageProps } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { MessageRedirect } from "@/components/MessageRedirect";

function wrapNumber(value: number, min: number, max: number) {
    if (value < min) return max;
    if (value > max) return min;
    return value;
}

export default async function ChallengePage({ params }: NextPageProps) {
    const session = await getSession();
    const supabase = await createClient();
    const { slug } = await params;
    if (!session || !session.teamId) {
        redirect("/");
    }

    // send in parallel, prevent waterfall requests
    const getData = async () => {
        const teamPromise = supabase
            .from("team")
            .select("*, next_challenge(*)")
            .eq("id", session.teamId)
            .single();
        const challengePromise = await supabase
            .from("challenge")
            .select("*")
            .eq("id", slug)
            .single();
            const challenges = supabase
            .from("challenge")
            .select("*")
            .order("index", { ascending: false, nullsFirst: false });
        let identicalActivites = supabase
            .from("activity")
            .select("*")
            .eq("challenge", slug);
        // if the challenge is not unique, we want to check uniqueness per team instead
        if (!challengePromise.data?.is_unique) {
            identicalActivites = identicalActivites.eq("team", session.teamId);
        }
        return Promise.all([teamPromise, challengePromise, identicalActivites, challenges]);
    };
    const [{ data: team }, { data: challenge }, { data: identicalActivites }, { data: challenges }] =
        await getData();

    if (!team || !challenge || challenge.versus || !challenges) {
        redirect("/team");
    }

    let message = challenge.is_unique && identicalActivites?.every(a => a.team !== session.teamId)
        ? `Du fant en bonus-kode! Men denne er dessverre allerede funnet av noen andre...`
        : `Dere har allerede gjort denne oppgaven!`;

    const alreadyCompleted =
        identicalActivites && identicalActivites.length > 0;
    if (!alreadyCompleted) {
        message =
            challenge.completion_text ?? `Gratulerer, dere klarte det!`;
        await supabase.from("activity").insert({
            team: team.id,
            challenge: challenge.id,
        });
    }
    const maxChallengeIndex = challenges[0].index || 5;
    const minChallenge = 1;

    const currentChallenge = team?.next_challenge;
    const updateNextChallenge = async (t: NonNullable<typeof team>) => {
        const currChallengeIndex = t.next_challenge?.index ?? 1;
        const nextChallengeIndex =
            t.index % 2 === 0
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
            .eq("id", t.id);
    };

    await Promise.all([
        updateNextChallenge(team),
    ]);
    return (
        <div className="container mx-auto py-10 flex flex-col items-center justify-center">
            <div>
                <h2 className="text-2xl font-bold mb-8 text-center">
                    {challenge.title}
                </h2>
                <MessageRedirect message={message} />
                {!alreadyCompleted && (
                    <div className="flex items-center justify-center">
                        <h2 className="text-2xl font-bold mb-8 text-center">
                            <AnimatedPoints
                                plus={true}
                                points={challenge.points}
                                animateOnMount={true}
                            />
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}
