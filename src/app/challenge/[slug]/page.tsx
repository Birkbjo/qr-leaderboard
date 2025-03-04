import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getTeamById } from "@/lib/teams"
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import Leaderboard from "@/app/leaderboard/Leaderboard";
import { QrCode as QRCodeIcon } from "lucide-react";
import { QRCode } from "@/components/QRCode";
import { AnimatedPoints } from "@/components/AnimatedPoints";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { challenges } from "@/lib/challenges";
import { NextPageProps } from "@/lib/types";
import { Message } from "@/components/ui/message";

export default async function ChallengePage({ params }: NextPageProps) {
    const session = await getSession();
    const { slug } = await params;
    if (!session || !session.teamId) {
        redirect("/");
    }
    const team = db.getTeamById(session.teamId);
    const challenge = challenges.find((challenge) => challenge.id === slug);
    if (!team || !team.activated || !challenge) {
        redirect("/");
    }

    const activities = db.getTeamActivities(team.id);
    // if (activities.find((activity) => activity.challenge.id === slug)) {
    //     setTimeout(() => redirect(`/team/${team.id}`), 2000);

    //     return <Message>You have already completed this challenge!</Message>;
    // }

    db.addActivity({
        team: team,
        challenge: challenge,
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
