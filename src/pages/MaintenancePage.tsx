import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Plus, Clock, CheckCircle, AlertTriangle, X, CalendarDays, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMaintenanceStore, useAircraftStore, exportToJSON, exportToCSV } from "@/hooks/useDataStore";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  completed: { label: "Completed", icon: CheckCircle, color: "text-success", bg: "bg-success/10 border-success/20" },
  "in-progress": { label: "In Progress", icon: Clock, color: "text-neon-blue", bg: "bg-neon-blue/10 border-neon-blue/20" },
  scheduled: { label: "Scheduled", icon: CalendarDays, color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  overdue: { label: "Overdue", icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10 border-danger/20" },
};

const MaintenancePage = () => {
  const { records, addRecord, deleteRecord, markComplete } = useMaintenanceStore();
  const { aircraft } = useAircraftStore();
  const [filter, setFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({ aircraftId: "", type: "", description: "", date: "", nextDue: "", technician: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return filter === "all" ? records : records.filter(r => r.status === filter);
  }, [records, filter]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.aircraftId) e.aircraftId = "Required";
    if (!form.type.trim()) e.type = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.date) e.date = "Required";
    if (!form.nextDue) e.nextDue = "Required";
    if (!form.technician.trim()) e.technician = "Required";
    if (form.date && form.nextDue && new Date(form.nextDue) <= new Date(form.date)) e.nextDue = "Must be after date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const ac = aircraft.find(a => a.id === form.aircraftId);
    addRecord({
      aircraftId: form.aircraftId,
      aircraftReg: ac ? `${ac.registration} (${ac.model})` : form.aircraftId,
      type: form.type,
      description: form.description,
      date: form.date,
      nextDue: form.nextDue,
      technician: form.technician,
    });
    toast.success("Maintenance record created");
    setShowAddModal(false);
    setForm({ aircraftId: "", type: "", description: "", date: "", nextDue: "", technician: "" });
  };

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setShowDeleteConfirm(null);
    toast.success("Record deleted");
  };

  const handleComplete = (id: string) => {
    markComplete(id);
    toast.success("Marked as completed");
  };

  const FormField = ({ label, field, type = "text" }: { label: string; field: string; type?: string }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input type={type} value={(form as any)[field]}
        onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
        className={`w-full px-3 py-2 bg-muted/40 border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40
          ${errors[field] ? "border-danger/50" : "border-border/30"}`}
      />
      {errors[field] && <p className="text-[10px] text-danger mt-0.5">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Tracking</h1>
          <p className="text-sm text-muted-foreground">{records.length} records · Timeline view</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToJSON(records, "maintenance.json")}
            className="text-xs border-border/40 text-muted-foreground hover:text-primary">
            <Download size={14} className="mr-1" /> Export
          </Button>
          <Button onClick={() => { setErrors({}); setShowAddModal(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow gap-2 text-xs">
            <Plus size={14} /> New Record
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "completed", "in-progress", "scheduled", "overdue"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border
              ${filter === f ? "bg-primary/15 text-primary border-primary/30" : "bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40"}`}>
            {f === "all" ? `All (${records.length})` : f.replace("-", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card text-center py-12">
          <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No records found</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border/30" />
          <div className="space-y-4">
            {filtered.map((r, i) => {
              const sc = statusConfig[r.status] || statusConfig["scheduled"];
              const Icon = sc.icon;
              const progress = r.status === "completed" ? 100 : r.status === "overdue" ? 100 : Math.max(0, Math.min(100, ((90 - r.daysRemaining) / 90) * 100));
              return (
                <motion.div key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-14"
                >
                  <div className={`absolute left-4 top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${sc.bg} ${sc.color}`}>
                    <Icon size={10} />
                  </div>
                  <div className="glass-card hover:border-primary/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground text-sm">{r.aircraftReg}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${sc.bg} ${sc.color}`}>
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{r.type} · {r.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Technician: {r.technician}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-xs text-muted-foreground">
                          <p>Date: {r.date}</p>
                          <p>Next: {r.nextDue}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {r.status !== "completed" && (
                            <button onClick={() => handleComplete(r.id)}
                              className="p-1 rounded hover:bg-success/20 text-muted-foreground hover:text-success transition-colors" title="Mark complete">
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button onClick={() => setShowDeleteConfirm(r.id)}
                            className="p-1 rounded hover:bg-danger/20 text-muted-foreground hover:text-danger transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
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
                          transition={{ duration: 1, delay: i * 0.08 }}
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
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-panel neon-border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">New Maintenance Record</h2>
                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Aircraft</label>
                  <select value={form.aircraftId} onChange={e => setForm(p => ({ ...p, aircraftId: e.target.value }))}
                    className={`w-full px-3 py-2 bg-muted/40 border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40
                      ${errors.aircraftId ? "border-danger/50" : "border-border/30"}`}>
                    <option value="">Select aircraft...</option>
                    {aircraft.map(a => <option key={a.id} value={a.id}>{a.registration} - {a.type} {a.model}</option>)}
                  </select>
                  {errors.aircraftId && <p className="text-[10px] text-danger mt-0.5">{errors.aircraftId}</p>}
                </div>
                <FormField label="Check Type (A/B/C/D)" field="type" />
                <FormField label="Description" field="description" />
                <FormField label="Technician" field="technician" />
                <FormField label="Date" field="date" type="date" />
                <FormField label="Next Due Date" field="nextDue" type="date" />
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow mt-2" onClick={handleSubmit}>
                  <Wrench size={16} className="mr-2" /> Create Record
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel neon-border p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
              <Trash2 className="w-10 h-10 text-danger mx-auto mb-3" />
              <h3 className="text-foreground font-semibold mb-2">Delete Record?</h3>
              <p className="text-sm text-muted-foreground mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-border/40 text-muted-foreground" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
                <Button className="flex-1 bg-danger hover:bg-danger/90 text-foreground" onClick={() => handleDelete(showDeleteConfirm)}>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaintenancePage;
