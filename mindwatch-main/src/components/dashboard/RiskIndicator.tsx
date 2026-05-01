import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

type RiskLevel = "normal" | "elevated" | "high";

interface RiskIndicatorProps {
  level: RiskLevel;
  score: number;
  className?: string;
}

const riskConfig = {
  normal: {
    label: "Normal",
    icon: CheckCircle,
    bgColor: "bg-risk-normal/10",
    borderColor: "border-risk-normal/30",
    textColor: "text-risk-normal",
    glowColor: "shadow-[0_0_30px_hsl(var(--risk-normal)/0.3)]",
    gradientFrom: "from-risk-normal/20",
    gradientTo: "to-risk-normal/5",
  },
  elevated: {
    label: "Elevated",
    icon: AlertCircle,
    bgColor: "bg-risk-elevated/10",
    borderColor: "border-risk-elevated/30",
    textColor: "text-risk-elevated",
    glowColor: "shadow-[0_0_30px_hsl(var(--risk-elevated)/0.3)]",
    gradientFrom: "from-risk-elevated/20",
    gradientTo: "to-risk-elevated/5",
  },
  high: {
    label: "High Risk",
    icon: AlertTriangle,
    bgColor: "bg-risk-high/10",
    borderColor: "border-risk-high/30",
    textColor: "text-risk-high",
    glowColor: "shadow-[0_0_40px_hsl(var(--risk-high)/0.4)]",
    gradientFrom: "from-risk-high/20",
    gradientTo: "to-risk-high/5",
  },
};

export function RiskIndicator({ level, score, className }: RiskIndicatorProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  // Calculate arc path for the gauge
  const radius = 70;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Risk Level
        </h3>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-semibold",
          config.bgColor,
          config.textColor
        )}>
          {config.label}
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Gauge */}
        <div className="relative w-44 h-24 mb-4">
          <svg
            className="w-full h-full"
            viewBox="0 0 160 85"
          >
            {/* Background arc */}
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke={`hsl(var(--risk-${level}))`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px hsl(var(--risk-${level}) / 0.5))`,
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
            <span className={cn("text-4xl font-bold font-mono", config.textColor)}>
              {score}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        {/* Status with icon */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          config.bgColor,
          level === "high" && "animate-pulse"
        )}>
          <Icon className={cn("w-5 h-5", config.textColor)} />
          <span className={cn("font-semibold", config.textColor)}>
            {level === "normal" && "All signals stable"}
            {level === "elevated" && "Monitoring closely"}
            {level === "high" && "Alert: Take precautions"}
          </span>
        </div>
      </div>
    </div>
  );
}
