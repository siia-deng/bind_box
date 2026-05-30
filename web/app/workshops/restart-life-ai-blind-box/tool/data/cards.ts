import type { Card, CardKind, CardRarity } from "../types";

const identityCards: Card[] = [
  { id: "i-01", kind: "identity", title: "情绪设计师", detail: "用色彩、节奏与文案调节人的感受曲线。", accent: "bg-coral", visualKey: "emotion-designer", rarity: "SR" },
  { id: "i-02", kind: "identity", title: "第二人生顾问", detail: "帮来访者设计可试运行的另一种人生版本。", accent: "bg-sky", visualKey: "second-life-advisor" },
  { id: "i-03", kind: "identity", title: "梦境建筑师", detail: "把模糊愿望砌成可走进去的场景与规则。", accent: "bg-mint", visualKey: "dream-architect", rarity: "SR" },
  { id: "i-04", kind: "identity", title: "未来品牌主理人", detail: "为还不存在的品牌定义气质、叙事与触点。", accent: "bg-gold", visualKey: "future-brand-owner" },
  { id: "i-05", kind: "identity", title: "虚拟世界居民", detail: "长期生活在数字空间里，熟悉另一套物理法则。", accent: "bg-coral", visualKey: "virtual-resident" },
  { id: "i-06", kind: "identity", title: "孤独感研究员", detail: "观察、记录并转译现代人的独处与连接。", accent: "bg-sky", visualKey: "loneliness-researcher", rarity: "SSR" },
  { id: "i-07", kind: "identity", title: "AI训练员", detail: "教模型听懂口吻、边界与现场可用的输出。", accent: "bg-mint", visualKey: "ai-trainer" },
  { id: "i-08", kind: "identity", title: "生活方式策展人", detail: "把日常碎片编排成可被模仿的理想样本。", accent: "bg-gold", visualKey: "lifestyle-curator" },
  { id: "i-09", kind: "identity", title: "平行宇宙创业者", detail: "在多条时间线里同时测试产品与叙事。", accent: "bg-coral", visualKey: "parallel-founder", rarity: "SSR" },
  { id: "i-10", kind: "identity", title: "数字人格管理员", detail: "维护多个线上身份的版本、权限与一致性。", accent: "bg-sky", visualKey: "persona-admin" }
];

const taskCards: Card[] = [
  { id: "t-01", kind: "task", title: "Landing Page", detail: "一页讲清你是谁、解决什么、如何开始。", accent: "bg-ink", visualKey: "landing-page", rarity: "SR" },
  { id: "t-02", kind: "task", title: "AI广告片", detail: "15–30 秒概念片：镜头节奏、旁白与品牌气质。", accent: "bg-ink", visualKey: "ai-ad-film", rarity: "SSR" },
  { id: "t-03", kind: "task", title: "网页小游戏", detail: "轻量互动：规则简单、一局 1–3 分钟可玩完。", accent: "bg-ink", visualKey: "web-mini-game" },
  { id: "t-04", kind: "task", title: "AI人格测试", detail: "5–8 题测出类型，并给出一句命中式解读。", accent: "bg-ink", visualKey: "personality-quiz", rarity: "SR" },
  { id: "t-05", kind: "task", title: "虚拟品牌官网", detail: "完整站点结构：首页、关于、产品/服务与联系。", accent: "bg-ink", visualKey: "virtual-brand-site" },
  { id: "t-06", kind: "task", title: "未来APP Demo", detail: "3–5 屏可点击原型，展示核心路径与界面气质。", accent: "bg-ink", visualKey: "future-app-demo", rarity: "SR" },
  { id: "t-07", kind: "task", title: "AI生成工具", detail: "定义输入、输出与一个「立刻能用」的示例。", accent: "bg-ink", visualKey: "ai-generator-tool" },
  { id: "t-08", kind: "task", title: "创业产品概念", detail: "痛点、方案、差异化与一句话 Slogan。", accent: "bg-ink", visualKey: "startup-concept" },
  { id: "t-09", kind: "task", title: "AI聊天角色", detail: "人设、开场白、3 轮对话示例与边界说明。", accent: "bg-ink", visualKey: "chat-character" },
  { id: "t-10", kind: "task", title: "未来服务平台", detail: "服务流程、定价逻辑与用户旅程示意。", accent: "bg-ink", visualKey: "future-service-platform" }
];

