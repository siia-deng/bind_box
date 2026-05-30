import type { Metadata } from "next";
import { MonthlyInterestForm } from "../../../components/MonthlyInterestForm";
import { SiteFrame } from "../../../components/SiteFrame";
import { juneEvents } from "../../../lib/monthly-events";

export const metadata: Metadata = {
  title: "6月活动提前报名",
  description: "提前报名 6月 Hurdle Club AI跨栏活动，优先收到报名开启、地点和准备事项。"
};

export default function JuneEventsRegisterPage() {
  return (
    <SiteFrame>
      <section className="grid gap-8 xl:grid-cols-[minmax(0,720px)_1fr]">
        <div>
          <p className="mb-4 text-xl font-black uppercase">Early Sign Up</p>
          <h1 className="page-title">
            JUNE
            <br />
            SIGN UP
          </h1>
          <p className="mt-6 max-w-3xl text-2xl font-black leading-tight">
            先留下你感兴趣的场次。具体时间、地点和报名细节确认后，我们会优先同步给你。
          </p>
          <div className="mt-8 grid gap-3">
            {juneEvents.map((event) => (
              <p key={event.date} className="border-t-2 border-ink py-3 text-xl font-bold leading-tight">
                {event.date} {event.weekday} · {event.title}：{event.copy}
              </p>
            ))}
          </div>
        </div>
        <MonthlyInterestForm />
      </section>
    </SiteFrame>
  );
}
