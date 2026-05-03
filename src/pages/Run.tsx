import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getState(currentSec: number) {
  if (currentSec >= 1200) {
    return {
      status: "Ictal",
      color: "#ef4444",
      bg: "border-red-400 bg-red-50/80",
      text: "text-red-600",
      title: "🚨 Seizure Detected",
    };
  }

  if (currentSec >= 420) {
    return {
      status: "Pre-ictal",
      color: "#f59e0b",
      bg: "border-yellow-400 bg-yellow-50/80",
      text: "text-yellow-600",
      title: "⚠️ Pre-ictal",
    };
  }

  return {
    status: "Normal",
    color: "#3b82f6",
    bg: "border-blue-400 bg-blue-50/80",
    text: "text-blue-600",
    title: "Normal",
  };
}

function EEGChart({ currentSec, color }: any) {
  const data = Array.from({ length: 200 }, (_, i) => ({
    x: i,
    y: Math.sin((currentSec + i) * 0.2) + Math.random() * 0.2,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line dataKey="y" stroke={color} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function Run() {
  const [started, setStarted] = useState(false);
  const [sec, setSec] = useState(0);

  const state = getState(sec);

  useEffect(() => {
    if (!started) return;

    const i = setInterval(() => {
      setSec((p) => p + 4);
    }, 200);

    return () => clearInterval(i);
  }, [started]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Run Simulation</h1>

      <Button onClick={() => setStarted(true)}>
        Start Run
      </Button>

      {started && (
        <>
          {/* Alert */}
          <div className={cn("mt-6 p-6 border rounded-xl", state.bg)}>
            <div className="flex items-center gap-3">
              <AlertTriangle className={cn("w-5 h-5", state.text)} />
              <h2 className={cn("font-bold", state.text)}>
                {state.title}
              </h2>
            </div>

            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-bold">{formatTime(sec)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className={cn("font-bold", state.text)}>
                  {state.status}
                </p>
              </div>
            </div>
          </div>

          {/* EEG */}
          <div className="mt-6 h-72 border rounded-xl p-4">
            <EEGChart currentSec={sec} color={state.color} />
          </div>
        </>
      )}
    </Layout>
  );
}