import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getTeamById } from "@/lib/teams"
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import Leaderboard from "@/app/leaderboard/LeaderboardServer";
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
import { createClient } from "@/lib/supabase/server";

export default async function TeamPage() {
    const session = await getSession();
    const supabase = await createClient();
    console.log('team page')
    if (!session || !session.teamId) {
        console.log('redirect to home')
        redirect("/");
    }
    const { data: team } = await supabase
        .from("team")
        .select("*, next_challenge(*)")
        .eq("id", session.teamId)
        .single();

    if (!team) {
        console.log('redirect to home x2')
        redirect("/");
    }

    const activitiesSupabase = await supabase
        .from("activity_view")
        .select(
            `*`
        )
        .or(`team.eq.${team.id},team_opponent.eq.${team.id}`);
    const activities = activitiesSupabase.data;

    const getPoints = () => {
        return (
            activities
                ?.filter((a) => a.team === team.id)
                .reduce(
                    (acc, curr) => acc + (curr?.points || 0),
                    0
                ) ?? 0
        );
    };
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8 text-center">{team.name}</h1>

            <Card className="max-w-xl mx-auto">
                <CardContent className="p-4">
                    <div className="space-y-4">
                    <div className="flex justify-between items-center">
                            <span className="font-medium">Neste post:</span>
                            <span className="text-2xl font-bold">
                              {team.next_challenge?.title}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Poeng:</span>
                            <span className="text-2xl font-bold">
                                <AnimatedPoints points={getPoints()} />
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">QR-Kode:</span>
                            <span className="text-2xl font-bold">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <QRCodeIcon />
                                    </DialogTrigger>
                                    <DialogOverlay />
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <QRCode url={`/team/${team.id}`} />
                                    </DialogContent>
                                </Dialog>
                            </span>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-2">
                                Siste aktivitet
                            </h3>
                            {activities && activities.length > 0 ? (
                                <ul className="space-y-2">
                                    {activities.map((activity) => (
                                        <li
                                            key={activity.id}
                                            className="text-sm"
                                        >
                                            {/* <span className="text-muted-foreground">
                                            </span> */}
                                            <span className="ml-2">
                                                {activity?.title}
                                            </span>
                                            {activity.team === team.id && <span className="ml-2 font-medium">
                                                +{activity?.points}{" "}
                                                poeng
                                            </span>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="pl-2 text-sm text-muted-foreground">
                                    Ingen aktiviteter enda.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Leaderboard />
        </div>
    );
}
