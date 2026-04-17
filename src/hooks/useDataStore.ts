import { useState, useEffect, useCallback } from "react";

export interface Aircraft {
  id: string;
  registration: string;
  type: string;
  model: string;
  status: "safe" | "due" | "overdue";
  totalHours: number;
  lastCheck: string;
  nextCheck: string;
  imageUrl?: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  aircraftReg: string;
  type: string;
  description: string;
  status: "completed" | "in-progress" | "scheduled" | "overdue";
  date: string;
  nextDue: string;
  daysRemaining: number;
  technician: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  aircraft: string;
  uploadedAt: string;
  title?: string;
  description?: string;
  reportDate?: string;
  dataUrl?: string;
  mimeType?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  institute: string;
  imageUrl?: string;
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  toNumber: string;
}

export interface AppNotification {
  id: string;
  type: "overdue" | "due" | "completed" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
  createdAt: string;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  return [data, setData] as const;
}

function calcDaysRemaining(nextDue: string): number {
  const diff = new Date(nextDue).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function calcStatus(nextCheck: string): "safe" | "due" | "overdue" {
  const days = calcDaysRemaining(nextCheck);
  if (days < 0) return "overdue";
  if (days <= 15) return "due";
  return "safe";
}

const seedAircraft: Aircraft[] = [
  { id: "ac-1", registration: "VT-ABC", type: "Boeing", model: "737-800", status: "safe", totalHours: 24500, lastCheck: "2024-03-15", nextCheck: "2026-06-15", createdAt: "2024-01-01" },
  { id: "ac-2", registration: "VT-DEF", type: "Airbus", model: "A320neo", status: "due", totalHours: 18200, lastCheck: "2024-01-10", nextCheck: "2026-04-10", createdAt: "2024-01-02" },
  { id: "ac-3", registration: "VT-GHI", type: "Boeing", model: "777-300ER", status: "overdue", totalHours: 35800, lastCheck: "2023-11-20", nextCheck: "2025-02-20", createdAt: "2024-01-03" },
  { id: "ac-4", registration: "VT-JKL", type: "Airbus", model: "A380-800", status: "safe", totalHours: 12400, lastCheck: "2024-03-01", nextCheck: "2026-09-01", createdAt: "2024-01-04" },
  { id: "ac-5", registration: "VT-MNO", type: "Boeing", model: "787-9", status: "safe", totalHours: 8900, lastCheck: "2024-02-28", nextCheck: "2026-08-28", createdAt: "2024-01-05" },
  { id: "ac-6", registration: "VT-PQR", type: "Airbus", model: "A350-900", status: "due", totalHours: 15600, lastCheck: "2024-01-25", nextCheck: "2026-04-20", createdAt: "2024-01-06" },
];

const seedMaintenance: MaintenanceRecord[] = [
  { id: "mt-1", aircraftId: "ac-1", aircraftReg: "VT-ABC (B737)", type: "A-Check", description: "Routine inspection and servicing", status: "completed", date: "2024-03-15", nextDue: "2026-06-15", daysRemaining: 75, technician: "Capt. Singh", createdAt: "2024-03-15" },
  { id: "mt-2", aircraftId: "ac-2", aircraftReg: "VT-DEF (A320)", type: "C-Check", description: "Landing gear overhaul", status: "in-progress", date: "2026-04-01", nextDue: "2026-04-10", daysRemaining: 8, technician: "Eng. Patel", createdAt: "2024-04-01" },
  { id: "mt-3", aircraftId: "ac-3", aircraftReg: "VT-GHI (B777)", type: "B-Check", description: "Hydraulic system check", status: "overdue", date: "2024-02-20", nextDue: "2025-03-20", daysRemaining: -12, technician: "Eng. Kumar", createdAt: "2024-02-20" },
  { id: "mt-4", aircraftId: "ac-4", aircraftReg: "VT-JKL (A380)", type: "D-Check", description: "Structural overhaul and NDT", status: "scheduled", date: "2026-05-01", nextDue: "2026-05-15", daysRemaining: 44, technician: "Eng. Sharma", createdAt: "2024-05-01" },
];

const seedFiles: UploadedFile[] = [
  { id: "f-1", name: "Engine_Inspection_VT-ABC.pdf", type: "pdf", size: "2.4 MB", aircraft: "VT-ABC", uploadedAt: "2024-03-15" },
  { id: "f-2", name: "Landing_Gear_Photos_VT-DEF.jpg", type: "image", size: "5.1 MB", aircraft: "VT-DEF", uploadedAt: "2024-03-12" },
  { id: "f-3", name: "Maintenance_Log_Q1.xlsx", type: "spreadsheet", size: "1.8 MB", aircraft: "Fleet", uploadedAt: "2024-03-10" },
];

export function useAircraftStore() {
  const [aircraft, setAircraft] = useLocalStorage<Aircraft[]>("aerotrack_aircraft", seedAircraft);

  const refreshStatuses = useCallback(() => {
    setAircraft(prev => prev.map(a => ({ ...a, status: calcStatus(a.nextCheck) })));
  }, [setAircraft]);

  useEffect(() => { refreshStatuses(); }, []);

  const addAircraft = useCallback((data: Omit<Aircraft, "id" | "status" | "createdAt">) => {
    const newAc: Aircraft = {
      ...data,
      id: `ac-${Date.now()}`,
      status: calcStatus(data.nextCheck),
      createdAt: new Date().toISOString(),
    };
    setAircraft(prev => [...prev, newAc]);
    return newAc;
  }, [setAircraft]);

  const updateAircraft = useCallback((id: string, data: Partial<Aircraft>) => {
    setAircraft(prev => prev.map(a => {
      if (a.id !== id) return a;
      const updated = { ...a, ...data };
      if (data.nextCheck) updated.status = calcStatus(data.nextCheck);
      return updated;
    }));
  }, [setAircraft]);

  const deleteAircraft = useCallback((id: string) => {
    setAircraft(prev => prev.filter(a => a.id !== id));
  }, [setAircraft]);

  const stats = {
    total: aircraft.length,
    safe: aircraft.filter(a => a.status === "safe").length,
    due: aircraft.filter(a => a.status === "due").length,
    overdue: aircraft.filter(a => a.status === "overdue").length,
    totalHours: aircraft.reduce((sum, a) => sum + a.totalHours, 0),
  };

  return { aircraft, addAircraft, updateAircraft, deleteAircraft, stats, refreshStatuses };
}

export function useMaintenanceStore() {
  const [records, setRecords] = useLocalStorage<MaintenanceRecord[]>("aerotrack_maintenance", seedMaintenance);

  const refreshStatuses = useCallback(() => {
    setRecords(prev => prev.map(r => {
      const days = calcDaysRemaining(r.nextDue);
      let status = r.status;
      if (r.status !== "completed") {
        if (days < 0) status = "overdue";
        else if (days <= 15) status = "in-progress";
        else status = "scheduled";
      }
      return { ...r, daysRemaining: days, status };
    }));
  }, [setRecords]);

  useEffect(() => { refreshStatuses(); }, []);

  const addRecord = useCallback((data: Omit<MaintenanceRecord, "id" | "daysRemaining" | "createdAt" | "status">) => {
    const days = calcDaysRemaining(data.nextDue);
    const rec: MaintenanceRecord = {
      ...data,
      id: `mt-${Date.now()}`,
      daysRemaining: days,
      status: days < 0 ? "overdue" : days <= 15 ? "in-progress" : "scheduled",
      createdAt: new Date().toISOString(),
    };
    setRecords(prev => [...prev, rec]);
    return rec;
  }, [setRecords]);

  const updateRecord = useCallback((id: string, data: Partial<MaintenanceRecord>) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...data };
      if (data.nextDue) {
        updated.daysRemaining = calcDaysRemaining(data.nextDue);
      }
      return updated;
    }));
  }, [setRecords]);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, [setRecords]);

  const markComplete = useCallback((id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "completed" as const } : r));
  }, [setRecords]);

  return { records, addRecord, updateRecord, deleteRecord, markComplete };
}

