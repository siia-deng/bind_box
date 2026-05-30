import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hurdle Club | AI Workshop for Everyone",
    template: "%s | Hurdle Club"
  },
  description: "Hurdle Club 是一个面向非技术背景的职场人、创作者、品牌主理人、和 AI 好奇者的线下实验社群。",
  openGraph: {
    title: "Hurdle Club | AI Workshop for Everyone",
    description: "用上手代替“学”，扫清工具和心理上的障碍。查看近期 AI 共创活动与社群介绍。",
    type: "website",
    locale: "zh_CN"
  },
  icons: {
    icon: "/hurdle-club-logo.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
