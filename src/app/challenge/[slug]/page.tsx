import { redirect } from "next/navigation";
// import { getTeamById } from "@/lib/teams"
import { getSession } from "@/lib/auth";
import { AnimatedPoints } from "@/components/AnimatedPoints";
import { NextPageProps } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { MessageRedirect } from "@/components/MessageRedirect";

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
            .select("*")
            .eq("id", session.teamId)
            .single();
        const challengePromise = await supabase
            .from("challenge")
            .select("*")
            .eq("id", slug)
            .single();

        let identicalActivites = supabase
            .from("activity")
            .select("*")
            .eq("challenge", slug);
        // if the challenge is not unique, we want to check uniqueness per team instead
        if (!challengePromise.data?.is_unique) {
            identicalActivites = identicalActivites.eq("team", session.teamId);
        }
        return Promise.all([teamPromise, challengePromise, identicalActivites]);
    };
    const [{ data: team }, { data: challenge }, { data: identicalActivites }] =
        await getData();

    if (!team || !challenge || challenge.versus) {
        redirect("/team");
    }

    let message = challenge.is_unique && identicalActivites?.every(a => a.team !== session.teamId)
        ? `You found a bonus code! Unfortunately, this code has already been found...`
        : `You have already completed this challenge!`;

    const alreadyCompleted =
        identicalActivites && identicalActivites.length > 0;
    if (!alreadyCompleted) {
        message =
            challenge.completion_text ?? `You have completed this challenge!`;
        await supabase.from("activity").insert({
            team: team.id,
            challenge: challenge.id,
        });
    }

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
