import { LinkButton } from "../../components/LinkButton";
import { SiteFrame } from "../../components/SiteFrame";
import { SectionHeader } from "../../components/SectionHeader";

export default function CreatePage() {
  return (
    <SiteFrame>
      <SectionHeader
        eyebrow="Experience / Create"
        title="CREATE"
        copy="课程结束不是听懂了多少，而是你手上多了一个可以继续迭代的 Demo。"
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="border-y-2 border-ink py-8 text-3xl font-black leading-tight">
          <p>把想法变成页面。</p>
          <p>把页面接上数据。</p>
          <p>把 Demo 讲给别人听。</p>
        </div>
        <div className="space-y-5 text-xl font-bold leading-tight">
          <p>
            Hurdle Club 的创造环节会让每个人完成一个很小但真实的作品。它可以是一个表单、一个内容工具、一个资料整理器，或者一个只服务你自己的微型助手。
          </p>
          <LinkButton href="/showcase/demos">查看学员 Demo</LinkButton>
        </div>
      </div>
    </SiteFrame>
  );
}
