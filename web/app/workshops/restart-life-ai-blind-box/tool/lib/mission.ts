import { TOOL_CARDS_ENABLED } from "../data/settings";
import type { DrawnCards, Participant, Team } from "../types";

export function buildMissionSentence(cards: DrawnCards): string {
  if (TOOL_CARDS_ENABLED && cards.tool) {
    return `以「${cards.identity.title}」身份，在「${cards.constraint.title}」限制下，用「${cards.tool.title}」完成「${cards.task.title}」。`;
  }
  return `以「${cards.identity.title}」身份，在「${cards.constraint.title}」限制下，完成「${cards.task.title}」。`;
}

export function buildLaunchPrompt(team: Team, participants: Participant[]): string {
  const members = team.members
    .map((memberId) => participants.find((participant) => participant.id === memberId))
    .filter((participant): participant is Participant => Boolean(participant));

  const cardLines = members
    .map((member) => {
      if (!member.cards) {
        return `${member.name}：尚未抽卡`;
      }
      const mission = buildMissionSentence(member.cards);
      const toolLine = member.cards.tool ? ` / ${member.cards.tool.title}` : "";
      return `${member.name}：${member.cards.identity.title} / ${member.cards.task.title} / ${member.cards.constraint.title}${toolLine}\nMission：${mission}`;
    })
    .join("\n");

  const tasks = members.map((member) => member.cards?.task.title).filter(Boolean).join(" + ");
  const constraints = members.map((member) => member.cards?.constraint.title).filter(Boolean).join("；");
  const tools = members.map((member) => member.cards?.tool?.title).filter(Boolean).join("、");

  const toolSection = TOOL_CARDS_ENABLED
    ? `推荐工具组合：${tools || "等待抽卡后生成"}`
    : "工具卡：暂未解锁，先用通用 AI 工具完成即可";

  return `小组：${team.name}
成员：
${cardLines}

共创启动任务：
把每个人的临时身份合并成一个世界观，选择一个主任务作为最终作品方向，并把其余任务转化为展示环节。

优先整合的任务：${tasks || "等待抽卡后生成"}
必须遵守的限制：${constraints || "等待抽卡后生成"}
${toolSection}

45–90 分钟内交付：一个可展示的视觉作品或可演示原型 + 30 秒说明。`;
}
