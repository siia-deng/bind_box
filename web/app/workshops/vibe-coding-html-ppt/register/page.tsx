import { CheckinGuide } from "../../../components/CheckinGuide";
import { RegisterForm } from "../../../components/RegisterForm";
import { SiteFrame } from "../../../components/SiteFrame";
import { SectionHeader } from "../../../components/SectionHeader";
import { getWorkshop, getWorkshopSessions } from "../../../lib/api";

export default async function VibeCodingRegisterPage() {
  const [workshop, sessions] = await Promise.all([
    getWorkshop("vibe-coding-html-ppt"),
    getWorkshopSessions("vibe-coding-html-ppt")
  ]);

  return (
    <SiteFrame>
      <SectionHeader
        eyebrow="Register"
        title="SAVE YOUR SEAT"
        copy="报名后获取上海徐家汇具体地址。请带上一台笔记本电脑和一个愿意试一试的想法。"
      />
      <div className="grid min-w-0 max-w-full gap-8 xl:grid-cols-[minmax(0,720px)_1fr]">
        <RegisterForm workshop={workshop} sessions={sessions} />
        <aside className="min-w-0 space-y-5 text-2xl font-bold leading-tight">
          <p className="break-words font-poster text-5xl leading-none">{workshop.title}</p>
          <p>{workshop.subtitle}</p>
          <p>2026年5月23日 周六 14:00-17:00 · 上海徐家汇。</p>
          <CheckinGuide />
        </aside>
      </div>
    </SiteFrame>
  );
}
