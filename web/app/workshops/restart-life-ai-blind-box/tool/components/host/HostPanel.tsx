"use client";

import {
  BadgePlus,
  ClipboardCopy,
  Download,
  RotateCcw,
  Sparkles,
  TimerReset,
  Trash2,
  UsersRound
} from "lucide-react";
import { useState } from "react";
import { RetroButton } from "../retro/RetroButton";
import { RetroMenuBar } from "../retro/RetroMenuBar";
import { RetroShell } from "../retro/RetroShell";
import { RetroWindow } from "../retro/RetroWindow";
import { APP_TAGLINE, levelLabels, starterNames } from "../../data/copy";
import { buildLaunchPrompt, buildMissionSentence } from "../../lib/mission";
import { exportText } from "../../lib/teams";
import type { ExperienceLevel, Participant, Team } from "../../types";

type HostPanelProps = {
  participants: Participant[];
  teams: Team[];
  activeParticipantId?: string;
  groupSize: number;
  drawnCount: number;
  onBack: () => void;
  onSetActiveParticipant: (id: string) => void;
  onAddParticipant: (name: string, level: ExperienceLevel) => void;
  onBulkAdd: (names: string[]) => void;
  onLoadStarter: () => void;
  onRemoveParticipant: (id: string) => void;
  onGroupSizeChange: (size: number) => void;
  onRematchTeams: () => void;
  onToggleTeamStatus: (teamId: string) => void;
  onResetAll: () => void;
};

