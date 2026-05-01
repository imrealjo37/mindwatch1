import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Brain, Heart, Zap, Move } from "lucide-react";

interface SignalStat {
  type: "eeg" | "ecg" | "emg" | "mov";
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  status: "normal" | "warning" | "critical";
}

interface SignalStatsProps {
  stats: SignalStat[];
  className?: string;
}

const iconMap = {
  eeg: Brain,
  ecg: Heart,
  emg: Zap,
  mov: Move,
};

const colorMap = {
  eeg: "text-signal-eeg bg-signal-eeg/10 border-signal-eeg/20",
  ecg: "text-signal-ecg bg-signal-ecg/10 border-signal-ecg/20",
  emg: "text-signal-emg bg-signal-emg/10 border-signal-emg/20",
  mov: "text-signal-mov bg-signal-mov/10 border-signal-mov/20",
};

export function SignalStats({ stats, className }: SignalStatsProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3", className)}>
      {stats.map((stat) => {
        const Icon = iconMap[stat.type];
        const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Minus;
        const colors = colorMap[stat.type];
        
        return (
          <div
            key={stat.type}
            className={cn(
              "glass-card p-4 border",
              colors.split(" ").slice(1).join(" ")
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.split(" ").slice(0, 2).join(" "))}>
                <Icon className={cn("w-4 h-4", colors.split(" ")[0])} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs",
                stat.trend === "up" ? "text-warning" : 
                stat.trend === "down" ? "text-success" : "text-muted-foreground"
              )}>
                <TrendIcon className="w-3 h-3" />
                <span>{stat.trendValue}</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
