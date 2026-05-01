import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download, ChevronDown, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePatient } from "@/contexts/PatientContext";

const typeConfig = {
  seizure: {
    label: "Seizure Event",
    icon: AlertTriangle,
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    borderColor: "border-destructive/30",
  },
  prediction: {
    label: "Prediction Alert",
    icon: Clock,
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    borderColor: "border-warning/30",
  },
  elevated: {
    label: "Elevated Risk",
    icon: Clock,
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    borderColor: "border-warning/30",
  },
  normal: {
    label: "Normal Check",
    icon: CheckCircle,
    bgColor: "bg-success/10",
    textColor: "text-success",
    borderColor: "border-success/30",
  },
};

export default function History() {
  const { selectedPatient } = usePatient();
  const [filter, setFilter] = useState<"all" | "seizure" | "prediction" | "elevated">("all");

  const filteredHistory = filter === "all" 
    ? selectedPatient.history 
    : selectedPatient.history.filter(event => event.type === filter);

  const stats = {
    totalEvents: selectedPatient.history.length,
    seizures: selectedPatient.history.filter(e => e.type === "seizure").length,
    predictions: selectedPatient.history.filter(e => e.type === "prediction").length,
    avgRisk: Math.round(
      selectedPatient.history.filter(e => e.riskScore).reduce((acc, e) => acc + (e.riskScore || 0), 0) / 
      (selectedPatient.history.filter(e => e.riskScore).length || 1)
    ),
  };

  return (
    <Layout>
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              History & Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Review past events, predictions, and signal patterns
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Events</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalEvents}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Seizures</p>
          <p className="text-2xl font-bold text-destructive">{stats.seizures}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Predictions</p>
          <p className="text-2xl font-bold text-warning">{stats.predictions}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Risk Score</p>
          <p className="text-2xl font-bold text-primary">{stats.avgRisk}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-2">Filter:</span>
        {(["all", "seizure", "prediction", "elevated"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === f 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {f === "all" ? "All Events" : typeConfig[f].label}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {filteredHistory.map((event) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;

          return (
            <div
              key={event.id}
              className={cn(
                "glass-card p-4 lg:p-5 border",
                config.borderColor
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Icon and type */}
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    config.bgColor
                  )}>
                    <Icon className={cn("w-6 h-6", config.textColor)} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-semibold", config.textColor)}>
                        {config.label}
                      </span>
                      {'duration' in event && event.duration && (
                        <span className="px-2 py-0.5 rounded bg-destructive/20 text-destructive text-xs">
                          Duration: {event.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 lg:pl-4 lg:border-l lg:border-border/50">
                  <p className="text-sm text-foreground">{event.notes}</p>
                  
                  {event.signals.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Signals:</span>
                      {event.signals.map((signal) => (
                        <span
                          key={signal}
                          className="px-2 py-0.5 rounded bg-secondary text-xs font-medium text-secondary-foreground"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk score */}
                {event.riskScore && (
                  <div className="text-center lg:text-right">
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                    <p className={cn(
                      "text-2xl font-bold font-mono",
                      event.riskScore >= 70 ? "text-destructive" :
                      event.riskScore >= 40 ? "text-warning" : "text-success"
                    )}>
                      {event.riskScore}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
