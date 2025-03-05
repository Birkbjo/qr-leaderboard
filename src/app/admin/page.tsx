import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCode } from "@/components/QRCode";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";

export default async function AdminPage() {
    const session = await getSession();
    if (!session?.isAdmin) {
        redirect("/");
    }

    const supabase = await createClient();
    const { data: teams } = await supabase.from("team").select("*");

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8 text-center print:hidden">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-8">
                {teams?.map((team) => (
                    <Card key={team.id} className="pixel-border-wrapper">
                            <div className="bg-[#2a2a2a] pixel-border-inner p-4">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-xl text-center text-green-400 pixel-text">
                                        {team.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 mt-4">
                                    <div className="flex flex-col items-center space-y-4">
                                        <QRCode url={`/team/${team.id}/activate`} />
                                        <p className="text-xs text-green-400 pixel-text">
                                            Scan to join team
                                        </p>
                                    </div>
                                </CardContent>
                            </div>
                    </Card>
                ))}
            </div>
        </div>
    );
} 