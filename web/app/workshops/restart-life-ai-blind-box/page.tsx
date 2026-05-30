import type { Metadata } from "next";
import { WorkshopDetail } from "../../components/WorkshopDetail";
import { getWorkshop, getWorkshopSessions } from "../../lib/api";

export const metadata: Metadata = {
  title: "5.30 重启人生 AI 盲盒",
  description:
    "如果你的身份可以被 AI 重新随机分配一次，你会变成谁？Hurdle Club 5月30日 AI 身份重启即兴共创活动。",
  openGraph: {
    title: "5.30｜重启人生 AI 盲盒",
    description: "AI × 身份重启 × 即兴共创。限20人左右，第一次参与也可以加入混合组队。",
    type: "article"
  }
};

export default async function RestartLifeWorkshopPage() {
  const [workshop, sessions] = await Promise.all([
    getWorkshop("restart-life-ai-blind-box"),
    getWorkshopSessions("restart-life-ai-blind-box")
  ]);

  return <WorkshopDetail workshop={workshop} sessions={sessions} />;
}
