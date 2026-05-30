import { CalendarCheck, Sparkles, UsersRound } from "lucide-react";
import { HurdleMark } from "./HurdleMark";
import { LinkButton } from "./LinkButton";

const introItems = [
  {
    icon: Sparkles,
    title: "从好奇开始",
    copy: "不从术语和教程开始，而从一个真实问题、一个随机身份、一次想试试的创作冲动开始。"
  },
  {
    icon: UsersRound,
    title: "线下共创",
    copy: "第一次参与的人会和有经验的玩家混合组队，在真实空间里一起拆题、试错、展示。"
  },
  {
    icon: CalendarCheck,
    title: "带走作品",
    copy: "每次活动都尽量产出一个可以展示的小作品，记录一次“我好像真的跨过去了”的时刻。"
  }
];

export function CommunityIntro() {
  return (
    <section id="community" className="mt-16 border-y-2 border-ink py-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end">
        <div className="grid gap-5">
          <p className="text-xl font-black uppercase">Hurdle Club Community</p>
          <h2 className="text-anywhere font-poster text-5xl leading-none sm:text-7xl">
            AI 不只是工具，
            <br />
            也是一次重新开始的入口。
          </h2>
          <div className="grid max-w-4xl gap-3 text-2xl font-black leading-tight">
            <p>Hurdle Club 是一个面向非技术背景的职场人、创作者、品牌主理人、和 AI 好奇者的线下实验社群。</p>
            <p>我们用上手，代替“学”，扫清工具和心理上的障碍，让每个人都能在现场从“不知道如何开始”到“已经做出来”的跨过。</p>
          </div>
        </div>
        <div className="paper-border grid gap-5 bg-paper p-5">
          <HurdleMark />
          <p className="text-2xl font-black leading-tight">
            这里不要求你先成为专家。你只需要带着一个问题、一点好奇，以及愿意试一次的身体。
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/events/june-2026">查看 6月活动</LinkButton>
            <LinkButton href="/workshops/restart-life-ai-blind-box">查看 5/30 活动</LinkButton>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {introItems.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="paper-border bg-paper p-5">
              <Icon className="mb-5 h-7 w-7" aria-hidden="true" />
              <h3 className="text-3xl font-black">{item.title}</h3>
              <p className="text-anywhere mt-3 text-xl font-bold leading-tight">{item.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
