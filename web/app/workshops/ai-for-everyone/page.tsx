import { WorkshopDetail } from "../../components/WorkshopDetail";
import { getWorkshop, getWorkshopSessions } from "../../lib/api";

export default async function WorkshopDetailPage() {
  const [workshop, sessions] = await Promise.all([
    getWorkshop("ai-for-everyone"),
    getWorkshopSessions("ai-for-everyone")
  ]);

  return <WorkshopDetail workshop={workshop} sessions={sessions} />;
}
