import Image from "next/image";
import Leaderboard from './leaderboard/LeaderboardServer'

export const revalidate = 10;
export default function Home() {
  return <Leaderboard />;
}
