"use client";

import { useState } from "react";
import { TOOL_CARDS_ENABLED, cardKindLabels, drawModeLabel, getActiveDrawOrder, getDrawStepCount, getStepHint } from "../../data/copy";
import type { Card, CardKind, DrawStep, Participant } from "../../types";
import { RetroButton } from "../retro/RetroButton";
import { RetroInventorySlot } from "../retro/RetroInventorySlot";
import { CardVertical } from "./CardVertical";

type GachaHandBarProps = {
  partial: Partial<Record<CardKind, Card>>;
  currentStep: DrawStep;
  slotRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

export function GachaHandBar({ partial, currentStep, slotRefs }: GachaHandBarProps) {
  const activeOrder = getActiveDrawOrder();

  return (
    <div className="gacha-hand-bar">
      {activeOrder.map((kind, index) => {
        const card = partial[kind];
        const isActive = index === currentStep && !card;
        const isFilled = Boolean(card);
        return (
          <RetroInventorySlot
            key={kind}
            label={cardKindLabels[kind]}
            active={isActive}
            filled={isFilled}
            dense
            slotRef={(element) => {
              slotRefs.current[index] = element;
            }}
          >
            <div className={`transition-transform ${isActive ? "gacha-slot-active" : ""}`}>
              <CardVertical card={card} showBack={!card} slot />
            </div>
          </RetroInventorySlot>
        );
      })}
      {!TOOL_CARDS_ENABLED ? (
        <RetroInventorySlot label="工具" dense filled={false}>
          <div className="flex h-[44px] w-[36px] items-center justify-center border border-dashed border-black/40 bg-[var(--retro-surface-alt)] text-[10px] font-black opacity-50">
            🔒
          </div>
        </RetroInventorySlot>
      ) : null}
    </div>
  );
}

type CompleteFanProps = {
  cards: Partial<Record<CardKind, Card>>;
  mission: string;
  fanRef: React.RefObject<HTMLDivElement | null>;
  missionRef: React.RefObject<HTMLDivElement | null>;
};

export function CompleteFan({ cards, mission, fanRef, missionRef }: CompleteFanProps) {
  const activeOrder = getActiveDrawOrder();
  const rotations = [-5, -2, 2, 5];

  return (
    <div className="gacha-complete">
      <div ref={fanRef} className={`gacha-complete-fan ${activeOrder.length === 3 ? "gacha-complete-fan-three" : ""}`}>
        {activeOrder.map((kind, index) => (
          <div
            key={kind}
            className="gacha-complete-card gacha-complete-fan-item"
            style={{ ["--fan-rotate" as string]: `${rotations[index]}deg` }}
          >
            <CardVertical card={cards[kind]} showcase />
          </div>
        ))}
      </div>
      <div ref={missionRef} className="gacha-complete-mission retro-dither-panel">
        <p className="retro-font-mono text-[10px] font-black uppercase tracking-widest sm:text-xs">身份重启完成 · 今晚你不是你</p>
        <p className="retro-font-mono mt-2 text-sm font-bold leading-relaxed sm:text-base">{mission}</p>
        {!TOOL_CARDS_ENABLED ? (
          <p className="retro-font-mono mt-2 text-[10px] font-bold opacity-60">工具卡暂未解锁 · 可用任意熟悉的 AI 工具完成</p>
        ) : null}
      </div>
    </div>
  );
}

type GachaSidebarProps = {
  participants: Participant[];
  activeParticipantId?: string;
  currentStep: DrawStep;
  partial: Partial<Record<CardKind, Card>>;
  onSelectParticipant: (id: string) => void;
  onAddParticipant: (name: string) => void;
  canAddParticipant: boolean;
  isAnimating: boolean;
};

export function GachaSidebar({
  participants,
  activeParticipantId,
  currentStep,
  partial,
  onSelectParticipant,
  onAddParticipant,
  canAddParticipant,
  isAnimating
}: GachaSidebarProps) {
  const [newName, setNewName] = useState("");
  const activeOrder = getActiveDrawOrder();
  const stepCount = getDrawStepCount();

  const submitNewParticipant = () => {
    const name = newName.trim();
    if (!name || !canAddParticipant) {
      return;
    }
    onAddParticipant(name);
    setNewName("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <div className={participants.length === 0 ? "order-1 border-2 border-black bg-[var(--retro-surface-alt)] p-3 retro-dither-panel" : "order-2 min-h-0 flex-1 overflow-auto"}>
        <div className="flex items-center justify-between gap-2">
          <p className="retro-font-mono text-[10px] font-black uppercase tracking-widest opacity-60">
            {participants.length === 0 ? "从这里开始" : "重启者"}
          </p>
          <span className="retro-font-mono text-[9px] font-bold opacity-50">{participants.length}/20</span>
        </div>

        <div className="mt-2 grid gap-2">
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitNewParticipant();
              }
            }}
            placeholder={participants.length === 0 ? "输入昵称，例如：林予" : "输入下一位昵称"}
            disabled={!canAddParticipant}
            autoFocus={participants.length === 0}
            className="min-h-10 w-full border-2 border-black bg-[var(--retro-surface)] px-2 text-sm font-bold disabled:opacity-40"
          />
          <RetroButton onClick={submitNewParticipant} disabled={!newName.trim() || !canAddParticipant} variant="accent" className="w-full">
            {participants.length === 0 ? `添加并自动${drawModeLabel}` : "+ 添加重启者"}
          </RetroButton>
          {participants.length === 0 ? (
            <p className="text-[10px] font-bold leading-snug opacity-60">添加后 STAGE 自动抽卡 · 可继续加下一位</p>
          ) : null}
          {isAnimating && newName.trim() ? (
            <p className="text-[9px] font-bold opacity-60">动画进行中：添加后会进队列，当前抽卡不受影响</p>
          ) : null}
          {!canAddParticipant ? <p className="text-[9px] font-bold opacity-60">已达 20 人上限 · 请去主持台管理</p> : null}
        </div>

        {participants.length === 0 ? null : (
          <ul className="mt-3 grid gap-1">
            {participants.map((participant) => (
              <li key={participant.id}>
                <button
                  type="button"
                  onClick={() => onSelectParticipant(participant.id)}
                  disabled={isAnimating && participant.id !== activeParticipantId}
                  className={`w-full border-2 px-2 py-1.5 text-left text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50 ${
                    participant.id === activeParticipantId
                      ? "border-black bg-[var(--retro-ink)] text-[var(--retro-surface)]"
                      : participant.cards
                        ? "border-black bg-[var(--retro-surface-alt)]"
                        : "border-black/30 opacity-70"
                  }`}
                >
                  {participant.name}
                  {participant.cards ? " · 已完成" : participant.drawProgress?.partial ? ` · 进行中 ${Math.min(stepCount, Object.keys(participant.drawProgress.partial ?? {}).length)}/${stepCount}` : ""}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={participants.length === 0 ? "order-2 opacity-70" : "order-1 shrink-0"}>
        <p className="retro-font-mono text-[10px] font-black uppercase tracking-widest opacity-60">卡池 · {drawModeLabel}</p>
        <nav className="mt-2 grid gap-1">
          {activeOrder.map((kind, index) => {
            const done = Boolean(partial[kind]);
            const active = index === currentStep && !done && participants.length > 0;
            return (
              <div
                key={kind}
                className={`border-2 px-2 py-1.5 text-xs font-black ${
                  active
                    ? "border-black bg-[var(--retro-ink)] text-[var(--retro-surface)]"
                    : done
                      ? "border-black bg-[var(--retro-surface-alt)]"
                      : "border-black/30 opacity-50"
                }`}
              >
                {done ? "[x] " : active ? "[>] " : "[ ] "}
                {cardKindLabels[kind]}
              </div>
            );
          })}
          {!TOOL_CARDS_ENABLED ? (
            <div className="border-2 border-dashed border-black/30 px-2 py-1.5 text-xs font-bold opacity-40">[🔒] 工具卡 · 未解锁</div>
          ) : null}
        </nav>
        {participants.length > 0 ? (
          <p className="retro-font-mono mt-3 text-[10px] font-bold leading-snug opacity-60">{getStepHint(currentStep)}</p>
        ) : null}
      </div>
    </div>
  );
}
