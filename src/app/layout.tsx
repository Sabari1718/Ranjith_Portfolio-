import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Ranjith Kumar | Video Editor & Graphic Designer",
  description: "Premium creative portfolio of Ranjith Kumar. Specialized in cinematic video editing, viral short-form social content, motion graphics, and high-conversion graphic design.",
  keywords: [
    "Ranjith Kumar",
    "Video Editor",
    "Graphic Designer",
    "Cinematic Editing",
    "Premiere Pro",
    "After Effects",
    "Motion Graphics",
    "YouTube Video Editor",
    "Reels Editor",
    "Logo Design",
  ],
  authors: [{ name: "Ranjith Kumar" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-dark-950 text-foreground selection:bg-electric-500 selection:text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
