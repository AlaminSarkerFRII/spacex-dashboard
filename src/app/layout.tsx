import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { Header } from "@/components/Header";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "SpaceX Dashboard",
  description: "Explore SpaceX launches, rockets, and missions powered by GraphQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 antialiased">
        <ApolloWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 py-6 text-center text-xs text-zinc-600">
            Data from{" "}
            <span className="text-zinc-500">SpaceX GraphQL Community API</span>
            {" · "}Built with Next.js &amp; Apollo Client
          </footer>
        </ApolloWrapper>
      </body>
    </html>
  );
}
