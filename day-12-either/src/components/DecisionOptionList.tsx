import { X } from "lucide-react";
import type { DecisionOption } from "../types";

export function DecisionOptionList({ options, onRemove }: { options: DecisionOption[]; onRemove?: (id: string) => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e7e7e7] bg-white dark:border-[#292929] dark:bg-[#121212]">
      {options.length === 0 && <div className="px-4 py-8 text-center text-[12px] text-[#8a8a8a]">Your options will appear here.</div>}
      {options.map((option, index) => (
        <div key={option.id} className={`flex min-h-11 items-center justify-between px-4 text-[13px] text-[#111] dark:text-[#f5f5f5] ${index ? "border-t border-[#ededed] dark:border-[#242424]" : ""}`}>
          <span>{option.label}</span>
          {onRemove && <button type="button" aria-label={`Remove ${option.label}`} onClick={() => onRemove(option.id)} className="text-[#b0b0b0] hover:text-[#111] dark:hover:text-white"><X size={14} /></button>}
        </div>
      ))}
      <div className="flex h-10 items-center justify-between border-t border-[#ededed] bg-[#fafafa] px-4 text-[9px] font-medium uppercase tracking-[0.08em] text-[#8a8a8a] dark:border-[#242424] dark:bg-[#151515]">
        <span>{options.length} {options.length === 1 ? "option" : "options"}</span><span>Minimum 3 required</span>
      </div>
    </div>
  );
}
