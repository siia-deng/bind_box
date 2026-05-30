import type { DrawMode, Participant, StoredStateV1, StoredStateV2, Team } from "../types";

export const STORAGE_KEY_V2 = "hurdle-restart-life-blind-box-v2";
export const STORAGE_KEY_V1 = "hurdle-restart-life-blind-box-v1";

function migrateParticipant(participant: Participant): Participant {
  if (participant.cards && !participant.cards.tool) {
    return { ...participant, cards: undefined, drawProgress: undefined };
  }
  return participant;
}

export function loadStoredState(): {
  participants: Participant[];
  teams: Team[];
  activeParticipantId?: string;
  drawMode: DrawMode;
  fastMode: boolean;
} {
  if (typeof window === "undefined") {
    return { participants: [], teams: [], drawMode: "quad", fastMode: false };
  }

  const v2Raw = window.localStorage.getItem(STORAGE_KEY_V2);
  if (v2Raw) {
    try {
      const stored = JSON.parse(v2Raw) as StoredStateV2;
      return {
        participants: stored.participants ?? [],
        teams: stored.teams ?? [],
        activeParticipantId: stored.activeParticipantId,
        drawMode: stored.drawMode ?? "quad",
        fastMode: stored.fastMode ?? false
      };
    } catch {
      window.localStorage.removeItem(STORAGE_KEY_V2);
    }
  }

  const v1Raw = window.localStorage.getItem(STORAGE_KEY_V1);
  if (v1Raw) {
    try {
      const stored = JSON.parse(v1Raw) as StoredStateV1;
      return {
        participants: (stored.participants ?? []).map(migrateParticipant),
        teams: stored.teams ?? [],
        activeParticipantId: stored.activeParticipantId,
        drawMode: "quad",
        fastMode: false
      };
    } catch {
      window.localStorage.removeItem(STORAGE_KEY_V1);
    }
  }

  return { participants: [], teams: [], drawMode: "quad", fastMode: false };
}

export function saveStoredState(state: {
  participants: Participant[];
  teams: Team[];
  activeParticipantId?: string;
  drawMode: DrawMode;
  fastMode: boolean;
}) {
  if (typeof window === "undefined") {
    return;
  }
  const payload: StoredStateV2 = {
    version: 2,
    participants: state.participants,
    teams: state.teams,
    activeParticipantId: state.activeParticipantId,
    drawMode: state.drawMode,
    fastMode: state.fastMode
  };
  window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(payload));
}

export function clearStoredState() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY_V2);
  window.localStorage.removeItem(STORAGE_KEY_V1);
}
