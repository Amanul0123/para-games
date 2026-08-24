import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getEventSettings } from "@/lib/eventSettings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { eventName, organizationName } = await getEventSettings();
  return {
    title: `${eventName} - Report on Injuries and Illnesses`,
    description: `Report on Injuries and Illnesses for the ${eventName} - ${organizationName}`,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