export function useFileStore() {
  const [files, setFiles] = useLocalStorage<UploadedFile[]>("aerotrack_files", seedFiles);

  const addFile = useCallback((data: Omit<UploadedFile, "id" | "uploadedAt">) => {
    const f: UploadedFile = { ...data, id: `f-${Date.now()}`, uploadedAt: new Date().toISOString().split("T")[0] };
    setFiles(prev => [...prev, f]);
    return f;
  }, [setFiles]);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, [setFiles]);

  return { files, addFile, deleteFile };
}

export function useNotificationStore() {
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>("aerotrack_notifications", []);

  const generateNotifications = useCallback((aircraft: Aircraft[], maintenance: MaintenanceRecord[]) => {
    const newNotifs: AppNotification[] = [];
    const now = new Date().toISOString();

    aircraft.forEach(a => {
      if (a.status === "overdue") {
        newNotifs.push({
          id: `notif-ov-${a.id}`,
          type: "overdue",
          title: `Overdue: ${a.registration}`,
          description: `${a.type} ${a.model} maintenance check is overdue.`,
          time: "Auto-generated",
          read: false,
          createdAt: now,
        });
      } else if (a.status === "due") {
        newNotifs.push({
          id: `notif-du-${a.id}`,
          type: "due",
          title: `Due Soon: ${a.registration}`,
          description: `${a.type} ${a.model} has upcoming maintenance.`,
          time: "Auto-generated",
          read: false,
          createdAt: now,
        });
      }
    });

    maintenance.forEach(m => {
      if (m.status === "overdue") {
        newNotifs.push({
          id: `notif-mt-${m.id}`,
          type: "overdue",
          title: `Overdue: ${m.type} - ${m.aircraftReg}`,
          description: m.description,
          time: "Auto-generated",
          read: false,
          createdAt: now,
        });
      }
    });

    setNotifications(newNotifs);
  }, [setNotifications]);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, generateNotifications, markRead, markAllRead, unreadCount };
}

const seedTeam: TeamMember[] = [
  { id: "tm-1", name: "Mayank Kumar Jha", role: "B.Tech CSE (3rd Year)", institute: "MIMIT Malout" },
  { id: "tm-2", name: "Suman Kumar", role: "B.Tech CSE", institute: "MIMIT Malout" },
  { id: "tm-3", name: "Tarun Kumar", role: "B.Tech CSE", institute: "MIMIT Malout" },
];

export function useTeamStore() {
  const [team, setTeam] = useLocalStorage<TeamMember[]>("aerospark_team", seedTeam);
  const updateMember = useCallback((id: string, data: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  }, [setTeam]);
  return { team, updateMember };
}

export function useTwilioConfig() {
  const [config, setConfig] = useLocalStorage<TwilioConfig>("aerospark_twilio", {
    accountSid: "", authToken: "", fromNumber: "", toNumber: "",
  });
  return { config, setConfig };
}

export function exportToJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map(row => headers.map(h => `"${String(row[h] ?? "")}"`).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
