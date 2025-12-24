import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { TextureOverlay } from "@/components/ui/TextureOverlay";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Health Companion",
  description: "A gentle habit tracker and daily planner.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(nunito.className, "bg-background text-foreground antialiased")}>
        <div className="flex flex-col min-h-screen max-w-md mx-auto border-x border-border shadow-2xl relative bg-background overflow-hidden">
          <TextureOverlay />
          <main className="flex-1 pb-20 p-4 relative z-10">
            {children}
          </main>
          <BottomNav />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
