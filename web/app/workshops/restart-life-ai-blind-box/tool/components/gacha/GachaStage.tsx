"use client";

import { useEffect, useRef } from "react";
import { getCardRarity } from "../../data/cards";
import { cardKindLabels, getStepHint } from "../../data/copy";
import { useCompleteFanTimeline, useGachaTimeline } from "../../hooks/useGachaTimeline";
import type { Card, GachaPhase, Participant } from "../../types";
import { getCurrentStep, getPartialCards } from "../../lib/draw";
import { buildMissionSentence } from "../../lib/mission";
import { CardVertical } from "./CardVertical";
import { GachaEmptyStart } from "./GachaEmptyStart";
import { CompleteFan } from "./GachaHandBar";
import { RarityFX } from "./RarityFX";

type GachaStageProps = {
  participant?: Participant;
  phase: GachaPhase;
  revealCard: Card | null;
  fastMode: boolean;
  onPhaseChange: (phase: GachaPhase) => void;
  onDrawComplete: () => void;
  slotRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onLoadDemo: () => void;
  onOpenHost: () => void;
  onThemeMonoChange: (active: boolean) => void;
  onStageFlashChange: (active: boolean) => void;
};

export function GachaStage({
  participant,
  phase,
  revealCard,
  fastMode,
  onPhaseChange,
  onDrawComplete,
  slotRefs,
  onLoadDemo,
  onOpenHost,
  onThemeMonoChange,
  onStageFlashChange
}: GachaStageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const animKeyRef = useRef(0);

  const currentStep = getCurrentStep(participant);
  const cards = participant?.cards;
  const mission = cards ? buildMissionSentence(cards) : null;

  const slotRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    slotRef.current = slotRefs.current[currentStep] ?? null;
  }, [currentStep, slotRefs]);

  const { playDraw, playIdle, resetCard } = useGachaTimeline({
    cardRef: innerRef,
    slotRef,
    card: revealCard,
    fastMode,
    onPhaseChange,
    onComplete: onDrawComplete,
    onThemeMonoChange,
    onStageFlashChange
  });

  useCompleteFanTimeline(fanRef, missionRef, phase === "complete" && Boolean(cards));

  useEffect(() => {
    if (revealCard) {
      animKeyRef.current += 1;
      resetCard();
      playDraw();
    }
  }, [revealCard, playDraw, resetCard]);

  useEffect(() => {
    if (phase === "ready" && !revealCard && innerRef.current) {
      playIdle();
    }
  }, [phase, revealCard, playIdle]);

  if (!participant) {
    return <GachaEmptyStart onLoadDemo={onLoadDemo} onOpenHost={onOpenHost} />;
  }

  if (phase === "complete" && cards && mission) {
    return (
      <div className="gacha-stage-arena gacha-stage-arena-contained px-2 py-3">
        <CompleteFan cards={cards} mission={mission} fanRef={fanRef} missionRef={missionRef} />
      </div>
    );
  }

  const showBack = phase === "ready" || phase === "charge" || phase === "flip" || !revealCard;
  const displayCard = showBack ? undefined : revealCard ?? undefined;
  const rarity = revealCard ? getCardRarity(revealCard) : "N";
  const isDrawing = phase === "charge" || phase === "flip" || phase === "reveal" || phase === "slot";

  return (
    <div className={`gacha-stage-arena px-2 py-3 ${isDrawing ? "gacha-stage-arena-drawing" : "gacha-stage-arena-contained"}`}>
      <p className="retro-font-mono mb-3 text-center text-xs font-bold" aria-live="polite">
        {getStepHint(currentStep)}
      </p>
      <div ref={cardRef} className="gacha-card-scene relative">
        <div
          ref={innerRef}
          className="gacha-card-inner h-[min(40vh,420px)] w-[min(28vh,280px)] min-h-[240px] min-w-[170px] sm:min-h-[280px] sm:min-w-[190px]"
        >
          <div className="gacha-card-face gacha-card-back">
            <CardVertical showBack fill />
          </div>
          <div className="gacha-card-face gacha-card-front">
            <CardVertical card={displayCard} fill />
          </div>
        </div>
        <RarityFX rarity={rarity} active={phase === "reveal" || phase === "flip"} />
      </div>
      {revealCard && phase === "reveal" ? (
        <div className="gacha-reveal-banner">
          <p className="retro-font-mono text-[10px] font-black uppercase tracking-widest opacity-60">{cardKindLabels[revealCard.kind]}</p>
          <p className="retro-font-mono mt-1 text-lg font-black leading-snug sm:text-xl">{revealCard.title}</p>
          <p className="retro-font-mono mt-1 text-xs font-bold leading-relaxed opacity-70">{revealCard.detail}</p>
        </div>
      ) : null}
    </div>
  );
}
