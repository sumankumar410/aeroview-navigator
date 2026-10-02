 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { useState, useEffect, useCallback } from "react";



































































function useLocalStorage(key, initialValue) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  return [data, setData] ;
}

function calcDaysRemaining(nextDue) {
  const diff = new Date(nextDue).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function calcStatus(nextCheck) {
  const days = calcDaysRemaining(nextCheck);
  if (days < 0) return "overdue";
  if (days <= 15) return "due";
  return "safe";
}

const seedAircraft = [
  { id: "ac-1", registration: "VT-ABC", type: "Boeing", model: "737-800", status: "safe", totalHours: 24500, lastCheck: "2024-03-15", nextCheck: "2026-06-15", createdAt: "2024-01-01" },
  { id: "ac-2", registration: "VT-DEF", type: "Airbus", model: "A320neo", status: "due", totalHours: 18200, lastCheck: "2024-01-10", nextCheck: "2026-04-10", createdAt: "2024-01-02" },
  { id: "ac-3", registration: "VT-GHI", type: "Boeing", model: "777-300ER", status: "overdue", totalHours: 35800, lastCheck: "2023-11-20", nextCheck: "2025-02-20", createdAt: "2024-01-03" },
  { id: "ac-4", registration: "VT-JKL", type: "Airbus", model: "A380-800", status: "safe", totalHours: 12400, lastCheck: "2024-03-01", nextCheck: "2026-09-01", createdAt: "2024-01-04" },
  { id: "ac-5", registration: "VT-MNO", type: "Boeing", model: "787-9", status: "safe", totalHours: 8900, lastCheck: "2024-02-28", nextCheck: "2026-08-28", createdAt: "2024-01-05" },
  { id: "ac-6", registration: "VT-PQR", type: "Airbus", model: "A350-900", status: "due", totalHours: 15600, lastCheck: "2024-01-25", nextCheck: "2026-04-20", createdAt: "2024-01-06" },
];

const seedMaintenance = [
  { id: "mt-1", aircraftId: "ac-1", aircraftReg: "VT-ABC (B737)", type: "A-Check", description: "Routine inspection and servicing", status: "completed", date: "2024-03-15", nextDue: "2026-06-15", daysRemaining: 75, technician: "Capt. Singh", createdAt: "2024-03-15" },
  { id: "mt-2", aircraftId: "ac-2", aircraftReg: "VT-DEF (A320)", type: "C-Check", description: "Landing gear overhaul", status: "in-progress", date: "2026-04-01", nextDue: "2026-04-10", daysRemaining: 8, technician: "Eng. Patel", createdAt: "2024-04-01" },
  { id: "mt-3", aircraftId: "ac-3", aircraftReg: "VT-GHI (B777)", type: "B-Check", description: "Hydraulic system check", status: "overdue", date: "2024-02-20", nextDue: "2025-03-20", daysRemaining: -12, technician: "Eng. Kumar", createdAt: "2024-02-20" },
  { id: "mt-4", aircraftId: "ac-4", aircraftReg: "VT-JKL (A380)", type: "D-Check", description: "Structural overhaul and NDT", status: "scheduled", date: "2026-05-01", nextDue: "2026-05-15", daysRemaining: 44, technician: "Eng. Sharma", createdAt: "2024-05-01" },
];

const seedFiles = [
  { id: "f-1", name: "Engine_Inspection_VT-ABC.pdf", type: "pdf", size: "2.4 MB", aircraft: "VT-ABC", uploadedAt: "2024-03-15" },
  { id: "f-2", name: "Landing_Gear_Photos_VT-DEF.jpg", type: "image", size: "5.1 MB", aircraft: "VT-DEF", uploadedAt: "2024-03-12" },
  { id: "f-3", name: "Maintenance_Log_Q1.xlsx", type: "spreadsheet", size: "1.8 MB", aircraft: "Fleet", uploadedAt: "2024-03-10" },
];

export function useAircraftStore() {
  const [aircraft, setAircraft] = useLocalStorage("aerotrack_aircraft", seedAircraft);

  const refreshStatuses = useCallback(() => {
    setAircraft(prev => prev.map(a => ({ ...a, status: calcStatus(a.nextCheck) })));
  }, [setAircraft]);

  useEffect(() => { refreshStatuses(); }, []);

  const addAircraft = useCallback((data) => {
    const newAc = {
      ...data,
      id: `ac-${Date.now()}`,
      status: calcStatus(data.nextCheck),
      createdAt: new Date().toISOString(),
    };
    setAircraft(prev => [...prev, newAc]);
    return newAc;
  }, [setAircraft]);

  const updateAircraft = useCallback((id, data) => {
    setAircraft(prev => prev.map(a => {
      if (a.id !== id) return a;
      const updated = { ...a, ...data };
      if (data.nextCheck) updated.status = calcStatus(data.nextCheck);
      return updated;
    }));
  }, [setAircraft]);

  const deleteAircraft = useCallback((id) => {
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
  const [records, setRecords] = useLocalStorage("aerotrack_maintenance", seedMaintenance);

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

  const addRecord = useCallback((data) => {
    const days = calcDaysRemaining(data.nextDue);
    const rec = {
      ...data,
      id: `mt-${Date.now()}`,
      daysRemaining: days,
      status: days < 0 ? "overdue" : days <= 15 ? "in-progress" : "scheduled",
      createdAt: new Date().toISOString(),
    };
    setRecords(prev => [...prev, rec]);
    return rec;
  }, [setRecords]);

  const updateRecord = useCallback((id, data) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...data };
      if (data.nextDue) {
        updated.daysRemaining = calcDaysRemaining(data.nextDue);
      }
      return updated;
    }));
  }, [setRecords]);

  const deleteRecord = useCallback((id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, [setRecords]);

  const markComplete = useCallback((id) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "completed"  } : r));
  }, [setRecords]);

  return { records, addRecord, updateRecord, deleteRecord, markComplete };
}

