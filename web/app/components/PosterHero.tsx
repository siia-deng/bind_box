import { Check } from "lucide-react";
import { HurdleMark } from "./HurdleMark";
import { LinkButton } from "./LinkButton";
import { RunnerIllustration } from "./RunnerIllustration";

const promises = [
  "从0开始，用AI做一个小工具",
  "把你的一个想法，变成可以用的Demo",
  "第一次体验「原来我也可以」的AHA moment"
];

export function PosterHero() {
  return (
    <section className="pb-8 xl:min-h-[min(980px,calc(100vh-6rem))]">
      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <h1 className="poster-title">
            AI
            <br />
            WORKSHOP
            <br />
            FOR
            <br />
            EVERYONE
          </h1>
        </div>
        <div className="hidden pt-4 xl:block">
          <p className="max-w-[260px] text-2xl font-bold leading-tight">
            A Shanghai offline AI community for people who want to create before they feel ready.
          </p>
        </div>
      </div>
      <div className="mt-6 grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] xl:-mt-4">
        <div className="order-2 lg:order-1">
          <RunnerIllustration />
        </div>
        <div className="order-1 space-y-8 lg:order-2 lg:pt-20">
          <HurdleMark />
          <div className="max-w-2xl text-2xl font-black leading-tight sm:text-3xl">
            <p>这是一个为“非技术背景的人”设计的 AI 线下社群：</p>
            <p>你不需要会编程</p>
            <p>也不需要懂技术</p>
          </div>
          <div className="max-w-2xl">
            <p className="mb-3 text-2xl font-black sm:text-3xl">在3小时里，我们一起完成：</p>
            <ul className="space-y-2 text-xl font-black leading-tight sm:text-2xl">
              {promises.map((promise) => (
                <li key={promise} className="flex gap-3">
                  <Check className="mt-1 h-7 w-7 shrink-0 stroke-[5]" aria-hidden="true" />
                  <span>{promise}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/workshops/restart-life-ai-blind-box">查看 5/30 活动</LinkButton>
            <LinkButton href="#community">了解 Hurdle Club</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
