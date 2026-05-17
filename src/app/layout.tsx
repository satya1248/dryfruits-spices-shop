import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CartProviderWrapper } from "@/components/CartProviderWrapper";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spice&Dry | Dry Fruits & Spices",
  description:
    "A learning storefront for premium dry fruits and aromatic spices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#fdf8f3] text-stone-800">
        <CartProviderWrapper>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProviderWrapper>
      </body>
    </html>
  );
}
