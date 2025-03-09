import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "30x2 challenges",
    description: "QR-leaderboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.className} antialiased`}
            >
                <div className="min-h-screen bg-[#0f172a] text-white pixel-pattern p-2">
                    {children}
                </div>
            </body>
        </html>
    );
}
