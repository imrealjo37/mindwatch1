import React, { createContext, useContext, useState, ReactNode } from "react";

export interface PatientEvent {
  id: string;
  time: string;
  type: "normal" | "elevated" | "alert" | "seizure";
  message: string;
}

export interface PatientStat {
  type: "eeg" | "ecg" | "emg" | "mov";
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  status: "normal" | "warning" | "critical";
}

export interface HistoryEvent {
  id: string;
  date: string;
  time: string;
  type: "seizure" | "prediction" | "elevated" | "normal";
  duration?: string;
  riskScore?: number;
  signals: string[];
  notes: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: "high" | "medium" | "low";
  message: string;
  read: boolean;
  actionTaken?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  diagnosis: string;
  medications: string[];
  lastSeizure: string;
  riskLevel: "normal" | "elevated" | "high";
  riskScore: number;
  stats: PatientStat[];
  events: PatientEvent[];
  signalValues: { eeg: number; ecg: number; emg: number; mov: number };
  history: HistoryEvent[];
  alerts: Alert[];
}

const patientsData: Patient[] = [
  {
    id: "MW-2024-001",
    name: "Ahmed Mohammed",
    age: 28,
    gender: "Male",
    bloodType: "O+",
    phone: "+966 50 123 4567",
    email: "ahmed@email.com",
    diagnosis: "Focal Epilepsy",
    medications: ["Levetiracetam 500mg", "Valproic Acid 250mg"],
    lastSeizure: "December 3, 2025",
    riskLevel: "normal",
    riskScore: 23,
    stats: [
      { type: "eeg", label: "EEG Alpha", value: "42", unit: "μV", trend: "stable", trendValue: "0%", status: "normal" },
      { type: "ecg", label: "Heart Rate", value: "72", unit: "bpm", trend: "up", trendValue: "+3%", status: "normal" },
      { type: "emg", label: "EMG Peak", value: "28", unit: "mV", trend: "down", trendValue: "-5%", status: "normal" },
      { type: "mov", label: "Motion", value: "0.3", unit: "g", trend: "stable", trendValue: "0%", status: "normal" },
    ],
    events: [
      { id: "1", time: "2 minutes ago", type: "normal", message: "All signals within normal range" },
      { id: "2", time: "8 minutes ago", type: "elevated", message: "EEG showing slightly elevated activity" },
      { id: "3", time: "15 minutes ago", type: "normal", message: "Routine monitoring check complete" },
    ],
    signalValues: { eeg: 42, ecg: 72, emg: 28, mov: 0.3 },
    history: [
      { id: "1", date: "Dec 5, 2025", time: "14:32", type: "prediction", riskScore: 78, signals: ["EEG", "EMG"], notes: "High risk detected, precautions taken." },
      { id: "2", date: "Dec 3, 2025", time: "09:15", type: "seizure", duration: "2m 34s", riskScore: 92, signals: ["EEG", "ECG", "EMG"], notes: "Seizure occurred. Prediction was accurate." },
      { id: "3", date: "Dec 1, 2025", time: "16:20", type: "elevated", riskScore: 45, signals: ["EEG"], notes: "Elevated activity during sleep." },
    ],
    alerts: [
      { id: "1", timestamp: "5 minutes ago", type: "low", message: "Routine check. All signals normal.", read: true },
      { id: "2", timestamp: "Yesterday, 3:45 PM", type: "medium", message: "Elevated brain activity during rest period.", read: true },
    ],
  },
  {
    id: "MW-2024-002",
    name: "Sara Ali",
    age: 35,
    gender: "Female",
    bloodType: "A+",
    phone: "+966 55 987 6543",
    email: "sara@email.com",
    diagnosis: "Focal Epilepsy",
    medications: ["Carbamazepine 400mg"],
    lastSeizure: "December 4, 2025",
    riskLevel: "elevated",
    riskScore: 58,
    stats: [
      { type: "eeg", label: "EEG Alpha", value: "67", unit: "μV", trend: "up", trendValue: "+12%", status: "warning" },
      { type: "ecg", label: "Heart Rate", value: "88", unit: "bpm", trend: "up", trendValue: "+8%", status: "normal" },
      { type: "emg", label: "EMG Peak", value: "45", unit: "mV", trend: "up", trendValue: "+15%", status: "warning" },
      { type: "mov", label: "Motion", value: "0.8", unit: "g", trend: "up", trendValue: "+5%", status: "normal" },
    ],
    events: [
      { id: "1", time: "1 minute ago", type: "elevated", message: "EEG activity elevated - monitoring closely" },
      { id: "2", time: "5 minutes ago", type: "elevated", message: "EMG showing increased muscle tension" },
      { id: "3", time: "12 minutes ago", type: "normal", message: "Baseline readings updated" },
    ],
    signalValues: { eeg: 67, ecg: 88, emg: 45, mov: 0.8 },
    history: [
      { id: "1", date: "Dec 6, 2025", time: "11:45", type: "elevated", riskScore: 58, signals: ["EEG", "ECG"], notes: "Elevated brain activity. Monitoring continued." },
      { id: "2", date: "Dec 4, 2025", time: "08:30", type: "prediction", riskScore: 65, signals: ["EMG", "MOV"], notes: "Early warning. Medication taken." },
      { id: "3", date: "Dec 2, 2025", time: "22:00", type: "normal", signals: [], notes: "Routine check. All signals normal." },
    ],
    alerts: [
      { id: "1", timestamp: "2 hours ago", type: "medium", message: "Elevated brain activity during rest period.", read: false },
      { id: "2", timestamp: "Yesterday, 10:22 AM", type: "low", message: "Device battery low.", read: true },
    ],
  },
  {
    id: "MW-2024-003",
    name: "Khaled Abdullah",
    age: 42,
    gender: "Male",
    bloodType: "B-",
    phone: "+966 54 456 7890",
    email: "khaled@email.com",
    diagnosis: "Focal Epilepsy",
    medications: ["Topiramate 200mg", "Clonazepam 2mg", "Lamotrigine 100mg"],
    lastSeizure: "December 7, 2025",
    riskLevel: "high",
    riskScore: 87,
    stats: [
      { type: "eeg", label: "EEG Alpha", value: "92", unit: "μV", trend: "up", trendValue: "+35%", status: "critical" },
      { type: "ecg", label: "Heart Rate", value: "105", unit: "bpm", trend: "up", trendValue: "+20%", status: "warning" },
      { type: "emg", label: "EMG Peak", value: "78", unit: "mV", trend: "up", trendValue: "+40%", status: "critical" },
      { type: "mov", label: "Motion", value: "1.5", unit: "g", trend: "up", trendValue: "+25%", status: "warning" },
    ],
    events: [
      { id: "1", time: "30 seconds ago", type: "alert", message: "HIGH RISK - Seizure predicted in ~15 minutes" },
      { id: "2", time: "2 minutes ago", type: "elevated", message: "Multiple signals showing critical patterns" },
      { id: "3", time: "5 minutes ago", type: "elevated", message: "EEG spike detected" },
    ],
    signalValues: { eeg: 92, ecg: 105, emg: 78, mov: 1.5 },
    history: [
      { id: "1", date: "Dec 7, 2025", time: "06:15", type: "seizure", duration: "3m 12s", riskScore: 95, signals: ["EEG", "ECG", "EMG", "MOV"], notes: "Severe seizure. Physician notified." },
      { id: "2", date: "Dec 6, 2025", time: "23:45", type: "prediction", riskScore: 87, signals: ["EEG", "EMG"], notes: "Warning 15 minutes before seizure." },
      { id: "3", date: "Dec 5, 2025", time: "14:00", type: "elevated", riskScore: 72, signals: ["EEG"], notes: "Moderate risk elevation." },
      { id: "4", date: "Dec 3, 2025", time: "10:30", type: "seizure", duration: "1m 45s", riskScore: 88, signals: ["EEG", "ECG"], notes: "Mild seizure. Quick recovery." },
    ],
    alerts: [
      { id: "1", timestamp: "5 minutes ago", type: "high", message: "High risk detected. Pre-seizure patterns in EEG and EMG. Estimated time: 15 minutes.", read: false },
      { id: "2", timestamp: "Yesterday, 3:45 PM", type: "high", message: "Seizure prediction alert. Caregiver notified.", read: true, actionTaken: "Medication taken" },
      { id: "3", timestamp: "Dec 5, 2025", type: "medium", message: "Unusual heart rate variability detected.", read: true, actionTaken: "Reviewed by physician" },
    ],
  },
];

interface PatientContextType {
  patients: Patient[];
  selectedPatient: Patient;
  setSelectedPatientId: (id: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patientsData[0].id);
  const selectedPatient = patientsData.find(p => p.id === selectedPatientId) || patientsData[0];

  return (
    <PatientContext.Provider value={{ patients: patientsData, selectedPatient, setSelectedPatientId }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
