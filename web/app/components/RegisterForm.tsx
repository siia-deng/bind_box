"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, QrCode, Send, ShieldCheck } from "lucide-react";
import { clientApiBase } from "../lib/api";
import type { Session, Workshop } from "../lib/types";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type FormState = "idle" | "submitting" | "success" | "error";
type RegistrationResult = {
  verificationCode?: string;
  checkinHint?: string;
};

function createLocalVerificationCode(workshopSlug: string) {
  const prefix = workshopSlug
    .split("-")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `HC-${prefix}-${code}`;
}

export function RegisterForm({ workshop, sessions }: { workshop: Workshop; sessions: Session[] }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    setRegistrationResult(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      workshopSlug: workshop.slug,
      sessionId: data.get("sessionId"),
      name: data.get("name"),
      contact: data.get("contact"),
      background: data.get("background"),
      idea: data.get("idea"),
      paymentMethod: data.get("paymentMethod"),
      payerName: data.get("payerName"),
      paymentTail: data.get("paymentTail")
    };

    try {
      const response = await fetch(`${clientApiBase}/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message ?? "报名提交失败");
      }

      form.reset();
      setState("success");
      setRegistrationResult({
        verificationCode: result.verificationCode,
        checkinHint: result.checkinHint
      });
      setMessage("报名已收到。请截图保存本页核验码，现场凭核验码和付款信息入场。");
    } catch {
      setState("success");
      setRegistrationResult({
        verificationCode: createLocalVerificationCode(workshop.slug),
        checkinHint: "线上登记服务暂不可用时，以付款记录为准。请截图保存此核验码和付款成功页，现场报姓名、联系方式、付款昵称/后四位完成核验。"
      });
      setMessage("已生成现场核验码。请截图保存本页和付款成功页；工作人员会按付款记录核验入场。");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="paper-border grid w-full min-w-0 max-w-full gap-6 bg-paper p-5 sm:p-8">
      <section className="grid gap-4 border-b-2 border-ink pb-6">
        <div className="flex items-center gap-3">
          <QrCode className="h-7 w-7" aria-hidden="true" />
          <div>
            <p className="text-xl font-black">1. 先扫码付款锁定席位</p>
            <p className="text-sm font-bold text-muted">付款后继续填写下方信息，用于现场核验。</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-[240px_1fr] md:items-center">
          <div className="paper-border bg-paper p-3">
            <Image
              src={`${publicBasePath}/payment-qr-placeholder.svg`}
              alt="活动收款码"
              width={720}
              height={720}
              className="h-auto w-full"
              priority
            />
          </div>
          <div className="grid gap-3 text-lg font-bold leading-tight">
            <p>请用微信或支付宝扫码付款。真实收款码上线前，这里是占位图，可替换为正式收款码。</p>
            <p>付款完成后，请保留付款成功页截图；现场会用“核验码 + 付款昵称/后四位 + 报名名单”完成入场核验。</p>
            <p className="rounded-[6px] border-2 border-ink px-4 py-3">现场验证：出示核验码，工作人员核对付款信息后标记入场。</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          <div>
            <p className="text-xl font-black">2. 填写报名与付款信息</p>
            <p className="text-sm font-bold text-muted">信息越接近付款记录，现场核验越快。</p>
          </div>
        </div>
      <label className="grid gap-2 text-lg font-bold">
        场次
        <select
          required
          name="sessionId"
          className="focus-ring w-full min-w-0 rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
          defaultValue={sessions[0]?._id ?? ""}
        >
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.date} {session.startTime}
              {session.endTime ? `-${session.endTime}` : ""} · 剩余{" "}
              {Math.max(session.capacity - session.seatsTaken, 0)} 席
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-5 sm:grid-cols-[160px_1fr_160px]">
        <label className="grid gap-2 text-lg font-bold">
          付款方式
          <select
            required
            name="paymentMethod"
            className="focus-ring w-full min-w-0 rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
            defaultValue="wechat"
          >
            <option value="wechat">微信</option>
            <option value="alipay">支付宝</option>
            <option value="other">其他</option>
          </select>
        </label>
        <label className="grid gap-2 text-lg font-bold">
          付款昵称 / 备注名
          <input
            required
            name="payerName"
            className="focus-ring w-full min-w-0 rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
            placeholder="用于匹配付款记录"
          />
        </label>
        <label className="grid gap-2 text-lg font-bold">
          付款后四位
          <input
            required
            name="paymentTail"
            minLength={2}
            maxLength={12}
            className="focus-ring w-full min-w-0 rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
            placeholder="金额/单号后四位"
          />
        </label>
      </div>
      <label className="grid gap-2 text-lg font-bold">
        姓名
        <input
          required
          name="name"
          minLength={2}
          className="focus-ring w-full min-w-0 rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
          placeholder="你的名字"
        />
      </label>
      <label className="grid gap-2 text-lg font-bold">
        联系方式
        <input
          required
          name="contact"
          className="focus-ring w-full min-w-0 rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
          placeholder="微信 / 手机 / 邮箱"
        />
      </label>
      <label className="grid gap-2 text-lg font-bold">
        你的背景
        <input
          required
          name="background"
          className="focus-ring w-full min-w-0 rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
          placeholder="例如：品牌主理人、内容创作者、运营"
        />
      </label>
      <label className="grid gap-2 text-lg font-bold">
        想带来的一个想法
        <textarea
          required
          name="idea"
          rows={5}
          className="focus-ring w-full min-w-0 resize-none rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
          placeholder="不用写得完整，写下你想用 AI 解决的一件小事。"
        />
      </label>
      <button
        disabled={state === "submitting" || sessions.length === 0}
        className="focus-ring inline-flex w-fit items-center gap-3 rounded-[6px] bg-ink px-5 py-4 font-bold text-paper disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-5 w-5" aria-hidden="true" />
        {state === "submitting" ? "提交中" : "已付款，提交报名"}
      </button>
      </section>
      {message ? (
        <p className={`text-lg font-bold ${state === "success" ? "text-mint" : "text-coral"}`}>
          {message}
        </p>
      ) : null}
      {registrationResult?.verificationCode ? (
        <section className="paper-border grid gap-3 bg-mint/20 p-5">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-7 w-7" aria-hidden="true" />
            <p className="text-xl font-black">3. 现场核验码</p>
          </div>
          <p className="font-poster text-5xl leading-none">{registrationResult.verificationCode}</p>
          <p className="text-lg font-bold leading-tight">
            {registrationResult.checkinHint ?? "现场出示此核验码，并报付款昵称/后四位。"}
          </p>
        </section>
      ) : null}
    </form>
  );
}
