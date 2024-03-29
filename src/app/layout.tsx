import type { Metadata } from "next";
import "./globals.css";
import { satoshi } from "@/assets/font/satoshi";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={satoshi.className}>
        {children}
        <NextTopLoader color="#177981" />
        <Toaster />
      </body>
    </html>
  );
}
