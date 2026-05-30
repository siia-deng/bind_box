import { SiteFrame } from "../../components/SiteFrame";
import { SectionHeader } from "../../components/SectionHeader";

export default function RebuildPage() {
  return (
    <SiteFrame>
      <SectionHeader
        eyebrow="Experience / Rebuild"
        title="REBUILD"
        copy="从“我不会技术”重新出发，把问题拆成 AI 可以协作的步骤。"
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {["写下真实任务", "翻译成可执行指令", "确认第一个可见结果"].map((item, index) => (
          <article key={item} className="paper-border bg-paper p-6">
            <p className="font-poster text-6xl leading-none">0{index + 1}</p>
            <h2 className="mt-8 text-3xl font-black leading-tight">{item}</h2>
          </article>
        ))}
      </div>
    </SiteFrame>
  );
}
