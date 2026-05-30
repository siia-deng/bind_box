import { Check, Laptop, MapPin } from "lucide-react";
import { HurdleMark } from "./HurdleMark";
import { LinkButton } from "./LinkButton";
import { RunnerIllustration } from "./RunnerIllustration";
import { SiteFrame } from "./SiteFrame";
import type { Session, Workshop } from "../lib/types";

function formatSessionTime(session?: Session) {
  if (!session) {
    return "待公布";
  }

  return `${session.date} · ${session.startTime}${session.endTime ? `-${session.endTime}` : ""}`;
}

export function WorkshopDetail({ workshop, sessions }: { workshop: Workshop; sessions: Session[] }) {
  const nextSession = sessions[0];

  return (
    <SiteFrame>
      <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_520px]">
        <div>
          <p className="mb-4 text-xl font-bold uppercase">Workshop / Shanghai / 2026</p>
          <h1 className="text-anywhere page-title workshop-title">{workshop.title}</h1>
          <p className="text-anywhere mt-8 max-w-3xl text-3xl font-black leading-tight">{workshop.subtitle}</p>
          <p className="text-anywhere mt-5 max-w-3xl text-2xl font-bold leading-tight">{workshop.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {workshop.tags.map((tag) => (
              <span key={tag} className="rounded-[6px] border-2 border-ink px-3 py-2 text-sm font-bold">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <RunnerIllustration />
      </section>

      <section className="mt-12 grid gap-5 border-y-2 border-ink py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center">
        <HurdleMark />
        <div className="grid gap-3 text-2xl font-black leading-tight">
          <p>Hurdle Club 是一个面向非技术背景的职场人、创作者、品牌主理人、和 AI 好奇者的线下实验社群。</p>
          <p>我们用上手，代替“学”，扫清工具和心理上的障碍，让每个人都能在现场从“不知道如何开始”到“已经做出来”的跨过。</p>
        </div>
      </section>

      {workshop.longDescription?.length ? (
        <section className="mt-12 grid gap-5 border-y-2 border-ink py-8">
          <h2 className="font-poster text-5xl leading-none">WHY</h2>
          <div className="grid gap-4 text-xl font-bold leading-tight lg:grid-cols-3">
            {workshop.longDescription.map((paragraph) => (
              <p key={paragraph} className="text-anywhere">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 font-poster text-5xl leading-none">FOR</h2>
          <ul className="grid gap-3 text-xl font-bold sm:text-2xl">
            {workshop.audience.map((item) => (
              <li key={item} className="text-anywhere border-t-2 border-ink py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-5 font-poster text-5xl leading-none">EXPERIENCE</h2>
          <ul className="grid gap-3 text-xl font-black sm:text-2xl">
            {workshop.outcomes.map((item) => (
              <li key={item} className="flex gap-3 border-t-2 border-ink py-3">
                <Check className="mt-1 h-7 w-7 shrink-0 stroke-[5]" aria-hidden="true" />
                <span className="text-anywhere">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-5 font-poster text-5xl leading-none">FLOW</h2>
        <div className="grid gap-4">
          {workshop.agenda.map((item) => (
            <article key={`${item.time}-${item.title}`} className="paper-border grid gap-3 bg-paper p-5 sm:grid-cols-[120px_1fr]">
              <p className="font-poster text-4xl leading-none">{item.time}</p>
              <div>
                <h3 className="text-3xl font-black">{item.title}</h3>
                <p className="text-anywhere mt-2 text-xl font-bold leading-tight">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-5 border-y-2 border-ink py-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="grid gap-3 text-xl font-bold">
          <p className="text-3xl font-black">下一场：{formatSessionTime(nextSession)}</p>
          <p className="flex gap-2">
            <MapPin className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{nextSession?.venue ?? "上海徐家汇（具体地址报名获取）"}</span>
          </p>
          <p className="flex gap-2">
            <Laptop className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>请携带一台笔记本电脑，Mac/Windows 均可。</span>
          </p>
        </div>
        <LinkButton href={`/workshops/${workshop.slug}/register`}>报名参加</LinkButton>
      </section>
    </SiteFrame>
  );
}
