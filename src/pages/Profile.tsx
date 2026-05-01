import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Calendar, Shield, Edit, Activity, Heart, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePatient } from "@/contexts/PatientContext";

export default function Profile() {
  const { selectedPatient } = usePatient();

  return (
    <Layout>
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Patient Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage patient information
            </p>
          </div>
          
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Header */}
          <div className="glass-card p-6">
            <div className="flex items-start gap-6">
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center",
                selectedPatient.riskLevel === "high" ? "bg-destructive/10" :
                selectedPatient.riskLevel === "elevated" ? "bg-warning/10" : "bg-primary/10"
              )}>
                <User className={cn(
                  "w-10 h-10",
                  selectedPatient.riskLevel === "high" ? "text-destructive" :
                  selectedPatient.riskLevel === "elevated" ? "text-warning" : "text-primary"
                )} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{selectedPatient.name}</h2>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {selectedPatient.id}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium">{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Blood Type</p>
                    <p className="font-medium">{selectedPatient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Risk Level</p>
                    <p className={cn(
                      "font-medium",
                      selectedPatient.riskLevel === "high" ? "text-destructive" :
                      selectedPatient.riskLevel === "elevated" ? "text-warning" : "text-success"
                    )}>
                      {selectedPatient.riskLevel === "high" ? "High" :
                       selectedPatient.riskLevel === "elevated" ? "Elevated" : "Normal"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{selectedPatient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selectedPatient.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Diagnosis</p>
                <p className="font-semibold text-foreground">{selectedPatient.diagnosis}</p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Seizure</p>
                <p className="font-semibold text-foreground">{selectedPatient.lastSeizure}</p>
              </div>
              <div className="p-4 rounded-lg border border-border md:col-span-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Medications</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.medications.map((med) => (
                    <span key={med} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Risk Status */}
          <div className={cn(
            "glass-card p-6 border-2",
            selectedPatient.riskLevel === "high" ? "border-destructive/30" :
            selectedPatient.riskLevel === "elevated" ? "border-warning/30" : "border-success/30"
          )}>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className={cn(
                "w-5 h-5",
                selectedPatient.riskLevel === "high" ? "text-destructive" :
                selectedPatient.riskLevel === "elevated" ? "text-warning" : "text-success"
              )} />
              Risk Status
            </h3>
            <div className="text-center">
              <p className={cn(
                "text-5xl font-bold mb-2",
                selectedPatient.riskLevel === "high" ? "text-destructive" :
                selectedPatient.riskLevel === "elevated" ? "text-warning" : "text-success"
              )}>
                {selectedPatient.riskScore}%
              </p>
              <p className="text-muted-foreground">Current Risk Score</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Events</span>
                <span className="font-bold">{selectedPatient.history.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Seizures</span>
                <span className="font-bold text-destructive">
                  {selectedPatient.history.filter(h => h.type === "seizure").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Alerts</span>
                <span className="font-bold text-warning">
                  {selectedPatient.alerts.filter(a => !a.read).length}
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="glass-card p-6 border-2 border-destructive/20">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              Emergency Contact
            </h3>
            <Button variant="destructive" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Call Emergency Contact
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
