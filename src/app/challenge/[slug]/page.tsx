import { redirect } from "next/navigation";
// import { getTeamById } from "@/lib/teams"
import { getSession } from "@/lib/auth";
import { AnimatedPoints } from "@/components/AnimatedPoints";
import { NextPageProps } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export default async function ChallengePage({ params }: NextPageProps) {
    const session = await getSession();
    const supabase = await createClient();
    const { slug } = await params;
    if (!session || !session.teamId) {
        redirect("/");
    }
    const { data: team } = await supabase.from('team').select('*').eq('id', session.teamId).single();
    const { data: challenge } = await supabase.from('challenge').select('*').eq('id', slug).single();
    if (!team || !challenge) {
        redirect("/team");
    }

    await supabase.from('activity').insert({
        team: team.id,
        challenge: challenge.id,
    })

    return (
        <div className="container mx-auto py-10 flex flex-col items-center justify-center">
            <div>
                <h2 className="text-2xl font-bold mb-8 text-center">
                    {challenge.title}
                </h2>
                <p>Congratulations! You have completed the challenge.</p>
                <div className="flex items-center justify-center">
                    <h2 className="text-2xl font-bold mb-8 text-center">
                        <AnimatedPoints
                            plus={true}
                            points={challenge.points}
                            animateOnMount={true}
                        />
                    </h2>
                </div>
            </div>
        </div>
    );
}
