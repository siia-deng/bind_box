import {
  fallbackBrandPages,
  fallbackProjects,
  fallbackSessions,
  fallbackWorkshop,
  fallbackWorkshops
} from "./fallback-data";
import type { BrandPage, Session, ShowcaseProject, Workshop } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function requestJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getBrandPage(slug: string): Promise<BrandPage> {
  return requestJson(`/api/brand/pages/${slug}`, fallbackBrandPages[slug] ?? fallbackBrandPages.about);
}

export function getWorkshops(): Promise<Workshop[]> {
  return requestJson("/api/workshops", fallbackWorkshops);
}

export function getWorkshop(slug: string): Promise<Workshop> {
  return requestJson(
    `/api/workshops/${slug}`,
    fallbackWorkshops.find((workshop) => workshop.slug === slug) ?? fallbackWorkshop
  );
}

export function getWorkshopSessions(slug: string): Promise<Session[]> {
  return requestJson(
    `/api/workshops/${slug}/sessions`,
    fallbackSessions.filter((session) => session.workshopSlug === slug)
  );
}

export function getAllSessions(): Promise<Session[]> {
  return requestJson("/api/sessions", fallbackSessions);
}

export function getShowcaseProjects(): Promise<ShowcaseProject[]> {
  return requestJson("/api/showcase-projects", fallbackProjects);
}

export const clientApiBase = API_BASE;
