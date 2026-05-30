export type CardKind = "identity" | "task" | "constraint" | "tool";
export type CardRarity = "N" | "R" | "SR" | "SSR";
export type ExperienceLevel = "first" | "mixed" | "vibe";
export type TeamStatus = "draft" | "started";
export type GachaPhase = "idle" | "ready" | "charge" | "flip" | "reveal" | "slot" | "complete" | "blocked";
export type DrawStep = 0 | 1 | 2 | 3;
export type DrawMode = "quad" | "single";
export type AppMode = "gacha" | "host";

export type Card = {
  id: string;
  kind: CardKind;
  title: string;
  detail: string;
  accent: string;
  visualKey?: string;
  rarity?: CardRarity;
};

export type DrawnCards = {
  identity: Card;
  task: Card;
  constraint: Card;
  tool?: Card;
};

export type DrawProgress = {
  step: DrawStep;
  partial?: Partial<DrawnCards>;
};

export type Participant = {
  id: string;
  name: string;
  level: ExperienceLevel;
  cards?: DrawnCards;
  drawProgress?: DrawProgress;
};

export type Team = {
  id: string;
  name: string;
  members: string[];
  status: TeamStatus;
};

export type StoredStateV2 = {
  version: 2;
  participants: Participant[];
  teams: Team[];
  activeParticipantId?: string;
  drawMode?: DrawMode;
  fastMode?: boolean;
};

export type StoredStateV1 = {
  participants: Participant[];
  teams: Team[];
  activeParticipantId?: string;
};
