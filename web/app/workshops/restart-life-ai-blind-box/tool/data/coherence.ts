import { cardDecks } from "./cards";
import type { Card, CardKind, DrawnCards } from "../types";

/** 身份 / 任务 / 限制 的语义标签，用于三连组合打分 */
type Tag =
  | "emotion"
  | "life-path"
  | "dream"
  | "brand"
  | "virtual"
  | "lonely"
  | "ai-tech"
  | "lifestyle"
  | "startup"
  | "persona"
  | "web"
  | "video"
  | "game"
  | "quiz"
  | "app"
  | "tool-product"
  | "concept"
  | "chat"
  | "service"
  | "empathy"
  | "sci-fi"
  | "luxury"
  | "moody"
  | "beginner"
  | "retro"
  | "restart"
  | "busy"
  | "playful"
  | "healing";

const identityTags: Record<string, Tag[]> = {
  "i-01": ["emotion", "empathy", "brand"],
  "i-02": ["life-path", "restart", "empathy"],
  "i-03": ["dream", "playful", "virtual"],
  "i-04": ["brand", "luxury", "startup"],
  "i-05": ["virtual", "sci-fi", "dream"],
  "i-06": ["lonely", "emotion", "empathy"],
  "i-07": ["ai-tech", "tool-product", "persona"],
  "i-08": ["lifestyle", "luxury", "healing"],
  "i-09": ["startup", "concept", "sci-fi"],
  "i-10": ["persona", "chat", "ai-tech"]
};

const taskTags: Record<string, Tag[]> = {
  "t-01": ["web", "brand"],
  "t-02": ["video", "brand", "emotion"],
  "t-03": ["game", "playful", "web"],
  "t-04": ["quiz", "empathy", "persona"],
  "t-05": ["web", "brand", "virtual"],
  "t-06": ["app", "startup", "busy"],
  "t-07": ["tool-product", "ai-tech", "beginner"],
  "t-08": ["concept", "startup", "busy"],
  "t-09": ["chat", "persona", "empathy"],
  "t-10": ["service", "sci-fi", "startup"]
};

const constraintTags: Record<string, Tag[]> = {
  "c-01": ["empathy", "emotion"],
  "c-02": ["sci-fi", "virtual"],
  "c-03": ["luxury", "brand"],
  "c-04": ["lonely", "moody", "emotion"],
  "c-05": ["beginner", "playful"],
  "c-06": ["retro", "web"],
  "c-07": ["restart", "life-path"],
  "c-08": ["busy", "startup"],
  "c-09": ["playful", "dream"],
  "c-10": ["healing", "empathy", "lifestyle"]
};

/** 身份 → 更契合的任务（强推荐 +6，弱推荐 +3） */
const identityTaskStrong: Record<string, string[]> = {
  "i-01": ["t-04", "t-02", "t-09"],
  "i-02": ["t-04", "t-08", "t-06"],
  "i-03": ["t-03", "t-04", "t-09"],
  "i-04": ["t-01", "t-05", "t-02"],
  "i-05": ["t-05", "t-10", "t-03"],
  "i-06": ["t-04", "t-09", "t-02"],
  "i-07": ["t-07", "t-09", "t-04"],
  "i-08": ["t-01", "t-06", "t-05"],
  "i-09": ["t-08", "t-10", "t-06"],
  "i-10": ["t-09", "t-04", "t-07"]
};

const identityTaskWeak: Record<string, string[]> = {
  "i-01": ["t-01", "t-07"],
  "i-02": ["t-10", "t-01"],
  "i-03": ["t-05", "t-01"],
  "i-04": ["t-06", "t-08"],
  "i-05": ["t-01", "t-09"],
  "i-06": ["t-01", "t-10"],
  "i-07": ["t-06", "t-08"],
  "i-08": ["t-04", "t-10"],
  "i-09": ["t-02", "t-07"],
  "i-10": ["t-05", "t-06"]
};

