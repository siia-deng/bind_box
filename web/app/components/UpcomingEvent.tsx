import { CalendarDays, MapPin, UsersRound } from "lucide-react";
import { getWorkshop, getWorkshopSessions } from "../lib/api";
import { LinkButton } from "./LinkButton";

const upcomingSlug = "restart-life-ai-blind-box";

function formatSession(session: { date: string; startTime: string; endTime?: string }) {
  const time = session.startTime === "时间待定" ? "时间待定" : `${session.startTime}${session.endTime ? `-${session.endTime}` : ""}`;
  return `${session.date} 周六 · ${time}`;
}

export async function UpcomingEvent() {
  const [workshop, sessions] = await Promise.all([
    getWorkshop(upcomingSlug),
    getWorkshopSessions(upcomingSlug)
  ]);
  const session = sessions[0];

  return (
    <section className="mt-16 border-t-2 border-ink pt-8">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        <div>
          <p className="font-poster text-6xl leading-none">NEXT</p>
          <p className="mt-2 text-xl font-black">近期活动预告</p>
        </div>
        <div className="paper-border bg-paper p-5 sm:p-6">
          <p className="mb-3 text-base font-black">【5.30｜重启人生 AI 盲盒】</p>
          <h2 className="text-anywhere font-poster text-4xl leading-none sm:text-6xl">{workshop.title}</h2>
          <p className="mt-4 max-w-3xl text-2xl font-black leading-tight">{workshop.subtitle}</p>
          <div className="mt-5 grid gap-2 text-2xl font-black leading-tight">
            <p>如果你的身份，可以被 AI 重新随机分配一次。</p>
            <p>你会变成谁？</p>
          </div>
          <div className="mt-6 grid gap-3 text-lg font-bold sm:grid-cols-2">
            <p className="flex gap-2">
              <CalendarDays className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{session ? formatSession(session) : "时间待公布"}</span>
            </p>
            <p className="flex gap-2">
              <MapPin className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{session?.venue ?? "上海徐家汇（具体地址报名获取）"}</span>
            </p>
            <p className="flex gap-2">
              <UsersRound className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>限20人左右 · 混合组队</span>
            </p>
          </div>
          <p className="text-anywhere mt-5 max-w-4xl text-xl font-bold leading-tight">{workshop.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/events/june-2026">6月月活动预告</LinkButton>
            <LinkButton href={`/workshops/${upcomingSlug}`}>查看完整介绍</LinkButton>
            <LinkButton href={`/workshops/${upcomingSlug}/register`}>我要报名</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
