import type { CardKind } from "../types";
import { DRAW_ORDER } from "./copy";

/** 工具卡暂未开放，现场背景更多元后再解锁 */
export const TOOL_CARDS_ENABLED = false;

export function getActiveDrawOrder(): CardKind[] {
  return TOOL_CARDS_ENABLED ? DRAW_ORDER : ["identity", "task", "constraint"];
}

export function getDrawStepCount(): number {
  return getActiveDrawOrder().length;
}

export function isToolKind(kind: CardKind): boolean {
  return kind === "tool";
}
