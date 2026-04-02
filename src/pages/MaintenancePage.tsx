import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Plus, Clock, CheckCircle, AlertTriangle, X, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaintenanceRecord {
  id: string;
  aircraft: string;
  type: string;
  description: string;
  status: "completed" | "in-progress" | "scheduled" | "overdue";
  date: string;
  nextDue: string;
  daysRemaining: number;
  technician: string;
}

const records: MaintenanceRecord[] = [
  { id: "1", aircraft: "VT-ABC (B737)", type: "A-Check", description: "Routine inspection and servicing", status: "completed", date: "2024-03-15", nextDue: "2024-06-15", daysRemaining: 75, technician: "Capt. Singh" },
  { id: "2", aircraft: "VT-DEF (A320)", type: "C-Check", description: "Landing gear overhaul", status: "in-progress", date: "2024-04-01", nextDue: "2024-04-10", daysRemaining: 8, technician: "Eng. Patel" },
  { id: "3", aircraft: "VT-GHI (B777)", type: "B-Check", description: "Hydraulic system check", status: "overdue", date: "2024-02-20", nextDue: "2024-03-20", daysRemaining: -12, technician: "Eng. Kumar" },
  { id: "4", aircraft: "VT-JKL (A380)", type: "D-Check", description: "Structural overhaul and NDT", status: "scheduled", date: "2024-05-01", nextDue: "2024-05-15", daysRemaining: 44, technician: "Eng. Sharma" },
  { id: "5", aircraft: "VT-MNO (B787)", type: "A-Check", description: "Avionics update and calibration", status: "completed", date: "2024-03-10", nextDue: "2024-06-10", daysRemaining: 70, technician: "Eng. Rao" },
];

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  completed: { label: "Completed", icon: CheckCircle, color: "text-success", bg: "bg-success/10 border-success/20" },
  "in-progress": { label: "In Progress", icon: Clock, color: "text-neon-blue", bg: "bg-neon-blue/10 border-neon-blue/20" },
  scheduled: { label: "Scheduled", icon: CalendarDays, color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  overdue: { label: "Overdue", icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10 border-danger/20" },
};

const MaintenancePage = () => {
  const [filter, setFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = filter === "all" ? records : records.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Tracking</h1>
          <p className="text-sm text-muted-foreground">Timeline-based maintenance logs</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow gap-2">
          <Plus size={16} /> New Record
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "completed", "in-progress", "scheduled", "overdue"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border
              ${filter === f ? "bg-primary/15 text-primary border-primary/30" : "bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40"}`}>
            {f === "all" ? "All" : f.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border/30" />
        <div className="space-y-4">
          {filtered.map((r, i) => {
            const sc = statusConfig[r.status];
            const Icon = sc.icon;
            const progress = r.status === "completed" ? 100 : r.status === "overdue" ? 100 : Math.max(0, Math.min(100, ((75 - r.daysRemaining) / 75) * 100));
            return (
              <motion.div key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative pl-14"
              >
                {/* Timeline dot */}
                <div className={`absolute left-4 top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${sc.bg} ${sc.color}`}>
                  <Icon size={10} />
                </div>

                <div className="glass-card hover:border-primary/20 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm">{r.aircraft}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.type} · {r.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Technician: {r.technician}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>Date: {r.date}</p>
                      <p>Next: {r.nextDue}</p>
                    </div>
                  </div>

                  {/* Progress / countdown */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">Service Interval Progress</span>
                      <span className={r.daysRemaining < 0 ? "text-danger" : r.daysRemaining < 15 ? "text-warning" : "text-success"}>
                        {r.daysRemaining < 0 ? `${Math.abs(r.daysRemaining)}d overdue` : `${r.daysRemaining}d remaining`}
                      </span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full rounded-full ${r.status === "overdue" ? "bg-danger" : r.status === "completed" ? "bg-success" : "bg-primary"}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel neon-border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">New Maintenance Record</h2>
                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                {["Aircraft Registration", "Check Type (A/B/C/D)", "Description", "Assigned Technician", "Scheduled Date"].map(label => (
                  <div key={label}>
                    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                    <input className="w-full px-3 py-2 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
                  </div>
                ))}
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow mt-2"
                  onClick={() => setShowAddModal(false)}>
                  <Wrench size={16} className="mr-2" /> Create Record
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaintenancePage;
