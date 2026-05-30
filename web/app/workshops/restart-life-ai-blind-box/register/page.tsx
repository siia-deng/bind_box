import { CheckinGuide } from "../../../components/CheckinGuide";
import { RegisterForm } from "../../../components/RegisterForm";
import { SectionHeader } from "../../../components/SectionHeader";
import { SiteFrame } from "../../../components/SiteFrame";
import { getWorkshop, getWorkshopSessions } from "../../../lib/api";

export default async function RestartLifeRegisterPage() {
  const [workshop, sessions] = await Promise.all([
    getWorkshop("restart-life-ai-blind-box"),
    getWorkshopSessions("restart-life-ai-blind-box")
  ]);

  return (
    <SiteFrame>
      <SectionHeader
        eyebrow="Register"
        title="SAVE YOUR SEAT"
        copy="5月30日，限20人左右。报名后确认具体时间与地点。"
      />
      <div className="grid min-w-0 max-w-full gap-8 xl:grid-cols-[minmax(0,720px)_1fr]">
        <RegisterForm workshop={workshop} sessions={sessions} />
        <aside className="min-w-0 space-y-5 text-2xl font-bold leading-tight">
          <p className="break-words font-poster text-5xl leading-none">{workshop.title}</p>
          <p>{workshop.subtitle}</p>
          <p>每个人都会随机抽取身份、任务和限制条件，和队友一起完成一次 AI 即兴共创。</p>
          <CheckinGuide />
        </aside>
      </div>
    </SiteFrame>
  );
}
