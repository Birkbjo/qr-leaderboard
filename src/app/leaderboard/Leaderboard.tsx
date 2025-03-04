import db  from "@/lib/db"
import { Refresh } from "./Refresh"
import { AnimatedPoints } from "@/components/AnimatedPoints"
import { Message } from "@/components/ui/message"
// import { getActiveTeams } from "@/lib/teams"

export default async function Home() {
//   const teams = await getActiveTeams()
    const teams = db.getActivatedTeams()
  return (
    <div className="container mx-auto py-10 px-4">

      <Refresh />
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-purple-500 animate-gradient">
          LEADERBOARD
        </h1>
        <p className="text-xs md:text-sm text-green-400 max-w-2xl mx-auto leading-relaxed">
          Birk og Bendiks 61 års-challenges.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="pixel-border-wrapper">
          <div className="pixel-border bg-[#1a1a1a]">
            <div className="bg-[#2a2a2a] pixel-border-inner p-2">
              <div className="flex justify-between items-center text-xs md:text-sm px-4 py-2">
                <div className="w-16 text-center text-yellow-400">RANK</div>
                <div className="flex-1 text-center text-yellow-400">TEAM</div>
                <div className="w-24 text-center text-yellow-400">POINTS</div>
              </div>
            </div>

            {teams.length === 0 ? (
              <div className="py-8 text-center text-green-400 text-xs md:text-sm pixel-text">
                NO TEAMS HAVE JOINED YET
              </div>
            ) : (
              <ul className="divide-y divide-[#2a2a2a]">
                {teams.map((team, index) => (
                  <li
                    key={team.id}
                    className={`flex items-center p-4 ${
                      index < 3 ? "bg-[#2a2a2a]/20" : ""
                    } hover:bg-[#2a2a2a]/40 transition-colors`}
                  >
                    <div className="w-16 text-center">
                      {index === 0 ? (
                        <div className="pixel-box bg-yellow-500 text-xs">1ST</div>
                      ) : index === 1 ? (
                        <div className="pixel-box bg-gray-400 text-xs">2ND</div>
                      ) : index === 2 ? (
                        <div className="pixel-box bg-amber-700 text-xs">3RD</div>
                      ) : (
                        <span className="text-sm text-green-400">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 text-center text-xs md:text-sm text-white">{team.name}</div>
                    <div className="w-24 text-center text-sm font-bold">
                      <AnimatedPoints 
                        points={db.getPoints(team.id)}
                        className={`${index === 0 
                          ? "text-yellow-400" 
                          : index === 1 
                          ? "text-gray-300" 
                          : index === 2 
                          ? "text-amber-700"
                          : "text-retro-primary"} pixel-text`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="bg-[#2a2a2a] pixel-border-inner p-4 mt-2">
              <p className="text-[10px] md:text-xs text-center text-green-400 pixel-text">
               Scan QR code to join the challenge!
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

