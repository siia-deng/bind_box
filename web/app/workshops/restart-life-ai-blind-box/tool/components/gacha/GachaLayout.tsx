import type { DrawMode, CardKind, GachaPhase, Participant } from "../../types";
import { RetroMenuBar } from "../retro/RetroMenuBar";
import { RetroShell } from "../retro/RetroShell";
import { RetroWindow } from "../retro/RetroWindow";
import { GachaActions } from "./GachaActions";
import { GachaHandBar, GachaSidebar } from "./GachaHandBar";
import { GachaInfoPanel } from "./GachaInfoPanel";
import { GachaStage } from "./GachaStage";
import type { Card } from "../../types";
import { getCurrentStep, getPartialCards } from "../../lib/draw";

type GachaLayoutProps = {
  participants: Participant[];
  activeParticipant?: Participant;
  activeParticipantId?: string;
  phase: GachaPhase;
  revealCard: Card | null;
  drawMode: DrawMode;
  fastMode: boolean;
  slotRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  canDraw: boolean;
  canNext: boolean;
  themeMono: boolean;
  stageFlash: boolean;
  onSelectParticipant: (id: string) => void;
  onOpenHost: () => void;
  onPhaseChange: (phase: GachaPhase) => void;
  onDrawComplete: () => void;
  onAwakenOne: () => void;
  onAwakenQuad: () => void;
  onSkipReveal: () => void;
  onNextParticipant: () => void;
  onToggleDrawMode: () => void;
  onToggleFastMode: () => void;
  onCopyMission: () => void;
  copiedMission: boolean;
  onQuickStart: (name: string) => void;
  onLoadDemo: () => void;
  onAddParticipant: (name: string) => void;
  canAddParticipant: boolean;
  isAnimating: boolean;
  onThemeMonoChange: (active: boolean) => void;
  onStageFlashChange: (active: boolean) => void;
};

export function GachaLayout({
  participants,
  activeParticipant,
  activeParticipantId,
  phase,
  revealCard,
  drawMode,
  fastMode,
  slotRefs,
  canDraw,
  canNext,
  themeMono,
  stageFlash,
  onSelectParticipant,
  onOpenHost,
  onPhaseChange,
  onDrawComplete,
  onAwakenOne,
  onAwakenQuad,
  onSkipReveal,
  onNextParticipant,
  onToggleDrawMode,
  onToggleFastMode,
  onCopyMission,
  copiedMission,
  onQuickStart,
  onLoadDemo,
  onAddParticipant,
  canAddParticipant,
  isAnimating,
  onThemeMonoChange,
  onStageFlashChange
}: GachaLayoutProps) {
  const currentStep = getCurrentStep(activeParticipant);
  const partial = getPartialCards(activeParticipant) as Partial<Record<CardKind, Card>>;
  const isStageDrawing = phase === "charge" || phase === "flip" || phase === "reveal" || phase === "slot";
  const showDock = Boolean(activeParticipant);

  return (
    <RetroShell themeMono={themeMono} className="gacha-root">
      <RetroMenuBar
        brand="Blind Vibe"
        subtitle="开出你的 AI 第二身份 · 现场唤醒台"
        items={[
          ...(phase === "complete"
            ? [{ label: copiedMission ? "已复制 Mission" : "复制 Mission", onClick: onCopyMission }]
            : []),
          { label: "演示", onClick: onLoadDemo },
          { label: "主持台 (H)", onClick: onOpenHost },
          { label: "活动页", href: "/workshops/restart-life-ai-blind-box" }
        ]}
      />

      <div className="gacha-workspace">
        <RetroWindow title="INVENT" className="gacha-pane gacha-pane-invent">
          <GachaSidebar
            participants={participants}
            activeParticipantId={activeParticipantId}
            currentStep={currentStep}
            partial={partial}
            onSelectParticipant={onSelectParticipant}
            onAddParticipant={onAddParticipant}
            canAddParticipant={canAddParticipant}
            isAnimating={isAnimating}
          />
        </RetroWindow>

        <RetroWindow
          title="STAGE"
          className={`gacha-pane gacha-pane-stage retro-window-stage flex flex-col ${isStageDrawing ? "retro-window-stage-drawing" : ""}`}
          flash={stageFlash}
          bodyClassName="flex min-h-0 flex-1 flex-col"
        >
          <div className="gacha-stage-main">
            <GachaStage
              participant={activeParticipant}
              phase={phase}
              revealCard={revealCard}
              fastMode={fastMode}
              onPhaseChange={onPhaseChange}
              onDrawComplete={onDrawComplete}
              slotRefs={slotRefs}
              onLoadDemo={onLoadDemo}
              onOpenHost={onOpenHost}
              onThemeMonoChange={onThemeMonoChange}
              onStageFlashChange={onStageFlashChange}
            />
            {showDock ? (
              <div className="gacha-dock">
                <GachaHandBar partial={partial} currentStep={currentStep} slotRefs={slotRefs} />
                <GachaActions
                  phase={phase}
                  drawMode={drawMode}
                  fastMode={fastMode}
                  canDraw={canDraw}
                  canNext={canNext}
                  onAwakenOne={onAwakenOne}
                  onAwakenQuad={onAwakenQuad}
                  onSkipReveal={onSkipReveal}
                  onNextParticipant={onNextParticipant}
                  onToggleDrawMode={onToggleDrawMode}
                  onToggleFastMode={onToggleFastMode}
                />
              </div>
            ) : null}
          </div>
        </RetroWindow>

        <RetroWindow title="STATUS" className="gacha-pane gacha-pane-status">
          <GachaInfoPanel participant={activeParticipant} currentStep={currentStep} phaseComplete={phase === "complete"} />
        </RetroWindow>
      </div>
    </RetroShell>
  );
}
