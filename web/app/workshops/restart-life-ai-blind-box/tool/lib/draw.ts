import { getActiveDrawOrder } from "../data/settings";
import { pickCoherentCard } from "../data/coherence";
import type { Card, CardKind, DrawnCards, DrawProgress, DrawStep, Participant } from "../types";

export function getStepKind(step: DrawStep): CardKind {
  return getActiveDrawOrder()[step];
}

export function getDrawStepCount(): number {
  return getActiveDrawOrder().length;
}

export function getRemainingDraws(participant?: Participant): number {
  if (!participant || participant.cards) {
    return 0;
  }
  return Math.max(0, getDrawStepCount() - getCurrentStep(participant));
}

function collectUsedIds(participants: Participant[], kind: CardKind): Set<string> {
  return new Set(
    participants.flatMap((participant) => {
      const fromCards = participant.cards?.[kind]?.id;
      const fromPartial = participant.drawProgress?.partial?.[kind]?.id;
      return [fromCards, fromPartial].filter(Boolean) as string[];
    })
  );
}

export function pickCard(kind: CardKind, participants: Participant[], partial: Partial<DrawnCards> = {}): Card {
  return pickCoherentCard(kind, partial, collectUsedIds(participants, kind));
}

export function isDrawComplete(cards?: DrawnCards, progress?: DrawProgress): boolean {
  const order = getActiveDrawOrder();
  if (cards) {
    return order.every((kind) => cards[kind]);
  }
  if (progress?.partial) {
    return order.every((kind) => progress.partial?.[kind]);
  }
  return false;
}

export function getCurrentStep(participant?: Participant): DrawStep {
  const order = getActiveDrawOrder();
  const lastStep = (order.length - 1) as DrawStep;

  if (!participant) {
    return 0;
  }
  if (participant.cards) {
    return lastStep;
  }
  const partial = participant.drawProgress?.partial;
  if (!partial) {
    return 0;
  }
  for (let i = 0; i < order.length; i++) {
    if (!partial[order[i]]) {
      return i as DrawStep;
    }
  }
  return lastStep;
}

export function getPartialCards(participant?: Participant): Partial<DrawnCards> {
  if (participant?.cards) {
    return participant.cards;
  }
  return participant?.drawProgress?.partial ?? {};
}

export function mergeDrawnCards(partial: Partial<DrawnCards>): DrawnCards | null {
  const order = getActiveDrawOrder();
  if (!order.every((kind) => partial[kind])) {
    return null;
  }
  return {
    identity: partial.identity!,
    task: partial.task!,
    constraint: partial.constraint!,
    ...(partial.tool ? { tool: partial.tool } : {})
  };
}

export function drawSingleCard(participant: Participant, allParticipants: Participant[]): {
  kind: CardKind;
  card: Card;
  step: DrawStep;
  complete: boolean;
  partial: Partial<DrawnCards>;
  cards?: DrawnCards;
} {
  const step = getCurrentStep(participant);
  const kind = getStepKind(step);
  const existing = getPartialCards(participant);
  const card = pickCard(kind, allParticipants, existing);
  const partial = { ...existing, [kind]: card };
  const cards = mergeDrawnCards(partial);
  return {
    kind,
    card,
    step,
    complete: Boolean(cards),
    partial,
    cards: cards ?? undefined
  };
}
