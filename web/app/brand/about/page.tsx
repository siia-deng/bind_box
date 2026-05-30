import { CrossedBadge } from "../../components/CrossedBadge";
import { SiteFrame } from "../../components/SiteFrame";
import { SectionHeader } from "../../components/SectionHeader";
import { getBrandPage } from "../../lib/api";

export default async function BrandAboutPage() {
  const page = await getBrandPage("about");

  return (
    <SiteFrame>
      <SectionHeader eyebrow={page.eyebrow} title="HURDLE CLUB" copy={page.body} />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-5">
          {page.sections.map((section) => (
            <article key={section.heading} className="border-t-2 border-ink py-6">
              <h2 className="mb-3 font-poster text-5xl leading-none">{section.heading}</h2>
              <p className="max-w-3xl text-2xl font-bold leading-tight">{section.copy}</p>
            </article>
          ))}
        </div>
        <CrossedBadge />
      </div>
    </SiteFrame>
  );
}
