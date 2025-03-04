import 'server-only'
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_change_this_in_production"
);

type SessionData = {
    id: string;
    username?: string;
    teamId: string;
    isAdmin?: boolean;
};

export async function signJwtToken(data: SessionData) {
    return new SignJWT(data)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);
}

export async function verifyJwtToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as SessionData;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    console.log("session", sessionCookie);
    if (!sessionCookie?.value) {
        return null;
    }

    try {
        return await verifyJwtToken(sessionCookie.value);
    } catch (error) {
        return null;
    }
}

export async function createSession(teamId: string) {
    const cookieStore = await cookies();
    // Create a session token for the team
    const sessionToken = await signJwtToken({
        id: nanoid(),
        teamId: teamId,
    });

    // Set the session cookie
    cookieStore.set({
        name: "session",
        value: sessionToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, teamId };
}
