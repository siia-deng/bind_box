"use client";

import { CalendarDays, ListFilter, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import type { Session, ShowcaseProject } from "../lib/types";

type ShowcaseExplorerProps = {
  projects: ShowcaseProject[];
  sessions: Session[];
};

function getMonthLabel(value: string) {
  const [year, month] = value.split("-");
  return `${year}.${month}`;
}

export function ShowcaseExplorer({ projects, sessions }: ShowcaseExplorerProps) {
  const [month, setMonth] = useState("all");
  const [sessionId, setSessionId] = useState("all");

  const monthOptions = useMemo(() => {
    return Array.from(new Set(projects.map((project) => project.eventDate.slice(0, 7)))).sort().reverse();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesMonth = month === "all" || project.eventDate.startsWith(month);
      const matchesSession = sessionId === "all" || project.sessionId === sessionId;
      return matchesMonth && matchesSession;
    });
  }, [month, projects, sessionId]);

  const activeSessions = useMemo(() => {
    const projectSessionIds = new Set(projects.map((project) => project.sessionId));
    return sessions.filter((session) => projectSessionIds.has(session._id));
  }, [projects, sessions]);

  return (
    <section className="grid gap-6">
      <div className="paper-border grid gap-4 bg-paper p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5">
        <label className="grid gap-2 text-base font-bold">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            时间
          </span>
          <select
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="focus-ring w-full rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base font-bold"
          >
            <option value="all">全部时间</option>
            {monthOptions.map((option) => (
              <option key={option} value={option}>
                {getMonthLabel(option)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-base font-bold">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-5 w-5" aria-hidden="true" />
            活动场次
          </span>
          <select
            value={sessionId}
            onChange={(event) => setSessionId(event.target.value)}
            className="focus-ring w-full rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base font-bold"
          >
            <option value="all">全部场次</option>
            {activeSessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.date} {session.startTime} · {session.city}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setMonth("all");
            setSessionId("all");
          }}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-[6px] bg-ink px-5 py-3 font-bold text-paper"
        >
          <ListFilter className="h-5 w-5" aria-hidden="true" />
          重置
        </button>
      </div>

      <div className="flex flex-col gap-4 border-b-2 border-ink pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-poster text-5xl leading-none">{filteredProjects.length}</p>
          <p className="text-lg font-bold">件作品</p>
        </div>
        <p className="text-anywhere w-full max-w-xl text-left text-base font-bold leading-tight sm:text-right sm:text-lg">
          每张卡片都对应一次活动场次，方便按期回看作品。
        </p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project._id}
              className="paper-border flex min-h-[320px] min-w-0 flex-col justify-between bg-paper p-6"
            >
              <div>
                <div className="flex flex-wrap gap-2 text-sm font-bold">
                  <span className="rounded-[6px] border-2 border-ink px-3 py-2">{project.eventDate}</span>
                  <span className="text-anywhere rounded-[6px] border-2 border-ink px-3 py-2">{project.sessionLabel}</span>
                </div>
                <p className="mt-6 text-lg font-bold">{project.maker}</p>
                <h2 className="text-anywhere mt-3 font-poster text-4xl leading-none sm:text-5xl">{project.title}</h2>
                <p className="text-anywhere mt-4 text-lg font-bold leading-tight sm:text-xl">{project.summary}</p>
              </div>
              <div className="mt-8">
                <p className="mb-3 text-sm font-bold uppercase">{project.workshopTitle}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-[6px] bg-ink px-3 py-2 text-sm font-bold text-paper">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="paper-border bg-paper p-8 text-2xl font-black leading-tight">
          当前筛选条件下还没有作品。换一个时间或场次看看。
        </div>
      )}
    </section>
  );
}
