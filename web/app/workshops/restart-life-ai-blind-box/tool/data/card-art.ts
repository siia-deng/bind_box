import type { CardKind } from "../types";

/** 已有 public SVG 资源（旧 key） */
const LEGACY_ASSETS: Record<CardKind, string[]> = {
  identity: ["mars-architect", "alien-therapist", "dream-director", "time-capsule"],
  task: ["brand-video", "product-prototype", "posters", "demo-flow"],
  constraint: ["mono", "retro-future", "no-face", "shanghai"],
  tool: ["cursor-lovable", "midjourney", "runway-kling", "claude-chatgpt"]
};

/** 新卡 visualKey → 插图资源 + 氛围 class */
export const CARD_ART: Record<
  string,
  { assetKey: string; moodClass?: string }
> = {
  "emotion-designer": { assetKey: "mars-architect", moodClass: "card-mood-coral" },
  "second-life-advisor": { assetKey: "alien-therapist", moodClass: "card-mood-sky" },
  "dream-architect": { assetKey: "dream-director", moodClass: "card-mood-mint" },
  "future-brand-owner": { assetKey: "time-capsule", moodClass: "card-mood-gold" },
  "virtual-resident": { assetKey: "mars-architect", moodClass: "card-mood-sky" },
  "loneliness-researcher": { assetKey: "alien-therapist", moodClass: "card-mood-ink" },
  "ai-trainer": { assetKey: "dream-director", moodClass: "card-mood-mint" },
  "lifestyle-curator": { assetKey: "time-capsule", moodClass: "card-mood-gold" },
  "parallel-founder": { assetKey: "mars-architect", moodClass: "card-mood-coral" },
  "persona-admin": { assetKey: "alien-therapist", moodClass: "card-mood-sky" },

  "landing-page": { assetKey: "product-prototype", moodClass: "card-mood-ink" },
  "ai-ad-film": { assetKey: "brand-video", moodClass: "card-mood-coral" },
  "web-mini-game": { assetKey: "posters", moodClass: "card-mood-mint" },
  "personality-quiz": { assetKey: "demo-flow", moodClass: "card-mood-sky" },
  "virtual-brand-site": { assetKey: "product-prototype", moodClass: "card-mood-gold" },
  "future-app-demo": { assetKey: "demo-flow", moodClass: "card-mood-sky" },
  "ai-generator-tool": { assetKey: "posters", moodClass: "card-mood-mint" },
  "startup-concept": { assetKey: "brand-video", moodClass: "card-mood-gold" },
  "chat-character": { assetKey: "demo-flow", moodClass: "card-mood-coral" },
  "future-service-platform": { assetKey: "product-prototype", moodClass: "card-mood-sky" },

  understood: { assetKey: "understood", moodClass: "card-mood-understood" },
  "space-resident": { assetKey: "space-resident", moodClass: "card-mood-space" },
  "future-luxury": { assetKey: "future-luxury", moodClass: "card-mood-luxury" },
  "lonely-mood": { assetKey: "lonely-mood", moodClass: "card-mood-lonely" },
  "internet-newbie": { assetKey: "internet-newbie", moodClass: "card-mood-newbie" },
  "retro-web-90s": { assetKey: "retro-web-90s", moodClass: "card-mood-retro90" },
  "life-restart": { assetKey: "life-restart", moodClass: "card-mood-restart" },
  "urban-stress": { assetKey: "urban-stress", moodClass: "card-mood-urban" },
  "child-fantasy": { assetKey: "child-fantasy", moodClass: "card-mood-child" },
  "calm-healing": { assetKey: "calm-healing", moodClass: "card-mood-healing" }
};

export function resolveCardArt(kind: CardKind, visualKey?: string) {
  if (visualKey && CARD_ART[visualKey]) {
    const entry = CARD_ART[visualKey];
    return {
      imageSrc: `/workshops/blind-vibe/cards/${kind}/${entry.assetKey}.svg`,
      moodClass: entry.moodClass ?? "",
      iconKey: visualKey
    };
  }

  const legacy = LEGACY_ASSETS[kind];
  const fallbackKey = visualKey && legacy.includes(visualKey) ? visualKey : legacy[0];
  return {
    imageSrc: `/workshops/blind-vibe/cards/${kind}/${fallbackKey}.svg`,
    moodClass: "",
    iconKey: visualKey ?? fallbackKey
  };
}
