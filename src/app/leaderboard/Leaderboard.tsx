"use client";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { AnimatedPoints } from "@/components/AnimatedPoints";
import { use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type LeaderboardProps = {
    teamsPromise: Promise<
        | {
              name: string | null;
              points: number | null;
          }[]
        | null
    >;
};

export default function Leaderboard({ teamsPromise }: LeaderboardProps) {
    const lastRefresh = useRef(0);
    const teams = use(teamsPromise);
    const router = useRouter();
    const refresh = router.refresh;

    useEffect(() => {
        const throttledRefresh = () => {
            if (Date.now() - lastRefresh.current > 500) {
                lastRefresh.current = Date.now();
                refresh();
            }
        };
        const channel = supabaseBrowserClient
            .channel("supabase_realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public" },
                (payload) => {
                    console.log(payload);
                    throttledRefresh();
                }
            );
        channel.subscribe();
        return () => {
            channel.unsubscribe();
        };
    }, [refresh]);

    // Refresh the leaderboard every 30 seconds, incase realtime doesnt work
    useEffect(() => {
        setInterval(() => {
            if (Date.now() - lastRefresh.current > 10000) {
                lastRefresh.current = Date.now();
                // refresh();
            }
        }, 5000);
    }, [refresh]);
    console.log({ teams });
    return (
        <div className="container mx-auto py-10 px-4">
            {/* <Refresh /> */}
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-purple-500 animate-gradient">
                    LEADERBOARD
                </h1>
                <p className="text-xs md:text-sm text-green-400 max-w-2xl mx-auto leading-relaxed">
                    Bendik og Birks 61 års-challenges.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="pixel-border-wrapper">
                    <div className="pixel-border bg-[#1a1a1a]">
                        <div className="bg-[#2a2a2a] pixel-border-inner p-2">
                            <div className="flex justify-between items-center text-xs md:text-sm px-4 py-2">
                                <div className="w-16 text-center text-yellow-400">
                                    Plass
                                </div>
                                <div className="flex-1 text-center text-yellow-400">
                                    Lag
                                </div>
                                <div className="w-24 text-center text-yellow-400">
                                    Poeng
                                </div>
                            </div>
                        </div>

                        {teams?.length === 0 ? (
                            <div className="py-8 text-center text-green-400 text-xs md:text-sm pixel-text">
                                Ingen lag har blitt med enda.
                            </div>
                        ) : (
                            <ul className="divide-y divide-[#2a2a2a]">
                                {teams?.map((team, index) => (
                                    <li
                                        key={team.name}
                                        className={`flex items-center p-4 ${
                                            index < 3 ? "bg-[#2a2a2a]/20" : ""
                                        } hover:bg-[#2a2a2a]/40 transition-colors`}
                                    >
                                        <div className="w-16 text-center">
                                            {index === 0 ? (
                                                <div className="pixel-box bg-yellow-500 text-xs">
                                                    1ST
                                                </div>
                                            ) : index === 1 ? (
                                                <div className="pixel-box bg-gray-400 text-xs">
                                                    2ND
                                                </div>
                                            ) : index === 2 ? (
                                                <div className="pixel-box bg-amber-700 text-xs">
                                                    3RD
                                                </div>
                                            ) : (
                                                <span className="text-sm text-green-400">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center text-xs md:text-sm text-white">
                                            {team.name}
                                        </div>
                                        <div className="w-24 text-center text-sm font-bold">
                                            <AnimatedPoints
                                                points={team.points ?? 0}
                                                className={`${
                                                    index === 0
                                                        ? "text-yellow-400"
                                                        : index === 1
                                                        ? "text-gray-300"
                                                        : index === 2
                                                        ? "text-amber-700"
                                                        : "text-retro-primary"
                                                } pixel-text`}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="bg-[#2a2a2a] pixel-border-inner p-4 mt-2">
                            <p className="text-[10px] md:text-xs text-center text-green-400 pixel-text">
                                Scan QR-koden til ditt lag for å bli med!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
