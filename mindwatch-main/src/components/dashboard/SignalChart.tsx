import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Activity } from "lucide-react";
import { useMemo } from "react";

type SignalType = "eeg" | "ecg" | "emg" | "mov";

interface SignalChartProps {
  type: SignalType;
  title: string;
  unit: string;
  value: number;
  status: "normal" | "warning" | "critical";
  className?: string;
}

const signalConfig = {
  eeg: {
    color: "hsl(var(--signal-eeg))",
    bgColor: "bg-signal-eeg/10",
    borderColor: "border-signal-eeg/30",
    label: "Brain Activity",
  },
  ecg: {
    color: "hsl(var(--signal-ecg))",
    bgColor: "bg-signal-ecg/10",
    borderColor: "border-signal-ecg/30",
    label: "Heart Rate",
  },
  emg: {
    color: "hsl(var(--signal-emg))",
    bgColor: "bg-signal-emg/10",
    borderColor: "border-signal-emg/30",
    label: "Muscle Activity",
  },
  mov: {
    color: "hsl(var(--signal-mov))",
    bgColor: "bg-signal-mov/10",
    borderColor: "border-signal-mov/30",
    label: "Motion",
  },
};

// Generate realistic waveform data based on status
function generateWaveformData(type: SignalType, status: "normal" | "warning" | "critical", points: number = 60) {
  const data = [];
  const isSeizure = status === "critical";
  const isElevated = status === "warning";
  
  for (let i = 0; i < points; i++) {
    let value;
    const t = i / points;
    
    // Add chaos factor based on status
    const chaosFactor = isSeizure ? 4 : isElevated ? 2 : 1;
    const noiseAmplitude = isSeizure ? 45 : isElevated ? 25 : 8;
    
    switch (type) {
      case "ecg":
        const phase = (i % (isSeizure ? 6 : 15)) / (isSeizure ? 6 : 15);
        if (isSeizure) {
          // Very chaotic irregular heartbeat during seizure
          value = 50 + Math.sin(phase * Math.PI * 20) * 60 + Math.sin(t * Math.PI * 35) * 30 + (Math.random() - 0.5) * noiseAmplitude * 3;
        } else if (isElevated) {
          // Moderately irregular
          value = 50 + Math.sin(phase * Math.PI * 12) * 50 + (Math.random() - 0.5) * noiseAmplitude * 2;
        } else if (phase < 0.1) {
          value = 50 + Math.sin(phase * Math.PI * 10) * 40 + (Math.random() - 0.5) * noiseAmplitude;
        } else if (phase < 0.15) {
          value = 50 + 80 + (Math.random() - 0.5) * noiseAmplitude;
        } else if (phase < 0.2) {
          value = 50 - 20 + (Math.random() - 0.5) * noiseAmplitude;
        } else {
          value = 50 + Math.random() * 8;
        }
        break;
      case "eeg":
        if (isSeizure) {
          // Very high frequency spikes and chaotic waves during seizure
          value = 50 + Math.sin(t * Math.PI * 40) * 40 + Math.sin(t * Math.PI * 65) * 35 + Math.sin(t * Math.PI * 90) * 20 + (Math.random() - 0.5) * noiseAmplitude * 3;
        } else if (isElevated) {
          // Increased activity and irregularity
          value = 50 + Math.sin(t * Math.PI * 15) * 30 + Math.sin(t * Math.PI * 35) * 25 + (Math.random() - 0.5) * noiseAmplitude * 2;
        } else {
          value = 50 + Math.sin(t * Math.PI * 8) * 20 + Math.sin(t * Math.PI * 23) * 15 + (Math.random() - 0.5) * noiseAmplitude;
        }
        break;
      case "emg":
        if (isSeizure) {
          // Continuous high muscle activity during seizure
          value = 50 + Math.random() * 45 + Math.sin(t * Math.PI * 20) * 30;
        } else {
          const burst = Math.random() > (isElevated ? 0.5 : 0.7);
          value = burst ? 50 + Math.random() * 40 * chaosFactor : 50 + Math.random() * 10;
        }
        break;
      case "mov":
        if (isSeizure) {
          // Violent shaking motion during seizure
          value = 50 + Math.sin(t * Math.PI * 25) * 40 + (Math.random() - 0.5) * noiseAmplitude * 3;
        } else {
          value = 50 + Math.sin(t * Math.PI * 4) * 15 * chaosFactor + Math.random() * noiseAmplitude;
        }
        break;
      default:
        value = 50 + Math.random() * 20 * chaosFactor;
    }
    
    data.push({
      time: i,
      value: Math.max(0, Math.min(100, value)),
    });
  }
  return data;
}

export function SignalChart({ type, title, unit, value, status, className }: SignalChartProps) {
  const config = signalConfig[type];
  const data = useMemo(() => generateWaveformData(type, status), [type, status]);

  const statusColors = {
    normal: "text-success",
    warning: "text-warning",
    critical: "text-destructive",
  };

  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full animate-signal-pulse", 
            type === "eeg" ? "bg-signal-eeg" : 
            type === "ecg" ? "bg-signal-ecg" : 
            type === "emg" ? "bg-signal-emg" : "bg-signal-mov"
          )} />
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className={cn("px-2 py-0.5 rounded text-xs font-medium", config.bgColor)}>
          <span style={{ color: config.color }}>{config.label}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-24 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  const displayVal = typeof val === 'number' ? val.toFixed(1) : val;
                  return (
                    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-sm font-mono" style={{ color: config.color }}>
                        {displayVal} {unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              fill={`url(#gradient-${type})`}
              style={{
                filter: `drop-shadow(0 0 4px ${config.color})`,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Value display */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Current</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold font-mono" style={{ color: config.color }}>
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  );
}
