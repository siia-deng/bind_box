import { CommunityIntro } from "./components/CommunityIntro";
import { PosterHero } from "./components/PosterHero";
import { SiteFrame } from "./components/SiteFrame";
import { UpcomingEvent } from "./components/UpcomingEvent";

export default function HomePage() {
  return (
    <SiteFrame>
      <PosterHero />
      <CommunityIntro />
      <UpcomingEvent />
    </SiteFrame>
  );
}
