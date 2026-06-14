import type { Metadata } from "next";
import "./globals.css";
import "@/styles/w95/desktop.css";
import "@/styles/w95/window.css";
import "@/styles/w95/taskbar.css";
import "@/styles/ios/wallpaper.css";
import "@/styles/ios/statusbar.css";
import "@/styles/ios/lockscreen.css";
import "@/styles/ios/homescreen.css";
import "@/styles/ios/appicon.css";
import "@/styles/ios/appscreen.css";
import "@/styles/ios/weather.css";

export const metadata: Metadata = {
  title: "Arman Singh Tomar — Portfolio",
  description:
    "Full Stack Developer & UI Designer. A portfolio that boots like Windows 95 on desktop and feels like an early iPhone on mobile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden" suppressHydrationWarning>{children}</body>
    </html>
  );
}
