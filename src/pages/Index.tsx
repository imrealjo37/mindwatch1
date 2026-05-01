import { Layout } from "@/components/layout/Layout";
import { RiskIndicator } from "@/components/dashboard/RiskIndicator";
import { SignalChart } from "@/components/dashboard/SignalChart";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { TimelineStrip } from "@/components/dashboard/TimelineStrip";
import { SignalStats } from "@/components/dashboard/SignalStats";
import { useState, useEffect } from "react";
import { Clock, Calendar, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePatient } from "@/contexts/PatientContext";

export default function Index() {
  const { selectedPatient } = usePatient();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const showAlert = selectedPatient.riskLevel === "high";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
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
          {/* Stats Row */}
          <SignalStats stats={selectedPatient.stats} />

          {/* Signal Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SignalChart
              type="eeg"
              title="EEG Signal"
              unit="μV"
              value={selectedPatient.signalValues.eeg}
              status={selectedPatient.riskLevel === "high" ? "critical" : selectedPatient.riskLevel === "elevated" ? "warning" : "normal"}
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
              status={selectedPatient.riskLevel === "high" ? "critical" : selectedPatient.riskLevel === "elevated" ? "warning" : "normal"}
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
          <RiskIndicator level={selectedPatient.riskLevel} score={selectedPatient.riskScore} />
          <TimelineStrip events={selectedPatient.events} />
        </div>
      </div>
    </Layout>
  );
}
