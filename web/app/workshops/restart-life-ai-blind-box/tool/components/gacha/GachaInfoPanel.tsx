import { TOOL_CARDS_ENABLED, drawModeLabel, getActiveDrawOrder, getDrawStepCount, MANIFESTO, cardKindLabels, levelLabels, missionLabels } from "../../data/copy";
import type { CardKind, DrawnCards, DrawStep, Participant } from "../../types";
import { getPartialCards } from "../../lib/draw";
import { buildMissionSentence } from "../../lib/mission";
import { RetroStatusLog } from "../retro/RetroStatusLog";

type GachaInfoPanelProps = {
  participant?: Participant;
  currentStep: DrawStep;
  phaseComplete: boolean;
};

export function GachaInfoPanel({ participant, currentStep, phaseComplete }: GachaInfoPanelProps) {
  if (!participant) {
    return (
      <RetroStatusLog
        lines={[
          { prefix: "流程", text: `身份 → 任务 → 限制（${drawModeLabel}）`, done: false },
          { prefix: "入口", text: "在 INVENT 输入昵称开始", done: false }
        ]}
        footer={`等待第一位重启者 · ${MANIFESTO}`}
      />
    );
  }

  const partial = getPartialCards(participant);
  const cards = participant.cards;
  const mission = cards ? buildMissionSentence(cards) : null;
  const activeOrder = getActiveDrawOrder();
  const stepCount = getDrawStepCount();
  const filledCount = activeOrder.filter((kind) => partial[kind]).length;

  const lines = activeOrder.map((kind) => {
    const card = partial[kind];
    return {
      prefix: missionLabels[kind],
      text: card ? card.title : `（等待${cardKindLabels[kind]}）`,
      done: Boolean(card)
    };
  });

  const header = `${participant.name} · ${levelLabels[participant.level]} · ${filledCount}/${stepCount}`;

  return (
    <RetroStatusLog
      lines={lines}
      mission={mission}
      footer={`${header} · ${phaseComplete ? "已完成" : `步骤 ${Math.min(currentStep + 1, stepCount)}/${stepCount}`} · ${MANIFESTO}`}
    />
  );
}

export function buildMissionFromPartial(partial: Partial<Record<CardKind, import("../../types").Card>>): string | null {
  if (!partial.identity || !partial.task || !partial.constraint) {
    return null;
  }
  if (TOOL_CARDS_ENABLED && !partial.tool) {
    return null;
  }
  return buildMissionSentence(partial as DrawnCards);
}
