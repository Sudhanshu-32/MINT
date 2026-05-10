import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mint — Free AI Spend Audit",
  description:
    "Find out if you're overpaying for AI tools. Get an instant audit of your AI spend — free, no signup required.",
  openGraph: {
    title: "Mint — Free AI Spend Audit",
    description: "Find out if you're overpaying for AI tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}