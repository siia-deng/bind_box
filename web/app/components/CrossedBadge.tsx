import { Check } from "lucide-react";
import { HurdleMark } from "./HurdleMark";

export function CrossedBadge() {
  return (
    <div className="relative overflow-hidden paper-border bg-paper px-6 py-8 sm:px-8">
      <div className="absolute left-0 top-0 h-3 w-full bg-[linear-gradient(90deg,#e9745f,#eacb62,#68bfa8,#6fa4ca)]" />
      <div className="relative flex flex-col gap-8">
        <HurdleMark color />
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-[6px] border-[5px] border-ink">
            <Check className="h-11 w-11 stroke-[4]" />
          </span>
          <span className="font-poster text-6xl leading-none sm:text-7xl">已跨越</span>
        </div>
      </div>
    </div>
  );
}
