import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "CodeMaster | Premium Developer Courses & Technical Blog",
  description: "Master real-world tech skills, systems engineering, advanced structures, and blockchain engineering with immersive developer training.",
  keywords: ["programming", "nextjs", "web3", "react", "system design", "software engineering"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
