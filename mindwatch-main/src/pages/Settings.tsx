import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Volume2, 
  Mail, 
  Phone, 
  Moon, 
  Sun, 
  Shield, 
  Gauge, 
  Wifi,
  Battery,
  RefreshCw,
  Save,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-12 h-6 rounded-full transition-colors duration-200",
        enabled ? "bg-primary" : "bg-secondary"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200",
          enabled && "translate-x-6"
        )}
      />
    </button>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailAlerts: true,
    smsAlerts: true,
    soundEnabled: true,
    vibration: true,
    darkMode: true,
    autoSync: true,
    highRiskThreshold: 70,
    elevatedRiskThreshold: 40,
  });

  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <Layout>
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure alerts, thresholds, and preferences
            </p>
          </div>
          
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Preferences
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                </div>
              </div>
              <Toggle 
                enabled={settings.pushNotifications} 
                onChange={(v) => updateSetting("pushNotifications", v)} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Alerts</p>
                  <p className="text-sm text-muted-foreground">Send alerts to your email</p>
                </div>
              </div>
              <Toggle 
                enabled={settings.emailAlerts} 
                onChange={(v) => updateSetting("emailAlerts", v)} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Text message notifications</p>
                </div>
              </div>
              <Toggle 
                enabled={settings.smsAlerts} 
                onChange={(v) => updateSetting("smsAlerts", v)} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Sound Alerts</p>
                  <p className="text-sm text-muted-foreground">Audible warning sounds</p>
                </div>
              </div>
              <Toggle 
                enabled={settings.soundEnabled} 
                onChange={(v) => updateSetting("soundEnabled", v)} 
              />
            </div>
          </div>
        </div>

        {/* Risk Thresholds */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-warning" />
            Risk Thresholds
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">High Risk Threshold</label>
                <span className="text-sm font-mono text-destructive">{settings.highRiskThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={settings.highRiskThreshold}
                onChange={(e) => updateSetting("highRiskThreshold", parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-destructive"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Triggers urgent alert when risk score exceeds this value
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Elevated Risk Threshold</label>
                <span className="text-sm font-mono text-warning">{settings.elevatedRiskThreshold}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={settings.elevatedRiskThreshold}
                onChange={(e) => updateSetting("elevatedRiskThreshold", parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-warning"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Shows warning state when risk score exceeds this value
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Current Configuration</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 rounded bg-success/10 text-success">
                  <p className="font-semibold">Normal</p>
                  <p className="text-xs">0-{settings.elevatedRiskThreshold}%</p>
                </div>
                <div className="p-2 rounded bg-warning/10 text-warning">
                  <p className="font-semibold">Elevated</p>
                  <p className="text-xs">{settings.elevatedRiskThreshold}-{settings.highRiskThreshold}%</p>
                </div>
                <div className="p-2 rounded bg-destructive/10 text-destructive">
                  <p className="font-semibold">High</p>
                  <p className="text-xs">{settings.highRiskThreshold}%+</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Moon className="w-5 h-5 text-accent" />
            Appearance
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Optimized for low-light viewing</p>
                </div>
              </div>
              <Toggle 
                enabled={settings.darkMode} 
                onChange={(v) => updateSetting("darkMode", v)} 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className={cn(
                "p-4 rounded-lg border-2 transition-colors flex flex-col items-center gap-2",
                settings.darkMode ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}>
                <Moon className="w-6 h-6" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button className={cn(
                "p-4 rounded-lg border-2 transition-colors flex flex-col items-center gap-2",
                !settings.darkMode ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}>
                <Sun className="w-6 h-6" />
                <span className="text-sm font-medium">Light</span>
              </button>
            </div>
          </div>
        </div>

        {/* Device & Sync */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-success" />
            Device & Sync
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">Auto Sync</p>
                  <p className="text-sm text-muted-foreground">Sync data in real-time</p>
                </div>
              </div>
              <Toggle 
                enabled={settings.autoSync} 
                onChange={(v) => updateSetting("autoSync", v)} 
              />
            </div>

            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">Connection Status</span>
                </div>
                <span className="text-xs text-success font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Device Battery</span>
                </div>
                <span className="text-xs text-primary font-medium">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Sync</span>
                </div>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
