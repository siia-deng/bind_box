import { CrossedBadge } from "../../components/CrossedBadge";
import { SiteFrame } from "../../components/SiteFrame";
import { SectionHeader } from "../../components/SectionHeader";
import { getBrandPage } from "../../lib/api";

export default async function RecognitionPage() {
  const page = await getBrandPage("recognition");

  return (
    <SiteFrame>
      <SectionHeader eyebrow={page.eyebrow} title="ALREADY CROSSED" copy={page.body} />
      <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)]">
        <CrossedBadge />
        <div className="grid content-start gap-5">
          {page.sections.map((section) => (
            <article key={section.heading} className="paper-border bg-paper p-6">
              <h2 className="mb-3 font-poster text-5xl leading-none">{section.heading}</h2>
              <p className="text-2xl font-bold leading-tight">{section.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}
