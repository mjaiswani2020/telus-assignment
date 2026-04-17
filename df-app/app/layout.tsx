import type { Metadata } from "next";
import { literata, inter, ibmPlexMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "RLHF DataForge",
  description: "Human feedback data collection platform for LLM alignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${literata.variable} ${inter.variable} ${ibmPlexMono.variable} font-inter antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
