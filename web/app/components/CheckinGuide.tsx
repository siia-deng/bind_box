import { BadgeCheck, ListChecks, ShieldCheck } from "lucide-react";

export function CheckinGuide() {
  return (
    <section className="paper-border grid gap-4 bg-paper p-5">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        <h2 className="text-2xl font-black">现场核验方式</h2>
      </div>
      <div className="grid gap-3 text-lg font-bold leading-tight">
        <p className="flex gap-3">
          <BadgeCheck className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>参与者出示报名后生成的核验码和付款成功截图。</span>
        </p>
        <p className="flex gap-3">
          <ListChecks className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>工作人员核对姓名、联系方式、付款昵称/后四位，和收款记录一致后标记签到。</span>
        </p>
        <p className="rounded-[6px] border-2 border-ink px-4 py-3">
          建议现场准备一张签到表：核验码、姓名、联系方式、付款昵称/后四位、签到状态。后台也可按核验码查询并标记已签到。
        </p>
      </div>
    </section>
  );
}
