import { NavLink } from "@/components/NavLink";
import { Play } from "lucide-react";
import { 
  Activity, 
  LayoutDashboard, 
  History, 
  Settings, 
  User, 
  Bell,
  Brain,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePatient } from "@/contexts/PatientContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: History, label: "History", path: "/history" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: Play, label: "Run", path: "/run" }, 
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { patients, selectedPatient, setSelectedPatientId } = usePatient();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border lg:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">MindWatch</h1>
            <p className="text-xs text-white/70">Seizure Monitoring</p>
          </div>
        </div>

        {/* Patient Selector */}
        <div className="px-4 py-4 border-b border-sidebar-border">
          <label className="text-xs text-white/70 mb-2 block">Select Patient</label>
          <Select value={selectedPatient.id} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-white">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  selectedPatient.riskLevel === "high" ? "bg-destructive" :
                  selectedPatient.riskLevel === "elevated" ? "bg-warning" : "bg-success"
                )} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      patient.riskLevel === "high" ? "bg-destructive" :
                      patient.riskLevel === "elevated" ? "bg-warning" : "bg-success"
                    )} />
                    <span>{patient.name}</span>
                    <span className="text-white/60 text-xs">({patient.id})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Live Status */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-success font-medium">Live Monitoring</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-sidebar-accent transition-colors"
              activeClassName="bg-sidebar-accent text-white"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom section - Selected Patient Info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center",
              selectedPatient.riskLevel === "high" ? "bg-destructive/20" :
              selectedPatient.riskLevel === "elevated" ? "bg-warning/20" : "bg-success/20"
            )}>
              <User className={cn(
                "w-4 h-4",
                selectedPatient.riskLevel === "high" ? "text-destructive" :
                selectedPatient.riskLevel === "elevated" ? "text-warning" : "text-success"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{selectedPatient.name}</p>
              <p className="text-xs text-white/60 truncate">{selectedPatient.id}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
