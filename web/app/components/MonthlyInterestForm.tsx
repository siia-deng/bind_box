"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { BadgeCheck, Send } from "lucide-react";
import { juneEvents } from "../lib/monthly-events";

function createInterestCode() {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `JUNE-${code}`;
}

export function MonthlyInterestForm() {
  const [interestCode, setInterestCode] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInterestCode(createInterestCode());
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="paper-border grid gap-5 bg-paper p-5 sm:p-6">
      <div>
        <p className="font-poster text-5xl leading-none">EARLY</p>
        <h2 className="mt-2 text-2xl font-black">提前报名 / 意向锁定</h2>
      </div>
      <label className="grid gap-2 text-lg font-bold">
        感兴趣的场次
        <select required name="event" className="focus-ring rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base">
          <option value="">选择一场或先占位</option>
          {juneEvents.map((event) => (
            <option key={event.date} value={`${event.date} ${event.title}`}>
              {event.date} · {event.title}
            </option>
          ))}
          <option value="all">四场都想了解</option>
        </select>
      </label>
      <label className="grid gap-2 text-lg font-bold">
        姓名 / 昵称
        <input required name="name" className="focus-ring rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base" />
      </label>
      <label className="grid gap-2 text-lg font-bold">
        联系方式
        <input
          required
          name="contact"
          className="focus-ring rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
          placeholder="微信 / 手机 / 邮箱"
        />
      </label>
      <label className="grid gap-2 text-lg font-bold">
        想补充的一句话
        <textarea
          name="note"
          rows={4}
          className="focus-ring resize-none rounded-[6px] border-2 border-ink bg-paper px-4 py-3 text-base"
          placeholder="例如：想先了解 AI 视频，或者四场都想收到通知。"
        />
      </label>
      <button className="focus-ring inline-flex w-fit items-center gap-3 rounded-[6px] bg-ink px-5 py-4 font-bold text-paper">
        <Send className="h-5 w-5" aria-hidden="true" />
        提交提前报名
      </button>
      {interestCode ? (
        <section className="grid gap-2 rounded-[6px] border-2 border-ink bg-mint/20 p-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-6 w-6" aria-hidden="true" />
            <p className="text-xl font-black">已生成意向编号</p>
          </div>
          <p className="font-poster text-4xl leading-none">{interestCode}</p>
          <p className="text-base font-bold leading-tight">请截图保存这个编号，后续可用于确认报名沟通。</p>
        </section>
      ) : null}
    </form>
  );
}
