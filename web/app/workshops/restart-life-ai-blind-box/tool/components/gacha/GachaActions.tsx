import type { DrawMode, GachaPhase } from "../../types";
import { drawModeLabel } from "../../data/copy";
import { RetroVerbGrid } from "../retro/RetroVerbGrid";

type GachaActionsProps = {
  phase: GachaPhase;
  drawMode: DrawMode;
  fastMode: boolean;
  canDraw: boolean;
  canNext: boolean;
  onAwakenOne: () => void;
  onAwakenQuad: () => void;
  onSkipReveal: () => void;
  onNextParticipant: () => void;
  onToggleDrawMode: () => void;
  onToggleFastMode: () => void;
};

export function GachaActions({
  phase,
  drawMode,
  fastMode,
  canDraw,
  canNext,
  onAwakenOne,
  onAwakenQuad,
  onSkipReveal,
  onNextParticipant,
  onToggleDrawMode,
  onToggleFastMode
}: GachaActionsProps) {
  const animating = phase === "charge" || phase === "flip" || phase === "slot";
  const modeLabel = drawMode === "quad" ? drawModeLabel : "逐张";

  const hint =
    drawMode === "quad" && phase === "ready" && canDraw
      ? `${drawModeLabel}模式 · 即将自动唤醒…`
      : !canDraw && phase !== "complete"
        ? `${drawModeLabel}唤醒中…`
        : drawMode === "quad" && phase === "complete" && canNext
          ? "2 秒后自动切换下一位"
          : null;

  const items =
    phase === "complete"
      ? [
          { label: "下一位", onClick: onNextParticipant, disabled: !canNext, variant: "primary" as const },
          { label: `模式：${modeLabel}`, onClick: onToggleDrawMode },
          { label: fastMode ? "快速节奏" : "标准节奏", onClick: onToggleFastMode }
        ]
      : phase === "reveal"
        ? [
            { label: "跳过", onClick: onSkipReveal },
            { label: "唤醒 1 张", onClick: onAwakenOne, disabled: !canDraw || animating },
            { label: `开盒·${drawModeLabel}`, onClick: onAwakenQuad, disabled: !canDraw || animating || drawMode !== "quad", variant: "accent" as const }
          ]
        : [
            { label: `开盒·${drawModeLabel}`, onClick: onAwakenQuad, disabled: !canDraw || animating || drawMode !== "quad", variant: "accent" as const },
            { label: "唤醒 1 张", onClick: onAwakenOne, disabled: !canDraw || animating },
            { label: `模式：${modeLabel}`, onClick: onToggleDrawMode },
            { label: fastMode ? "快速节奏" : "标准节奏", onClick: onToggleFastMode },
            { label: "下一位", onClick: onNextParticipant, disabled: !canNext }
          ];

  return <RetroVerbGrid items={items} hint={hint} />;
}
