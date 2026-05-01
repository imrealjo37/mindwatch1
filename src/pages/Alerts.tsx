import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Check, Clock, AlertTriangle, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePatient } from "@/contexts/PatientContext";

const alertConfig = {
  high: {
    label: "High Priority",
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    borderColor: "border-destructive/30",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium Priority",
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    borderColor: "border-warning/30",
    icon: Clock,
  },
  low: {
    label: "Low Priority",
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
    borderColor: "border-border",
    icon: Bell,
  },
};

export default function Alerts() {
  const { selectedPatient } = usePatient();
  const [alerts, setAlerts] = useState(selectedPatient.alerts);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Update alerts when patient changes
  useEffect(() => {
    setAlerts(selectedPatient.alerts);
  }, [selectedPatient.id, selectedPatient.alerts]);

  const unreadCount = alerts.filter(a => !a.read).length;
  const filteredAlerts = filter === "all" ? alerts : alerts.filter(a => !a.read);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  return (
    <Layout>
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Alerts & Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}`
                : "All caught up! No unread alerts"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Volume2 className="w-4 h-4 mr-2" />
              Sound Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 border border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">
                {alerts.filter(a => a.type === "high").length}
              </p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 border border-warning/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">
                {alerts.filter(a => a.type === "medium").length}
              </p>
              <p className="text-xs text-muted-foreground">Medium Priority</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {alerts.filter(a => a.type === "low").length}
              </p>
              <p className="text-xs text-muted-foreground">Low Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            filter === "all" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          All Alerts
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
            filter === "unread" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          Unread
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BellOff className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No alerts</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "unread" ? "All alerts have been read" : "No alerts to display"}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={cn(
                  "glass-card p-4 border transition-all duration-200",
                  config.borderColor,
                  !alert.read && "ring-1 ring-primary/20"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    config.bgColor
                  )}>
                    <Icon className={cn("w-5 h-5", config.textColor)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded", config.bgColor, config.textColor)}>
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    
                    <p className="text-sm text-foreground mb-2">{alert.message}</p>
                    
                    {alert.actionTaken && (
                      <div className="flex items-center gap-2 text-xs text-success">
                        <Check className="w-3 h-3" />
                        <span>{alert.actionTaken}</span>
                      </div>
                    )}
                  </div>

                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                      className="flex-shrink-0"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
