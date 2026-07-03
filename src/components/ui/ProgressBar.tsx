import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: "default" | "danger" | "warning";
  className?: string;
}

const variantStyles = {
  default: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  variant = "default",
  className,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-slate-600">{label}</span>}
          {showValue && <span className="font-medium text-slate-900">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-all duration-500", variantStyles[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