/** 任务 → 更契合的限制 */
const taskConstraintStrong: Record<string, string[]> = {
  "t-01": ["c-06", "c-07", "c-03", "c-08"],
  "t-02": ["c-04", "c-03", "c-08", "c-01"],
  "t-03": ["c-09", "c-02", "c-07", "c-05"],
  "t-04": ["c-01", "c-04", "c-10", "c-07"],
  "t-05": ["c-03", "c-02", "c-06", "c-10"],
  "t-06": ["c-07", "c-08", "c-05", "c-10"],
  "t-07": ["c-05", "c-01", "c-10", "c-08"],
  "t-08": ["c-07", "c-08", "c-03", "c-01"],
  "t-09": ["c-01", "c-04", "c-10", "c-05"],
  "t-10": ["c-02", "c-08", "c-05", "c-03"]
};

/** 身份 + 限制 明显违和（扣分） */
const identityConstraintClash: Array<[string, string]> = [
  ["i-06", "c-09"],
  ["i-04", "c-05"],
  ["i-07", "c-09"],
  ["i-09", "c-10"],
  ["i-08", "c-04"],
  ["i-05", "c-08"]
];

/** 任务 + 限制 明显违和 */
const taskConstraintClash: Array<[string, string]> = [
  ["t-02", "c-09"],
  ["t-08", "c-10"],
  ["t-08", "c-09"],
  ["t-03", "c-08"],
  ["t-10", "c-09"],
  ["t-07", "c-03"],
  ["t-04", "c-06"],
  ["t-06", "c-06"]
];

function overlap(a: Tag[], b: Tag[]): number {
  return a.filter((tag) => b.includes(tag)).length;
}

function hasClash(pairs: Array<[string, string]>, a: string, b: string): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function scoreTask(identity: Card, task: Card): number {
  const iTags = identityTags[identity.id] ?? ["emotion"];
  const tTags = taskTags[task.id] ?? ["web"];
  let score = overlap(iTags, tTags) * 3;

  if (identityTaskStrong[identity.id]?.includes(task.id)) {
    score += 6;
  } else if (identityTaskWeak[identity.id]?.includes(task.id)) {
    score += 3;
  }

  return score + Math.random() * 0.8;
}

function scoreConstraint(identity: Card, task: Card, constraint: Card): number {
  const iTags = identityTags[identity.id] ?? [];
  const tTags = taskTags[task.id] ?? [];
  const cTags = constraintTags[constraint.id] ?? [];
  let score = overlap(iTags, cTags) * 2 + overlap(tTags, cTags) * 4;

  if (taskConstraintStrong[task.id]?.includes(constraint.id)) {
    score += 6;
  }

  if (identityTaskStrong[identity.id]?.includes(task.id) && taskConstraintStrong[task.id]?.includes(constraint.id)) {
    score += 4;
  }

  if (hasClash(identityConstraintClash, identity.id, constraint.id)) {
    score -= 10;
  }
  if (hasClash(taskConstraintClash, task.id, constraint.id)) {
    score -= 12;
  }

  return score + Math.random() * 0.8;
}

function pickFromScoredPool(pool: Card[], scoreCard: (card: Card) => number): Card {
  const scored = pool.map((card) => ({ card, score: scoreCard(card) }));
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0]?.score ?? 0;
  const candidates = scored.filter((entry) => entry.score >= top - 2).map((entry) => entry.card);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? pool[Math.floor(Math.random() * pool.length)];
}

function getAvailablePool(kind: CardKind, usedIds: Set<string>): Card[] {
  const available = cardDecks[kind].filter((card) => !usedIds.has(card.id));
  return available.length > 0 ? available : cardDecks[kind];
}

export function pickCoherentCard(kind: CardKind, partial: Partial<DrawnCards>, usedIds: Set<string>): Card {
  const pool = getAvailablePool(kind, usedIds);

  if (kind === "identity" || !partial.identity) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if (kind === "task") {
    return pickFromScoredPool(pool, (task) => scoreTask(partial.identity!, task));
  }

  if (kind === "constraint" && partial.task) {
    return pickFromScoredPool(pool, (constraint) => scoreConstraint(partial.identity!, partial.task!, constraint));
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
