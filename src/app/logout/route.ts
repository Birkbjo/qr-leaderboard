import { logout } from "@/lib/actions/logout";


export const GET = async (request: Request) => {
   await logout();
}
