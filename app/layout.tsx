import type React from "react";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kifa Bakery | Sistem Manajemen Bisnis",
  description:
    "Sistem manajemen bisnis terintegrasi dengan dashboard, POS, dan manajemen stok",
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IsClientComponent>{children}</IsClientComponent>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import IsClientComponent from "@/components/is-client";
