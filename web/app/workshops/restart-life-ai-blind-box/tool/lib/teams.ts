import { levelLabels } from "../data/copy";
import { TOOL_CARDS_ENABLED } from "../data/settings";
import { buildLaunchPrompt, buildMissionSentence } from "./mission";
import type { ExperienceLevel, Participant, Team } from "../types";
import { randomId } from "./utils";

export const levelWeights: Record<ExperienceLevel, number> = {
  first: 0,
  mixed: 1,
  vibe: 2
};

export function balanceTeams(participants: Participant[], groupSize: number): Team[] {
  const drawnParticipants = participants.filter((participant) => participant.cards);
  const teamCount = Math.max(1, Math.ceil(drawnParticipants.length / groupSize));
  const teams: Participant[][] = Array.from({ length: teamCount }, () => []);
  const sorted = [...drawnParticipants].sort(
    (a, b) => levelWeights[b.level] - levelWeights[a.level] || a.name.localeCompare(b.name)
  );

  sorted.forEach((participant, index) => {
    const orderedTeams = [...teams].sort((a, b) => {
      if (a.length !== b.length) {
        return a.length - b.length;
      }
      const aScore = a.reduce((sum, member) => sum + levelWeights[member.level], 0);
      const bScore = b.reduce((sum, member) => sum + levelWeights[member.level], 0);
      return aScore - bScore;
    });
    orderedTeams[index % orderedTeams.length].push(participant);
  });

  return teams
    .filter((team) => team.length > 0)
    .map<Team>((team, index) => ({
      id: randomId("team"),
      name: `实验小组 ${String(index + 1).padStart(2, "0")}`,
      members: team.map((member) => member.id),
      status: "draft"
    }));
}

export function exportText(participants: Participant[], teams: Team[]): string {
  const participantLines = participants
    .map((participant, index) => {
      const cards = participant.cards;
      const mission = cards ? buildMissionSentence(cards) : "";
      const toolLine = TOOL_CARDS_ENABLED && cards?.tool ? `\n工具：${cards.tool.title}` : "";
      return `${index + 1}. ${participant.name}（${levelLabels[participant.level]}）
身份：${cards?.identity.title ?? "未抽"}
任务：${cards?.task.title ?? "未抽"}
限制：${cards?.constraint.title ?? "未抽"}${toolLine}
${mission ? `Mission：${mission}` : ""}`;
    })
    .join("\n\n");

  const teamLines = teams
    .map((team) => {
      const names = team.members
        .map((memberId) => participants.find((participant) => participant.id === memberId)?.name)
        .filter(Boolean)
        .join("、");
      return `${team.name}：${names || "待匹配"}\n${buildLaunchPrompt(team, participants)}`;
    })
    .join("\n\n---\n\n");

  return `Blind Vibe · 重启人生 AI 盲盒现场结果

参与者抽卡：
${participantLines || "暂无参与者"}

组队结果：
${teamLines || "暂无小组"}`;
}
