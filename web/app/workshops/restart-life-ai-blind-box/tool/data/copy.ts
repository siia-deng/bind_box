import type { CardKind, DrawStep } from "../types";
import { getActiveDrawOrder, getDrawStepCount, TOOL_CARDS_ENABLED } from "./settings";

export const cardKindLabels: Record<CardKind, string> = {
  identity: "身份卡",
  task: "任务卡",
  constraint: "限制卡",
  tool: "工具卡"
};

export const missionLabels: Record<CardKind, string> = {
  identity: "你是谁",
  task: "你要做什么",
  constraint: "必须遵守",
  tool: "用什么 AI"
};

const stepHintByIndex: Record<DrawStep, string> = {
  0: "第一次唤醒：你是谁？",
  1: "第二次唤醒：你要交付什么？",
  2: "第三次唤醒：世界的规则",
  3: "最后一次唤醒：你的 AI 法器"
};

export function getStepHint(step: DrawStep): string {
  if (step >= getDrawStepCount()) {
    return "唤醒完成";
  }
  return stepHintByIndex[step];
}

export const stepHints: Record<DrawStep, string> = stepHintByIndex;

export const DRAW_ORDER: CardKind[] = ["identity", "task", "constraint", "tool"];

export { getActiveDrawOrder, getDrawStepCount, TOOL_CARDS_ENABLED };

export const drawModeLabel = TOOL_CARDS_ENABLED ? "四连" : "三连";

export const levelLabels = {
  first: "第一次接触",
  mixed: "用过 AI",
  vibe: "Vibe 老手"
} as const;

export const starterNames = [
  "林予",
  "阿辰",
  "Mia",
  "小昭",
  "Kai",
  "苏打",
  "Nina",
  "Leo",
  "安妮",
  "柏舟",
  "Yuki",
  "石头",
  "June",
  "可乐",
  "Rex",
  "糖糖",
  "宁宁",
  "Max",
  "阿远",
  "Echo"
];

export const APP_TITLE = "Blind Vibe";
export const APP_SUBTITLE = "开出你的 AI 第二身份";
export const APP_TAGLINE = "重启人生 AI 盲盒 · 现场唤醒台";
export const MANIFESTO = "AI 是创作放大器，不是替代人。";
