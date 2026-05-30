"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GachaLayout } from "./components/gacha/GachaLayout";
import { HostPanel } from "./components/host/HostPanel";
import { drawSingleCard, getCurrentStep, getDrawStepCount, getRemainingDraws } from "./lib/draw";
import { buildMissionSentence } from "./lib/mission";
import { clearStoredState, loadStoredState, saveStoredState } from "./lib/storage";
import { balanceTeams } from "./lib/teams";
import { randomId } from "./lib/utils";
import { starterNames } from "./data/copy";
import type { AppMode, Card, DrawMode, ExperienceLevel, GachaPhase, Participant, Team } from "./types";
import "./styles/retro-tokens.css";
import "./styles/retro-textures.css";
import "./styles/retro-window.css";
import "./styles/card-art.css";
import "./styles/gacha.css";

function useFullscreenShell() {
  useEffect(() => {
    document.documentElement.classList.add("blind-vibe-lock");
    return () => document.documentElement.classList.remove("blind-vibe-lock");
  }, []);
}

type PendingDraw = ReturnType<typeof drawSingleCard>;

export function BlindBoxApp() {
  useFullscreenShell();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeParticipantId, setActiveParticipantId] = useState<string>();
  const [appMode, setAppMode] = useState<AppMode>("gacha");
  const [phase, setPhase] = useState<GachaPhase>("idle");
  const [revealCard, setRevealCard] = useState<Card | null>(null);
  const [drawMode, setDrawMode] = useState<DrawMode>("quad");
  const [fastMode, setFastMode] = useState(false);
  const [groupSize, setGroupSize] = useState(3);
  const [copiedMission, setCopiedMission] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [themeMono, setThemeMono] = useState(false);
  const [stageFlash, setStageFlash] = useState(false);

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pendingDrawRef = useRef<PendingDraw | null>(null);
  const quadQueueRef = useRef(0);
  const autoQuadKeyRef = useRef<string | null>(null);
  const participantsRef = useRef<Participant[]>([]);
  const isAnimatingRef = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);

  participantsRef.current = participants;
  isAnimatingRef.current = isAnimating;

  useEffect(() => {
    const stored = loadStoredState();
    setParticipants(stored.participants);
    setTeams(stored.teams);
    setActiveParticipantId(stored.activeParticipantId);
    setDrawMode(stored.drawMode);
    setFastMode(stored.fastMode);
  }, []);

  useEffect(() => {
    saveStoredState({ participants, teams, activeParticipantId, drawMode, fastMode });
  }, [participants, teams, activeParticipantId, drawMode, fastMode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h" && !event.metaKey && !event.ctrlKey) {
        const target = event.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        setAppMode((mode) => (mode === "gacha" ? "host" : "gacha"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeParticipant = useMemo(
    () =>
      participants.find((p) => p.id === activeParticipantId) ??
      participants.find((p) => !p.cards) ??
      participants[0],
    [activeParticipantId, participants]
  );

  const drawnCount = participants.filter((p) => p.cards).length;

  useEffect(() => {
    if (!activeParticipant) {
      setPhase("blocked");
      return;
    }
    if (activeParticipant.cards) {
      setPhase("complete");
      return;
    }
    if (isAnimating) {
      return;
    }
    setPhase("ready");
  }, [activeParticipant?.id, activeParticipant?.cards, animKey, isAnimating]);

  const commitParticipantDraw = useCallback((participantId: string, result: PendingDraw) => {
    setParticipants((current) =>
      current.map((participant) => {
        if (participant.id !== participantId) {
          return participant;
        }
        if (result.complete && result.cards) {
          return { ...participant, cards: result.cards, drawProgress: undefined };
        }
        return {
          ...participant,
          drawProgress: { step: Math.min(getDrawStepCount() - 1, result.step + 1) as 0 | 1 | 2 | 3, partial: result.partial }
        };
      })
    );
  }, []);

  const beginDraw = useCallback((participant: Participant) => {
    if (participant.cards || isAnimatingRef.current) {
      return false;
    }

    const roster = participantsRef.current;
    const resolved = roster.find((p) => p.id === participant.id) ?? participant;
    if (resolved.cards) {
      return false;
    }

    const result = drawSingleCard(resolved, roster);
    pendingDrawRef.current = result;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setRevealCard(null);
    requestAnimationFrame(() => {
      setRevealCard(result.card);
      setAnimKey((key) => key + 1);
    });
    return true;
  }, []);

  const startQuadDraw = useCallback(
    (participant: Participant) => {
      if (participant.cards || isAnimatingRef.current) {
        return false;
      }

      const remaining = getRemainingDraws(participant);
      if (remaining <= 0) {
        return false;
      }

      quadQueueRef.current = remaining - 1;
      const started = beginDraw(participant);
      if (started) {
        autoQuadKeyRef.current = `${participant.id}:${getCurrentStep(participant)}`;
      }
      return started;
    },
    [beginDraw]
  );

  const scheduleAutoQuad = useCallback(
    (participant: Participant, delayMs = 300) => {
      if (drawMode !== "quad" || participant.cards || isAnimatingRef.current) {
        return undefined;
      }

      const step = getCurrentStep(participant);
      const key = `${participant.id}:${step}`;
      if (autoQuadKeyRef.current === key) {
        return undefined;
      }

      return window.setTimeout(() => {
        const latest = participantsRef.current.find((p) => p.id === participant.id) ?? participant;
        if (!latest.cards && !isAnimatingRef.current) {
          startQuadDraw(latest);
        }
      }, delayMs);
    },
    [drawMode, startQuadDraw]
  );

  useEffect(() => {
    if (drawMode !== "quad") {
      autoQuadKeyRef.current = null;
      return;
    }
    if (!activeParticipant || activeParticipant.cards || isAnimating || phase !== "ready") {
      return;
    }

    const timer = scheduleAutoQuad(activeParticipant);
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [activeParticipant, drawMode, isAnimating, phase, scheduleAutoQuad]);

  useEffect(() => {
    if (drawMode !== "quad" || phase !== "complete" || isAnimating) {
      return;
    }
    if (!participants.some((p) => !p.cards)) {
      return;
    }

    const timer = window.setTimeout(() => {
      const next = participants.find((p) => !p.cards);
      if (next) {
        autoQuadKeyRef.current = null;
        setActiveParticipantId(next.id);
      }
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [drawMode, phase, isAnimating, participants]);

  const handleDrawComplete = useCallback(() => {
    const pending = pendingDrawRef.current;
    const participantId = activeParticipant?.id;
    if (!pending || !participantId) {
      isAnimatingRef.current = false;
      setIsAnimating(false);
      setRevealCard(null);
      return;
    }

    commitParticipantDraw(participantId, pending);
    pendingDrawRef.current = null;
    setRevealCard(null);
    isAnimatingRef.current = false;
    setIsAnimating(false);

    if (pending.complete) {
      setPhase("complete");
      quadQueueRef.current = 0;
      return;
    }

    if (quadQueueRef.current > 0) {
      quadQueueRef.current -= 1;
      const updated = participantsRef.current.find((p) => p.id === participantId) ?? activeParticipant!;
      const nextParticipant = {
        ...updated,
        drawProgress: { step: Math.min(getDrawStepCount() - 1, pending.step + 1) as 0 | 1 | 2 | 3, partial: pending.partial }
      };
      window.setTimeout(() => beginDraw(nextParticipant), 300);
      return;
    }

    setPhase("ready");
  }, [activeParticipant, beginDraw, commitParticipantDraw]);

  const handleAwakenOne = () => {
    if (!activeParticipant || activeParticipant.cards) {
      return;
    }
    quadQueueRef.current = 0;
    beginDraw(activeParticipant);
  };

  const handleAwakenQuad = () => {
    if (!activeParticipant) {
      return;
    }
    startQuadDraw(activeParticipant);
  };

  const handleSkipReveal = () => {
    handleDrawComplete();
  };

  const handleNextParticipant = () => {
    const next = participants.find((p) => !p.cards);
    if (next) {
      autoQuadKeyRef.current = null;
      setActiveParticipantId(next.id);
      setPhase("ready");
    }
  };

  const handleCopyMission = async () => {
    if (!activeParticipant?.cards) {
      return;
    }
    await navigator.clipboard.writeText(buildMissionSentence(activeParticipant.cards));
    setCopiedMission(true);
    window.setTimeout(() => setCopiedMission(false), 1400);
  };

  const addParticipant = useCallback(
    (name: string, level: ExperienceLevel = "mixed") => {
      if (participantsRef.current.length >= 20) {
        return;
      }

      const participant: Participant = { id: randomId("person"), name, level };
      autoQuadKeyRef.current = null;

      setParticipants((current) => {
        const next = [...current, participant];
        participantsRef.current = next;
        return next;
      });
      setActiveParticipantId(participant.id);

      window.setTimeout(() => {
        const latest = participantsRef.current.find((p) => p.id === participant.id) ?? participant;
        if (drawMode === "quad" && !latest.cards && !isAnimatingRef.current) {
          startQuadDraw(latest);
        }
      }, 400);
    },
    [drawMode, startQuadDraw]
  );

  const addBulkParticipants = (names: string[]) => {
    const openSlots = Math.max(0, 20 - participants.length);
    const additions = names.slice(0, openSlots).map<Participant>((name, index) => ({
      id: randomId("person"),
      name,
      level: (index + participants.length) % 4 === 0 ? "vibe" : (index + participants.length) % 3 === 0 ? "first" : "mixed"
    }));
    setParticipants((current) => [...current, ...additions]);
    if (additions[0]) {
      setActiveParticipantId(additions[0].id);
    }
  };

  const loadStarterNames = () => {
    const existing = new Set(participants.map((p) => p.name));
    const openSlots = Math.max(0, 20 - participants.length);
    const additions = starterNames
      .filter((name) => !existing.has(name))
      .slice(0, openSlots)
      .map<Participant>((name, index) => ({
        id: randomId("person"),
        name,
        level: index % 5 === 0 ? "vibe" : index % 4 === 0 ? "first" : "mixed"
      }));
    setParticipants((current) => [...current, ...additions]);
    if (additions[0]) {
      setActiveParticipantId(additions[0].id);
    }
  };

  const removeParticipant = (participantId: string) => {
    setParticipants((current) => current.filter((p) => p.id !== participantId));
    setTeams((current) =>
      current
        .map((team) => ({ ...team, members: team.members.filter((id) => id !== participantId) }))
        .filter((team) => team.members.length > 0)
    );
  };

  const loadDemoParticipant = () => {
    addParticipant("演示用户", "mixed");
  };

  const canDraw = Boolean(activeParticipant && !activeParticipant.cards && !isAnimating && phase !== "complete");
  const canNext = participants.some((p) => !p.cards);

  if (appMode === "host") {
    return (
      <div className="h-full w-full">
        <HostPanel
          participants={participants}
          teams={teams}
          activeParticipantId={activeParticipantId}
          groupSize={groupSize}
          drawnCount={drawnCount}
          onBack={() => setAppMode("gacha")}
          onSetActiveParticipant={setActiveParticipantId}
          onAddParticipant={addParticipant}
          onBulkAdd={addBulkParticipants}
          onLoadStarter={loadStarterNames}
          onRemoveParticipant={removeParticipant}
          onGroupSizeChange={setGroupSize}
          onRematchTeams={() => setTeams(balanceTeams(participants, groupSize))}
          onToggleTeamStatus={(teamId) =>
            setTeams((current) =>
              current.map((team) => (team.id === teamId ? { ...team, status: team.status === "started" ? "draft" : "started" } : team))
            )
          }
          onResetAll={() => {
            setParticipants([]);
            setTeams([]);
            setActiveParticipantId(undefined);
            clearStoredState();
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <GachaLayout
        participants={participants}
        activeParticipant={activeParticipant}
        activeParticipantId={activeParticipantId}
        phase={phase}
        revealCard={revealCard}
        drawMode={drawMode}
        fastMode={fastMode}
        slotRefs={slotRefs}
        canDraw={canDraw}
        canNext={canNext}
        themeMono={themeMono}
        stageFlash={stageFlash}
        onSelectParticipant={(id) => {
          if (!isAnimating) {
            setActiveParticipantId(id);
          }
        }}
        onOpenHost={() => setAppMode("host")}
        onPhaseChange={setPhase}
        onDrawComplete={handleDrawComplete}
        onAwakenOne={handleAwakenOne}
        onAwakenQuad={handleAwakenQuad}
        onSkipReveal={handleSkipReveal}
        onNextParticipant={handleNextParticipant}
        onToggleDrawMode={() => setDrawMode((mode) => (mode === "quad" ? "single" : "quad"))}
        onToggleFastMode={() => setFastMode((value) => !value)}
        onCopyMission={handleCopyMission}
        copiedMission={copiedMission}
        onQuickStart={(name) => addParticipant(name, "mixed")}
        onLoadDemo={loadDemoParticipant}
        onAddParticipant={(name) => addParticipant(name, "mixed")}
        canAddParticipant={participants.length < 20}
        isAnimating={isAnimating}
        onThemeMonoChange={setThemeMono}
        onStageFlashChange={setStageFlash}
      />
    </div>
  );
}
