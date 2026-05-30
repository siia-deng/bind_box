"use client";

import { drawModeLabel } from "../../data/copy";
import { RetroButton } from "../retro/RetroButton";

type GachaEmptyStartProps = {
  onLoadDemo: () => void;
  onOpenHost: () => void;
};

export function GachaEmptyStart({ onLoadDemo, onOpenHost }: GachaEmptyStartProps) {
  return (
    <div className="gacha-stage-empty">
      <div className="gacha-stage-empty-inner retro-dither-panel">
        <p className="retro-font-mono text-[10px] font-black uppercase tracking-widest opacity-50">STAGE · 待机</p>
        <p className="mt-2 text-xl font-black sm:text-2xl">准备唤醒</p>
        <p className="mt-3 max-w-md text-sm font-bold leading-relaxed opacity-75">
          在左侧 <span className="text-[var(--retro-ink)]">INVENT</span> 输入昵称并添加。添加后将自动{drawModeLabel}抽卡（身份 → 任务 → 限制）。
        </p>
        <p className="mt-2 text-xs font-bold opacity-50">工具卡暂未解锁 · 现场背景更多元后再开放</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <RetroButton variant="accent" onClick={onLoadDemo}>
            演示模式（1 人）
          </RetroButton>
          <RetroButton onClick={onOpenHost}>主持台 · 批量导入</RetroButton>
        </div>
      </div>
    </div>
  );
}