const constraintCards: Card[] = [
  { id: "c-01", kind: "constraint", title: "被理解感", detail: "用户要感到「你懂我」，避免说教与空泛口号。", accent: "bg-coral", visualKey: "understood", rarity: "SR" },
  { id: "c-02", kind: "constraint", title: "太空居民", detail: "场景、用语与视觉可带失重、轨道站或星际日常。", accent: "bg-sky", visualKey: "space-resident", rarity: "SSR" },
  { id: "c-03", kind: "constraint", title: "未来奢侈感", detail: "克制、留白、材质感——贵而不俗。", accent: "bg-gold", visualKey: "future-luxury", rarity: "SR" },
  { id: "c-04", kind: "constraint", title: "孤独氛围", detail: "允许安静、距离感，但不冷漠或绝望。", accent: "bg-ink", visualKey: "lonely-mood", rarity: "SR" },
  { id: "c-05", kind: "constraint", title: "互联网新人", detail: "像第一次上网：好奇、笨拙、需要手把手引导。", accent: "bg-sky", visualKey: "internet-newbie" },
  { id: "c-06", kind: "constraint", title: "90年代网页风", detail: "桌布纹理、访客计数器、闪烁 GIF 的克制致敬。", accent: "bg-coral", visualKey: "retro-web-90s", rarity: "R" },
  { id: "c-07", kind: "constraint", title: "人生重启感", detail: "强调「这一次可以重来」的仪式与希望。", accent: "bg-mint", visualKey: "life-restart", rarity: "SR" },
  { id: "c-08", kind: "constraint", title: "高压都市人", detail: "时间紧、信息密，第一眼就要有用、可执行。", accent: "bg-ink", visualKey: "urban-stress" },
  { id: "c-09", kind: "constraint", title: "儿童幻想风", detail: "童话逻辑、柔软色彩，但内容仍对成年人友好。", accent: "bg-gold", visualKey: "child-fantasy", rarity: "R" },
  { id: "c-10", kind: "constraint", title: "平静治愈感", detail: "慢节奏、低刺激，像呼吸练习一样让人放松。", accent: "bg-mint", visualKey: "calm-healing", rarity: "SR" }
];

const toolCards: Card[] = [
  { id: "tool-01", kind: "tool", title: "Cursor / Lovable", detail: "做页面、原型与可点击交互。", accent: "bg-sky", visualKey: "cursor-lovable", rarity: "SSR" },
  { id: "tool-02", kind: "tool", title: "Midjourney / GPT Image", detail: "做视觉、海报与角色设定。", accent: "bg-sky", visualKey: "midjourney", rarity: "SR" },
  { id: "tool-03", kind: "tool", title: "Runway / Kling / Veo", detail: "做 15–30 秒品牌或概念视频。", accent: "bg-sky", visualKey: "runway-kling", rarity: "SSR" },
  { id: "tool-04", kind: "tool", title: "Claude / ChatGPT", detail: "策略、文案、分镜与世界观。", accent: "bg-sky", visualKey: "claude-chatgpt", rarity: "SR" },
  { id: "tool-05", kind: "tool", title: "Figma", detail: "展示稿、组件库与视觉系统。", accent: "bg-sky", visualKey: "figma" },
  { id: "tool-06", kind: "tool", title: "Notion / Gamma", detail: "方案页、Pitch 与活动文档。", accent: "bg-sky", visualKey: "notion-gamma" },
  { id: "tool-07", kind: "tool", title: "ElevenLabs / Suno", detail: "旁白、氛围音与短曲。", accent: "bg-sky", visualKey: "audio-ai" },
  { id: "tool-08", kind: "tool", title: "即梦 / 可灵", detail: "国内视频与动效备选。", accent: "bg-sky", visualKey: "kling-cn", rarity: "R" },
  { id: "tool-09", kind: "tool", title: "v0 / Bolt", detail: "快速生成 UI 组件与页面。", accent: "bg-sky", visualKey: "v0-bolt" },
  { id: "tool-10", kind: "tool", title: "ComfyUI / SD", detail: "本地或工作流式图像生成。", accent: "bg-sky", visualKey: "comfyui" }
];

export const cardDecks: Record<CardKind, Card[]> = {
  identity: identityCards,
  task: taskCards,
  constraint: constraintCards,
  tool: toolCards
};

export const POOL_VISUAL_KEYS: Record<CardKind, string[]> = {
  identity: ["emotion-designer", "dream-architect", "loneliness-researcher", "parallel-founder"],
  task: ["landing-page", "ai-ad-film", "personality-quiz", "future-app-demo"],
  constraint: ["understood", "space-resident", "lonely-mood", "calm-healing"],
  tool: ["cursor-lovable", "midjourney", "runway-kling", "claude-chatgpt"]
};

export function getCardRarity(card: Card): CardRarity {
  return card.rarity ?? "N";
}
