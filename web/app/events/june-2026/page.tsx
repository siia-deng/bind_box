import type { Metadata } from "next";
import { CalendarDays, Images } from "lucide-react";
import { HurdleMark } from "../../components/HurdleMark";
import { LinkButton } from "../../components/LinkButton";
import { SiteFrame } from "../../components/SiteFrame";
import { juneEvents, pastEventSlots } from "../../lib/monthly-events";

export const metadata: Metadata = {
  title: "6月 AI跨栏活动预告",
  description: "6月 Hurdle Club | AI跨栏活动预告：AI视觉、Vibe Coding 小程序、重启身份 AI 盲盒、AI浏览器自动化。",
  openGraph: {
    title: "6月 Hurdle Club | AI跨栏活动预告",
    description: "四个周六，四次跨栏：AI视觉、零基础小程序、身份盲盒、浏览器自动化。",
    type: "article"
  }
};

export default function JuneEventsPage() {
  return (
    <SiteFrame>
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div>
          <p className="mb-4 text-xl font-black uppercase">Hurdle Club / June / Shanghai</p>
          <h1 className="text-anywhere page-title">
            JUNE
            <br />
            AI HURDLES
          </h1>
          <p className="mt-6 max-w-4xl text-3xl font-black leading-tight">6月 Hurdle Club | AI跨栏活动预告</p>
          <p className="mt-4 max-w-4xl text-2xl font-bold leading-tight">
            每个周六跨过一个新的工具门槛：从视觉、编码、身份共创，到浏览器自动化，把“我不会”变成“我做出来了”。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href="/events/june-2026/register">提前报名</LinkButton>
            <LinkButton href="#past-events">看过往活动</LinkButton>
          </div>
        </div>
        <div className="paper-border grid gap-5 bg-paper p-5">
          <HurdleMark />
          <p className="text-2xl font-black leading-tight">四场活动会持续更新具体时间、地点和报名信息。你可以先提交意向，优先收到确认通知。</p>
        </div>
      </section>

      <section className="mt-12 grid gap-4">
        {juneEvents.map((event, index) => (
          <article
            key={event.date}
            className="paper-border grid gap-5 bg-paper p-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center xl:grid-cols-[150px_minmax(0,1fr)_170px]"
          >
            <div>
              <p className="font-poster text-5xl leading-none">{event.date}</p>
              <p className="mt-1 text-xl font-black">{event.weekday}</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-normal">Hurdle {String(index + 1).padStart(2, "0")}</p>
              <h2 className="text-anywhere text-3xl font-black leading-tight sm:text-4xl">{event.title}</h2>
              <p className="text-anywhere mt-3 text-2xl font-bold leading-tight">{event.copy}</p>
            </div>
            <div className="grid gap-3">
              <img
                src={event.image}
                alt={event.imageAlt}
                className="aspect-square w-full max-w-[180px] rounded-[6px] border-2 border-ink object-cover object-center shadow-[0_0_18px_rgba(233,116,95,0.28)] sm:max-w-[220px] xl:max-w-none"
              />
              <div className="w-fit rounded-[6px] border-2 border-ink px-4 py-3 text-center text-base font-black xl:w-full">{event.tag}</div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-14 grid gap-6 border-y-2 border-ink py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div>
          <CalendarDays className="mb-4 h-8 w-8" aria-hidden="true" />
          <h2 className="font-poster text-5xl leading-none">SIGN UP</h2>
          <p className="mt-2 text-xl font-black">提前报名入口</p>
        </div>
        <div className="grid gap-4 text-2xl font-black leading-tight">
          <p>还没想好参加哪一场，也可以先占位。我们会根据你的兴趣优先同步报名开启、地点和准备事项。</p>
          <div>
            <LinkButton href="/events/june-2026/register">填写提前报名</LinkButton>
          </div>
        </div>
      </section>

      <section id="past-events" className="mt-14">
        <div className="mb-6">
          <Images className="mb-4 h-8 w-8" aria-hidden="true" />
          <h2 className="font-poster text-5xl leading-none">PAST</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {pastEventSlots.map((event) => (
            <article key={event.date} className="paper-border grid overflow-hidden bg-paper">
              <div className="border-b-2 border-ink bg-sky/10">
                <img
                  src={event.image}
                  alt={event.imageAlt}
                  className="aspect-[4/3] h-full w-full object-cover object-center"
                />
              </div>
              <div className="grid gap-2 p-5">
                <p className="font-poster text-4xl leading-none">{event.date}</p>
                <h3 className="text-anywhere text-2xl font-black leading-tight">{event.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
