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

export default async function TeamPage() {
    const session = await getSession();
    if (!session || !session.teamId) {
        redirect("/");
    }
    const team = db.getTeamById(session.teamId);

    if (!team) {
        redirect("/");
    }

    const activities = db.getTeamActivities(team.id);
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8 text-center">{team.name}</h1>

            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Team Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total Points:</span>
                            <span className="text-2xl font-bold">
                                <AnimatedPoints points={db.getPoints(team.id)} />
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">QR-Code:</span>
                            <span className="text-2xl font-bold">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <QRCodeIcon />
                                    </DialogTrigger>
                                    <DialogOverlay/>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Team QR Code
                                                </DialogTitle>
                                            </DialogHeader>
                                            <QRCode url = {`/team/${team.id}`} />
                                        </DialogContent>
                                </Dialog>
                            </span>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-2">
                                Recent Activity
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
                                                {activity.challenge.title}
                                            </span>
                                            <span className="ml-2 font-medium">
                                                +{activity.challenge.points}{" "}
                                                points
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No recent activity
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
