"use client";

import { useCallback, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { getCardRarity } from "../data/cards";
import type { Card, GachaPhase } from "../types";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(useGSAP);

type GachaTimelineOptions = {
  cardRef: React.RefObject<HTMLDivElement | null>;
  slotRef: React.RefObject<HTMLDivElement | null>;
  card: Card | null;
  fastMode: boolean;
  onPhaseChange: (phase: GachaPhase) => void;
  onComplete: () => void;
  onThemeMonoChange?: (active: boolean) => void;
  onStageFlashChange?: (active: boolean) => void;
};

const SSR_FLASH_MS = 400;

function getSlotTargetScale(cardEl: HTMLElement, slotEl: HTMLElement): number {
  const slotRect = slotEl.getBoundingClientRect();
  const cardRect = cardEl.getBoundingClientRect();
  const scaleX = (slotRect.width * 0.82) / cardRect.width;
  const scaleY = (slotRect.height * 0.72) / cardRect.height;
  return Math.min(scaleX, scaleY, 0.42);
}

function triggerRevealFX(
  rarity: ReturnType<typeof getCardRarity>,
  reducedMotion: boolean,
  onThemeMonoChange?: (active: boolean) => void,
  onStageFlashChange?: (active: boolean) => void
) {
  if (rarity === "SSR") {
    if (reducedMotion) {
      onStageFlashChange?.(true);
      window.setTimeout(() => onStageFlashChange?.(false), SSR_FLASH_MS);
      return;
    }
    onThemeMonoChange?.(true);
    window.setTimeout(() => onThemeMonoChange?.(false), SSR_FLASH_MS);
    return;
  }

  if (rarity === "SR" || rarity === "R") {
    onStageFlashChange?.(true);
    window.setTimeout(() => onStageFlashChange?.(false), 300);
  }
}

export function useGachaTimeline({
  cardRef,
  slotRef,
  card,
  fastMode,
  onPhaseChange,
  onComplete,
  onThemeMonoChange,
  onStageFlashChange
}: GachaTimelineOptions) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();

  const playDraw = useCallback(() => {
    if (!cardRef.current || !card) {
      onComplete();
      return;
    }

    timelineRef.current?.kill();
    const rarity = getCardRarity(card);
    const revealDuration = fastMode ? 0.5 : 1.2;
    const tl = gsap.timeline({
      onComplete
    });
    timelineRef.current = tl;

    if (reducedMotion) {
      onPhaseChange("reveal");
      triggerRevealFX(rarity, true, onThemeMonoChange, onStageFlashChange);
      tl.set(cardRef.current, { autoAlpha: 1, rotationY: 180, scale: 1, x: 0, y: 0 });
      tl.call(() => onPhaseChange("slot"), undefined, `+=${revealDuration * 0.5}`);
      if (slotRef.current) {
        const targetScale = getSlotTargetScale(cardRef.current, slotRef.current);
        tl.to(cardRef.current, { scale: targetScale, duration: 0.3, ease: "power2.inOut" });
      }
      return;
    }

    onPhaseChange("charge");
    tl.fromTo(
      cardRef.current,
      { y: 120, scale: 0.6, rotationY: 0, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(1.4)" }
    );

    const shakeRepeats = rarity === "SSR" ? 10 : rarity === "SR" ? 8 : 6;
    tl.to(cardRef.current, { x: "+=5", duration: 0.04, repeat: shakeRepeats, yoyo: true }, "-=0.1");

    tl.call(() => onPhaseChange("flip"));
    tl.to(cardRef.current, { rotationY: 180, duration: 0.45, ease: "power2.inOut" });
    tl.call(() => {
      onPhaseChange("reveal");
      triggerRevealFX(rarity, false, onThemeMonoChange, onStageFlashChange);
    });
    tl.to({}, { duration: revealDuration });

    tl.call(() => onPhaseChange("slot"));
    if (slotRef.current) {
      const slotRect = slotRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      const dx = slotRect.left + slotRect.width / 2 - (cardRect.left + cardRect.width / 2);
      const dy = slotRect.top + slotRect.height / 2 - (cardRect.top + cardRect.height / 2);
      const targetScale = getSlotTargetScale(cardRef.current, slotRef.current);
      tl.to(cardRef.current, {
        x: dx,
        y: dy,
        scale: targetScale,
        duration: 0.5,
        ease: "power3.inOut"
      });
    } else {
      tl.to(cardRef.current, { scale: 0.35, y: 80, duration: 0.5, ease: "power3.inOut" });
    }
  }, [card, cardRef, fastMode, onComplete, onPhaseChange, onStageFlashChange, onThemeMonoChange, reducedMotion, slotRef]);

  const playIdle = useCallback(() => {
    if (!cardRef.current || reducedMotion) {
      return;
    }
    gsap.to(cardRef.current, {
      y: "+=8",
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
  }, [cardRef, reducedMotion]);

  const resetCard = useCallback(() => {
    if (!cardRef.current) {
      return;
    }
    gsap.set(cardRef.current, { clearProps: "all" });
    gsap.set(cardRef.current, { autoAlpha: 1, rotationY: 0, scale: 1, x: 0, y: 0 });
  }, [cardRef]);

  useGSAP(() => {
    return () => {
      timelineRef.current?.kill();
    };
  });

  return { playDraw, playIdle, resetCard };
}

export function useCompleteFanTimeline(
  fanRef: React.RefObject<HTMLDivElement | null>,
  missionRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean
) {
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!enabled || !fanRef.current) {
        return;
      }
      const cards = fanRef.current.querySelectorAll(".gacha-complete-card");
      if (reducedMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        if (missionRef.current) {
          gsap.set(missionRef.current, { autoAlpha: 1 });
        }
        return;
      }
      gsap.fromTo(cards, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.2)" });
      if (missionRef.current) {
        gsap.fromTo(missionRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.4 });
      }
    },
    { dependencies: [enabled, reducedMotion], scope: fanRef }
  );
}
