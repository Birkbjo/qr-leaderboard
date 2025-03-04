import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Trophy } from "lucide-react"
// import { getSession } from "@/app/lib/auth"
// import { logout } from "@/app/lib/actions"

export async function Navbar() {
  const session = await getSession()

  return (
    <header className="border-b-2 border-green-400 bg-[#1a1a1a]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-green-400">
          <Trophy className="h-6 w-6" />
          <span className="text-xs uppercase tracking-wider pixel-text">8-bit Challenge</span>
        </Link>

        <nav className="flex items-center gap-4">
          {session ? (
            <>
              {session.isAdmin && (
                <Link href="/admin">
                  <Button variant="pixel" size="sm">
                    Admin
                  </Button>
                </Link>
              )}

              {session.teamId && (
                <Link href={`/team/${session.teamId}`}>
                  <Button variant="pixel" size="sm">
                    My Team
                  </Button>
                </Link>
              )}

              <form action={logout}>
                <Button variant="pixel" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button variant="pixel" size="sm">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