export function useFileStore() {
  const [files, setFiles] = useLocalStorage("aerotrack_files", seedFiles);

  const addFile = useCallback((data) => {
    const f = { ...data, id: `f-${Date.now()}`, uploadedAt: new Date().toISOString().split("T")[0] };
    setFiles(prev => [...prev, f]);
    return f;
  }, [setFiles]);

  const deleteFile = useCallback((id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, [setFiles]);

  return { files, addFile, deleteFile };
}

export function useNotificationStore() {
  const [notifications, setNotifications] = useLocalStorage("aerotrack_notifications", []);

  const generateNotifications = useCallback((aircraft, maintenance) => {
    const newNotifs = [];
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

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, generateNotifications, markRead, markAllRead, unreadCount };
}

const seedFlights = [
  {
    id: "fl-1",
    flightNo: "AI-101",
    airline: "Air India",
    aircraftReg: "VT-ABC",
    route: "DEL ➔ BOM",
    origin: "New Delhi (DEL)",
    destination: "Mumbai (BOM)",
    departureTime: "10:30 AM",
    arrivalTime: "12:45 PM",
    flightDuration: "2h 15m",
    status: "On Time",
    healthScore: 98,
  },
  {
    id: "fl-2",
    flightNo: "6E-204",
    airline: "IndiGo",
    aircraftReg: "VT-DEF",
    route: "BLR ➔ DEL",
    origin: "Bengaluru (BLR)",
    destination: "New Delhi (DEL)",
    departureTime: "02:15 PM",
    arrivalTime: "05:00 PM",
    flightDuration: "2h 45m",
    status: "Inspection Due",
    healthScore: 78,
  },
  {
    id: "fl-3",
    flightNo: "AI-308",
    airline: "Air India",
    aircraftReg: "VT-GHI",
    route: "BOM ➔ LHR",
    origin: "Mumbai (BOM)",
    destination: "London Heathrow (LHR)",
    departureTime: "04:00 AM",
    arrivalTime: "09:30 AM",
    flightDuration: "9h 00m",
    status: "Grounded / Overdue",
    healthScore: 42,
  },
  {
    id: "fl-4",
    flightNo: "UK-955",
    airline: "Vistara",
    aircraftReg: "VT-JKL",
    route: "DEL ➔ SIN",
    origin: "New Delhi (DEL)",
    destination: "Singapore (SIN)",
    departureTime: "11:50 PM",
    arrivalTime: "08:10 AM",
    flightDuration: "5h 50m",
    status: "Cleared for Flight",
    healthScore: 96,
  },
  {
    id: "fl-5",
    flightNo: "6E-512",
    airline: "IndiGo",
    aircraftReg: "VT-MNO",
    route: "HYD ➔ CCU",
    origin: "Hyderabad (HYD)",
    destination: "Kolkata (CCU)",
    departureTime: "06:40 PM",
    arrivalTime: "08:50 PM",
    flightDuration: "2h 10m",
    status: "Cleared for Flight",
    healthScore: 99,
  },
  {
    id: "fl-6",
    flightNo: "AI-821",
    airline: "Air India",
    aircraftReg: "VT-PQR",
    route: "DEL ➔ DXB",
    origin: "New Delhi (DEL)",
    destination: "Dubai (DXB)",
    departureTime: "08:20 PM",
    arrivalTime: "10:45 PM",
    flightDuration: "3h 55m",
    status: "Inspection Due Soon",
    healthScore: 82,
  },
];

export function useFlightStore() {
  const [flights, setFlights] = useLocalStorage("aerotrack_flights", seedFlights);
  const { aircraft } = useAircraftStore();
  const { records, addRecord } = useMaintenanceStore();

  const getFlightDetails = useCallback((query) => {
    if (!query) return null;
    const q = query.trim().toUpperCase();
    const flight = flights.find(f =>
      f.flightNo.toUpperCase() === q ||
      f.aircraftReg.toUpperCase() === q ||
      f.flightNo.toUpperCase().includes(q)
    );
    if (!flight) return null;

    const matchedAircraft = aircraft.find(a => a.registration === flight.aircraftReg);
    const relatedRecords = records.filter(r =>
      r.aircraftReg?.toUpperCase().includes(flight.aircraftReg.toUpperCase()) ||
      r.aircraftId === matchedAircraft?.id
    );

    return {
      ...flight,
      aircraft: matchedAircraft || null,
      records: relatedRecords,
    };
  }, [flights, aircraft, records]);

  const requestInspection = useCallback((flightNo, notes) => {
    const flight = flights.find(f => f.flightNo === flightNo);
    if (!flight) return false;
    const matchedAircraft = aircraft.find(a => a.registration === flight.aircraftReg);

    addRecord({
      aircraftId: matchedAircraft?.id || "ac-custom",
      aircraftReg: `${flight.aircraftReg} (${flight.flightNo})`,
      type: "Pre-Flight Inspection",
      description: notes || `Priority pre-flight maintenance request for flight ${flight.flightNo}`,
      status: "scheduled",
      date: new Date().toISOString().split("T")[0],
      nextDue: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      daysRemaining: 7,
      technician: "Pending Dispatch",
    });

    return true;
  }, [flights, aircraft, addRecord]);

  return { flights, setFlights, getFlightDetails, requestInspection };
}

export function useTeamStore() {
  const [team, setTeam] = useLocalStorage("aerospark_team", seedFlights);
  return { team, updateMember: () => {} };
}

export function useTwilioConfig() {
  const config = {
    accountSid: (typeof import.meta !== "undefined" && import.meta.env?.VITE_TWILIO_ACCOUNT_SID) || "YOUR_TWILIO_ACCOUNT_SID",
    authToken: (typeof import.meta !== "undefined" && import.meta.env?.VITE_TWILIO_AUTH_TOKEN) || "YOUR_TWILIO_AUTH_TOKEN",
    fromNumber: (typeof import.meta !== "undefined" && import.meta.env?.VITE_TWILIO_FROM_NUMBER) || "+19342465581",
    toNumber: (typeof import.meta !== "undefined" && import.meta.env?.VITE_TWILIO_TO_NUMBER) || "+916287024448",
  };

  return { config };
}

export function exportToJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map(row => headers.map(h => `"${String(_nullishCoalesce(row[h], () => ( "")))}"`).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
