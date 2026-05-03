import { Layout } from "@/components/layout/Layout";
import { RiskIndicator } from "@/components/dashboard/RiskIndicator";
import { SignalChart } from "@/components/dashboard/SignalChart";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { TimelineStrip } from "@/components/dashboard/TimelineStrip";
import { SignalStats } from "@/components/dashboard/SignalStats";
import { useState, useEffect } from "react";
import { Clock, Calendar, Activity, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePatient } from "@/contexts/PatientContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getDemoState(sec: number) {
  if (sec >= 1200) {
    return {
      status: "Ictal",
      color: "#ef4444",
      bg: "border-red-400 bg-red-50/80",
      text: "text-red-600",
      title: "🚨 Seizure Detected",
    };
  }
  const playWarningBeep = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.value = 850;

    gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.4);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + i * 0.4 + 0.3
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + i * 0.4);
    osc.stop(ctx.currentTime + i * 0.4 + 0.3);
  }
};

  if (sec >= 420) {
    return {
      status: "Pre-ictal",
      color: "#f59e0b",
      bg: "border-orange-300 bg-orange-50/80",
      text: "text-orange-600",
      title: "⚠️ Pre-ictal Pattern Detected",
    };
  }

  return {
    status: "Normal",
    color: "#3b82f6",
    bg: "border-blue-300 bg-blue-50/80",
    text: "text-blue-600",
    title: "All Signals Stable",
  };
}

function DashboardEEGChart({ sec, color }: { sec: number; color: string }) {
  const data = Array.from({ length: 420 }, (_, i) => {
    const t = sec + i;
    return {
      x: i,
      y:
        Math.sin(t * 0.22) * 0.8 +
        Math.sin(t * 0.07) * 0.45 +
        Math.sin(t * 0.9) * 0.12,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis hide dataKey="x" />
        <YAxis hide domain={[-2, 2]} />
        <Line
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
const playWarningBeep = () => {
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;

  const ctx = new AudioContextClass();

  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.value = 850;

    gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.4);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + i * 0.4 + 0.3
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + i * 0.4);
    osc.stop(ctx.currentTime + i * 0.4 + 0.3);
  }
};

const unlockAudio = () => {
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;

  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  gain.gain.value = 0.001;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

export default function Index() {
  const { selectedPatient } = usePatient();
  const [currentTime, setCurrentTime] = useState(new Date());

  const [demoStarted, setDemoStarted] = useState(false);
  const [demoSec, setDemoSec] = useState(0);
  const [warningPlayed, setWarningPlayed] = useState(false);

  const showAlert = selectedPatient.riskLevel === "high";
  const demoState = getDemoState(demoSec);

  // Clock in header
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fast EEG demo timer
  useEffect(() => {
    if (!demoStarted) return;

    const timer = setInterval(() => {
      setDemoSec((prev) => {
        if (prev >= 1428) return 1428;
        return prev + 10; // السرعة: زوديها لو تبغي أسرع، قلليها لو تبغي أبطأ
      });
    }, 100);

    return () => clearInterval(timer);
  }, [demoStarted]);

  // Warning beep during the first 4 seconds of Pre-ictal
  useEffect(() => {
    if (!demoStarted) return;

    if (demoSec >= 420 && demoSec <= 424 && !warningPlayed) {
      playWarningBeep();
      setWarningPlayed(true);
    }
  }, [demoSec, demoStarted, warningPlayed]);

  const handleDismissAlert = () => {
    toast({
      title: "Alert Dismissed",
      description: "Continue monitoring. Alert can be reactivated if risk persists.",
    });
  };

  const handleContactCaregiver = () => {
    toast({
      title: "Contacting Caregiver",
      description: "Sending alert to registered emergency contacts...",
    });
  };

return (
    <Layout>
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Live Monitoring
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time seizure prediction and signal analysis
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
              <Calendar className="w-4 h-4" />
              <span>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
              <Clock className="w-4 h-4" />
              <span className="font-mono">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-success font-medium">Connected</span>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <AlertBanner
        isActive={showAlert}
        minutesRemaining={14.5}
        riskScore={selectedPatient.riskScore}
        contributingSignals={["EEG", "EMG"]}
        onDismiss={handleDismissAlert}
        onContact={handleContactCaregiver}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Signal Charts */}
        <div className="xl:col-span-8 space-y-6">
          <SignalStats stats={selectedPatient.stats} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SignalChart
              type="eeg"
              title="EEG Signal"
              unit="μV"
              value={selectedPatient.signalValues.eeg}
              status={
                selectedPatient.riskLevel === "high"
                  ? "critical"
                  : selectedPatient.riskLevel === "elevated"
                  ? "warning"
                  : "normal"
              }
            />

            <SignalChart
              type="ecg"
              title="ECG Signal"
              unit="bpm"
              value={selectedPatient.signalValues.ecg}
              status={selectedPatient.riskLevel === "high" ? "warning" : "normal"}
            />

            <SignalChart
              type="emg"
              title="EMG Signal"
              unit="mV"
              value={selectedPatient.signalValues.emg}
              status={
                selectedPatient.riskLevel === "high"
                  ? "critical"
                  : selectedPatient.riskLevel === "elevated"
                  ? "warning"
                  : "normal"
              }
            />

            <SignalChart
              type="mov"
              title="Motion Sensor"
              unit="g"
              value={selectedPatient.signalValues.mov}
              status={selectedPatient.riskLevel === "high" ? "warning" : "normal"}
            />
          </div>
        </div>

        {/* Right Column - Risk & Timeline */}
        <div className="xl:col-span-4 space-y-6">
          <RiskIndicator
            level={selectedPatient.riskLevel}
            score={selectedPatient.riskScore}
          />
          <TimelineStrip events={selectedPatient.events} />
        </div>
      </div>

      {/* Start Button */}
      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          className="px-20"
          onClick={() => {
            unlockAudio();
            setDemoSec(0);
            setDemoStarted(true);
            setWarningPlayed(false);
          }}
        >
          Start
        </Button>
      </div>

      {/* Fast EEG Demo */}
      {demoStarted && (
        <div className="mt-6 space-y-6">
          <div
            className="glass-card p-6 border"
            style={{
              borderColor: demoState.color,
              boxShadow: `0 0 24px ${demoState.color}33`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-foreground">
                  Live EEG Simulation
                </h2>
                <p className="text-sm text-muted-foreground">
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Current Time</p>
                <p className={cn("text-xl font-bold", demoState.text)}>
                  {formatTime(demoSec)}
                </p>
              </div>
            </div>

            <div className="h-72 rounded-2xl border bg-background/60 p-4">
              <DashboardEEGChart sec={demoSec} color={demoState.color} />
            </div>
          </div>

          <div className={cn("rounded-2xl border p-6", demoState.bg)}>
            <div className="flex items-center gap-3">
              <AlertTriangle className={cn("w-6 h-6", demoState.text)} />
              <h2 className={cn("font-bold text-lg", demoState.text)}>
                {demoState.title}
              </h2>
            </div>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className={cn("font-bold", demoState.text)}>
                  {demoState.status}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Current Time</p>
                <p className="font-bold">{formatTime(demoSec)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}