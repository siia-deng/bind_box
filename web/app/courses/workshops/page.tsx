import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFrame } from "../../components/SiteFrame";
import { SectionHeader } from "../../components/SectionHeader";
import { getWorkshops } from "../../lib/api";

export default async function CoursesPage() {
  const workshops = await getWorkshops();

  return (
    <SiteFrame>
      <SectionHeader
        eyebrow="Courses"
        title="WORKSHOPS"
        copy="从一个适合初学者的线下体验开始，逐步扩展为可以持续学习和展示的课程体系。"
      />
      <div className="grid gap-5">
        {workshops.map((workshop) => (
          <Link
            key={workshop.slug}
            href={`/workshops/${workshop.slug}`}
            className="focus-ring paper-border grid gap-5 bg-paper p-6 sm:grid-cols-[1fr_auto]"
          >
            <div>
              <h2 className="font-poster text-5xl leading-none">{workshop.title}</h2>
              <p className="mt-4 max-w-3xl text-2xl font-bold leading-tight">{workshop.subtitle}</p>
            </div>
            <ArrowUpRight className="h-10 w-10 stroke-[3]" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </SiteFrame>
  );
}
