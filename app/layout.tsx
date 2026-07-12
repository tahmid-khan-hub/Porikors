import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sessionprovider from "./SessionProvider";
import QueryProvider from "./QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Porikors - Course Management Platform",
    template: "%s | Porikors",
  },
  description:
    "Porikors is a full-stack course management platform for teachers and students - create courses, share resources, post announcements, assign tasks and track grades all in one place.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <Sessionprovider>
            {children}
          </Sessionprovider>
        </QueryProvider>
      </body>
    </html>
  );
}
