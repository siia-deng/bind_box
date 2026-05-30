import type { Metadata } from "next";
import { BlindBoxApp } from "./BlindBoxApp";

export const metadata: Metadata = {
  title: "Blind Vibe · 开出你的 AI 第二身份",
  description: "现场唤醒台：抽取身份、任务、限制与工具四卡，生成 Mission 并组队共创。",
  openGraph: {
    title: "Blind Vibe · AI 第二身份唤醒台",
    description: "游戏化四卡盲盒 · 重启人生 AI 盲盒活动现场工具",
    type: "website"
  }
};

export default function RestartLifeBlindBoxAppPage() {
  return <BlindBoxApp />;
}
