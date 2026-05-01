import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface TimelineEvent {
  id: string;
  time: string;
  type: "normal" | "elevated" | "alert" | "seizure";
  message: string;
}

interface TimelineStripProps {
  events: TimelineEvent[];
  className?: string;
}

const eventConfig = {
  normal: {
    icon: CheckCircle,
    bgColor: "bg-success/10",
    iconColor: "text-success",
    borderColor: "border-success/30",
  },
  elevated: {
    icon: Clock,
    bgColor: "bg-warning/10",
    iconColor: "text-warning",
    borderColor: "border-warning/30",
  },
  alert: {
    icon: AlertTriangle,
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    borderColor: "border-destructive/30",
  },
  seizure: {
    icon: AlertTriangle,
    bgColor: "bg-destructive/20",
    iconColor: "text-destructive",
    borderColor: "border-destructive/50",
  },
};

export function TimelineStrip({ events, className }: TimelineStripProps) {
  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Recent Activity
        </h3>
        <span className="text-xs text-muted-foreground">Last 30 minutes</span>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;

          return (
            <div
              key={event.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
                config.bgColor,
                config.borderColor,
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                config.bgColor
              )}>
                <Icon className={cn("w-4 h-4", config.iconColor)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{event.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success/50" />
            <p className="text-sm">No recent events</p>
          </div>
        )}
      </div>
    </div>
  );
}
