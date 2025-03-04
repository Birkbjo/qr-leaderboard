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
import  db from "@/lib/db";
import { NextPageProps } from "@/lib/types";
import Leaderboard from '@/app/leaderboard/Leaderboard'

export default async function TeamPage({ params }: NextPageProps) {
    const param = await params
    const session = await getSession();

    if(!session) { 
        redirect('/')
    }
    const opponent = db.getTeamById(param.slug);
    const teams = db.getTeams();
    if (!opponent) {
        redirect("/");
    }
    if(opponent.id === session.teamId || !opponent.activated) {
        redirect(`/team`)
    }
    console.log('team', opponent)

    const currTeam = db.getTeamById(session.teamId)
    const isVersus = opponent.id !== session?.teamId
    // if(isVersus) {
    //     redirect(`/challenge/${team.id}/`)
    // }
    // // Only allow team members or admins to view team page
    // if (!session?.isAdmin && session?.teamId !== team.id) {
    //     redirect("/");
    // }

    const activities = db.getTeamActivities(opponent.id);
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8 text-center">You won against <br /> {opponent.name}</h1>

            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Team Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total Points:</span>
                            <span className="text-2xl font-bold">
                                {db.getPoints(opponent.id)}
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
                                            <span className="text-muted-foreground">
                                                {new Date(
                                                    activity.timestamp
                                                ).toLocaleString()}
                                            </span>
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