export function HostPanel({
  participants,
  teams,
  activeParticipantId,
  groupSize,
  drawnCount,
  onBack,
  onSetActiveParticipant,
  onAddParticipant,
  onBulkAdd,
  onLoadStarter,
  onRemoveParticipant,
  onGroupSizeChange,
  onRematchTeams,
  onToggleTeamStatus,
  onResetAll
}: HostPanelProps) {
  const [newName, setNewName] = useState("");
  const [newLevel, setNewLevel] = useState<ExperienceLevel>("mixed");
  const [bulkNames, setBulkNames] = useState("");
  const [copiedTeamId, setCopiedTeamId] = useState<string>();

  const copyTeamPrompt = async (team: Team) => {
    await navigator.clipboard.writeText(buildLaunchPrompt(team, participants));
    setCopiedTeamId(team.id);
    window.setTimeout(() => setCopiedTeamId(undefined), 1400);
  };

  const downloadResult = () => {
    const blob = new Blob([exportText(participants, teams)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "blind-vibe-results.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <RetroShell scrollable>
      <RetroMenuBar
        brand="HOST DESK"
        subtitle={APP_TAGLINE}
        items={[{ label: "← 返回唤醒台 (H)", onClick: onBack }]}
      />

      <div className="mx-auto grid w-full max-w-[1600px] gap-5 p-4 lg:p-6">
        <div className="retro-counter-grid">
          <div className="retro-counter-cell">
            <p className="text-3xl font-black">{participants.length}</p>
            <p className="retro-font-mono mt-1 text-[10px] font-black uppercase">重启者</p>
          </div>
          <div className="retro-counter-cell">
            <p className="text-3xl font-black">{drawnCount}</p>
            <p className="retro-font-mono mt-1 text-[10px] font-black uppercase">已完成</p>
          </div>
          <div className="retro-counter-cell">
            <p className="text-3xl font-black">{teams.length}</p>
            <p className="retro-font-mono mt-1 text-[10px] font-black uppercase">小组</p>
          </div>
        </div>

        <section className="grid gap-5 xl:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
          <div className="grid gap-4">
            <RetroWindow title="QUEUE">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-black">参与者队列</h2>
                  <UsersRound className="h-4 w-4" />
                </div>
                <div className="grid gap-2">
                  <input
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && newName.trim()) {
                        onAddParticipant(newName.trim(), newLevel);
                        setNewName("");
                      }
                    }}
                    placeholder="输入姓名或昵称"
                    className="min-h-10 border-2 border-black bg-[var(--retro-surface)] px-3 text-sm font-bold"
                  />
                  <select
                    value={newLevel}
                    onChange={(event) => setNewLevel(event.target.value as ExperienceLevel)}
                    className="min-h-10 border-2 border-black bg-[var(--retro-surface)] px-3 text-sm font-bold"
                  >
                    <option value="first">第一次接触</option>
                    <option value="mixed">用过 AI</option>
                    <option value="vibe">Vibe 老手</option>
                  </select>
                  <RetroButton
                    title="添加"
                    onClick={() => {
                      if (newName.trim()) {
                        onAddParticipant(newName.trim(), newLevel);
                        setNewName("");
                      }
                    }}
                    disabled={!newName.trim() || participants.length >= 20}
                    variant="primary"
                    className="w-full"
                  >
                    <BadgePlus className="h-4 w-4" />
                    添加
                  </RetroButton>
                </div>
              </div>
            </RetroWindow>

            <RetroWindow title="IMPORT">
              <div className="p-4">
                <h3 className="mb-2 text-sm font-black">批量导入</h3>
                <textarea
                  value={bulkNames}
                  onChange={(event) => setBulkNames(event.target.value)}
                  placeholder="一行一个名字"
                  className="min-h-[90px] w-full resize-y border-2 border-black bg-[var(--retro-surface)] p-3 text-sm font-bold"
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <RetroButton
                    title="导入"
                    onClick={() => {
                      const names = bulkNames.split(/\n|,|，/).map((n) => n.trim()).filter(Boolean);
                      onBulkAdd(names);
                      setBulkNames("");
                    }}
                    disabled={!bulkNames.trim() || participants.length >= 20}
                  >
                    导入
                  </RetroButton>
                  <RetroButton title="载入20人" onClick={onLoadStarter} disabled={participants.length >= 20}>
                    载入20人
                  </RetroButton>
                </div>
                <p className="retro-font-mono mt-2 text-[10px] opacity-50">预设：{starterNames.slice(0, 4).join("、")}…</p>
              </div>
            </RetroWindow>

            <RetroWindow title="ROSTER" className="max-h-[360px]">
              <div className="max-h-[320px] overflow-auto p-2">
                {participants.length === 0 ? (
                  <p className="p-3 text-xs font-bold opacity-50">暂无参与者</p>
                ) : (
                  <div className="grid gap-1">
                    {participants.map((participant) => (
                      <button
                        key={participant.id}
                        type="button"
                        onClick={() => onSetActiveParticipant(participant.id)}
                        className={`grid grid-cols-[1fr_auto] items-center gap-2 border-2 p-2 text-left ${
                          activeParticipantId === participant.id
                            ? "border-black bg-[var(--retro-ink)] text-[var(--retro-surface)]"
                            : participant.cards
                              ? "border-black bg-[var(--retro-surface-alt)]"
                              : "border-black/30"
                        }`}
                      >
                        <span className="min-w-0 truncate text-xs font-black">{participant.name}</span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            onRemoveParticipant(participant.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.stopPropagation();
                              onRemoveParticipant(participant.id);
                            }
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center border-2 border-current"
                        >
                          <Trash2 className="h-3 w-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </RetroWindow>
          </div>

          <div className="grid gap-4">
            <RetroWindow title="MATCH">
              <div className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h2 className="text-base font-black">自由匹配</h2>
                  <p className="retro-font-mono mt-1 text-xs font-bold opacity-70">按经验值搭配，默认 3 人组。</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={groupSize}
                    onChange={(event) => onGroupSizeChange(Number(event.target.value))}
                    className="min-h-10 border-2 border-black bg-[var(--retro-surface)] px-3 text-sm font-black"
                  >
                    <option value={2}>2 人组</option>
                    <option value={3}>3 人组</option>
                    <option value={4}>4 人组</option>
                  </select>
                  <RetroButton title="匹配" onClick={onRematchTeams} disabled={drawnCount < 2} variant="accent">
                    <Sparkles className="h-4 w-4" />
                    开始匹配
                  </RetroButton>
                </div>
              </div>
            </RetroWindow>

            <RetroWindow title="TEAMS">
              <div className="p-4">
                <h2 className="mb-3 text-sm font-black">实验小组</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {teams.length === 0 ? (
                    <p className="text-xs opacity-60 md:col-span-2">所有人抽完后点击「开始匹配」。</p>
                  ) : (
                    teams.map((team) => {
                      const members = team.members
                        .map((id) => participants.find((p) => p.id === id))
                        .filter((p): p is Participant => Boolean(p));
                      return (
                        <article key={team.id} className="border-2 border-black bg-[var(--retro-surface-alt)] p-3 retro-dither-panel">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-black">{team.name}</h3>
                              <p className="retro-font-mono text-[10px] opacity-60">{team.status === "started" ? "实现中" : "待启动"}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onToggleTeamStatus(team.id)}
                              className={`flex h-8 w-8 items-center justify-center border-2 border-black ${
                                team.status === "started" ? "bg-[var(--retro-accent)] text-white" : "bg-[var(--retro-surface)]"
                              }`}
                            >
                              <TimerReset className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="mt-2 grid gap-1">
                            {members.map((member) => (
                              <div key={member.id} className="border border-black/20 px-2 py-1 text-[10px]">
                                <span className="font-black">{member.name}</span>
                                <span className="ml-1 opacity-60">({levelLabels[member.level]})</span>
                                {member.cards ? <p className="opacity-70">{buildMissionSentence(member.cards)}</p> : null}
                              </div>
                            ))}
                          </div>
                          <RetroButton onClick={() => copyTeamPrompt(team)} variant="primary" className="mt-2 w-full text-[11px]">
                            <ClipboardCopy className="h-3.5 w-3.5" />
                            {copiedTeamId === team.id ? "已复制" : "复制启动语"}
                          </RetroButton>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            </RetroWindow>

            <div className="grid grid-cols-2 gap-2">
              <RetroButton title="导出" onClick={downloadResult}>
                <Download className="h-4 w-4" />
                导出
              </RetroButton>
              <RetroButton
                title="重置"
                variant="alert"
                onClick={() => {
                  if (window.confirm("将清空所有现场数据，确定？")) {
                    onResetAll();
                  }
                }}
              >
                <RotateCcw className="h-4 w-4" />
                重置
              </RetroButton>
            </div>
          </div>
        </section>
      </div>
    </RetroShell>
  );
}
