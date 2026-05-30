import { CheckinGuide } from "../../../components/CheckinGuide";
import { RegisterForm } from "../../../components/RegisterForm";
import { SiteFrame } from "../../../components/SiteFrame";
import { SectionHeader } from "../../../components/SectionHeader";
import { getWorkshop, getWorkshopSessions } from "../../../lib/api";

export default async function RegisterPage() {
  const [workshop, sessions] = await Promise.all([
    getWorkshop("ai-for-everyone"),
    getWorkshopSessions("ai-for-everyone")
  ]);

  return (
    <SiteFrame>
      <SectionHeader
        eyebrow="Register"
        title="SAVE YOUR SEAT"
        copy="留下你的背景和一个真实想法，我们会帮你把它带进工作坊。"
      />
      <div className="grid min-w-0 max-w-full gap-8 xl:grid-cols-[minmax(0,720px)_1fr]">
        <RegisterForm workshop={workshop} sessions={sessions} />
        <aside className="min-w-0 space-y-5 text-2xl font-bold leading-tight">
          <p className="break-words font-poster text-5xl leading-none">{workshop.title}</p>
          <p>{workshop.subtitle}</p>
          <p>无需编程基础。请带着一个你真的想解决的小问题来。</p>
          <CheckinGuide />
        </aside>
      </div>
    </SiteFrame>
  );
}
