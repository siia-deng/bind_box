import { ShowcaseExplorer } from "../../components/ShowcaseExplorer";
import { SiteFrame } from "../../components/SiteFrame";
import { SectionHeader } from "../../components/SectionHeader";
import { getAllSessions, getShowcaseProjects } from "../../lib/api";

export default async function ShowcasePage() {
  const [projects, sessions] = await Promise.all([getShowcaseProjects(), getAllSessions()]);

  return (
    <SiteFrame>
      <SectionHeader
        eyebrow="Showcase"
        title="DEMOS"
        copy="按时间和场次回看每期作品。"
      />
      <ShowcaseExplorer projects={projects} sessions={sessions} />
    </SiteFrame>
  );
}
