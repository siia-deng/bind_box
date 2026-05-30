import { WorkshopDetail } from "../../components/WorkshopDetail";
import { getWorkshop, getWorkshopSessions } from "../../lib/api";

export default async function VibeCodingWorkshopPage() {
  const [workshop, sessions] = await Promise.all([
    getWorkshop("vibe-coding-html-ppt"),
    getWorkshopSessions("vibe-coding-html-ppt")
  ]);

  return <WorkshopDetail workshop={workshop} sessions={sessions} />;
}
