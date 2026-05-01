import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, X, Phone, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface AlertBannerProps {
  isActive: boolean;
  minutesRemaining: number;
  riskScore: number;
  contributingSignals: string[];
  onDismiss?: () => void;
  onContact?: () => void;
}

export function AlertBanner({
  isActive,
  minutesRemaining,
  riskScore,
  contributingSignals,
  onDismiss,
  onContact,
}: AlertBannerProps) {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    if (isActive) {
      const updateTime = () => {
        const mins = Math.floor(minutesRemaining);
        const secs = Math.floor((minutesRemaining % 1) * 60);
        setTimeString(`${mins}:${secs.toString().padStart(2, "0")}`);
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, minutesRemaining]);

  if (!isActive) return null;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border-2 border-destructive/50 mb-6",
      "bg-gradient-to-r from-destructive/20 via-destructive/10 to-warning/10",
      "animate-pulse-glow"
    )}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_hsl(var(--destructive)/0.2),transparent_70%)]" />
      
      <div className="relative p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Alert icon and main message */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-destructive mb-1">
                ⚠️ High Risk Detected — Possible Seizure Approaching
              </h3>
              <p className="text-sm text-foreground/80 mb-3">
                Based on current signal patterns, a seizure event may occur. Please take precautionary measures.
              </p>
              
              {/* Contributing signals */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Contributing signals:</span>
                {contributingSignals.map((signal) => (
                  <span
                    key={signal}
                    className="px-2 py-0.5 rounded bg-destructive/20 text-destructive text-xs font-medium"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Countdown and actions */}
          <div className="flex flex-col items-center lg:items-end gap-3">
            {/* Countdown timer */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/50 border border-border/50">
              <Clock className="w-5 h-5 text-warning" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Estimated Time</p>
                <p className="text-2xl font-bold font-mono text-warning">{timeString}</p>
              </div>
              <div className="text-center border-l border-border/50 pl-3">
                <p className="text-xs text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold font-mono text-destructive">{riskScore}%</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={onContact}>
                <Phone className="w-4 h-4 mr-1" />
                Contact Caregiver
              </Button>
              <Button variant="outline" size="sm" onClick={onDismiss}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
