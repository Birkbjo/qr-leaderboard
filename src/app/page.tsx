import Image from "next/image";
import Leaderboard from './leaderboard/LeaderboardServer'

export const dynamic = 'force-dynamic'
export default function Home() {
  return <Leaderboard />;
}
