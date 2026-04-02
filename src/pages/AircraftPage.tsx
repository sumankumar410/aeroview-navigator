import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Plus, Search, Filter, Edit, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Aircraft {
  id: string;
  registration: string;
  type: string;
  model: string;
  status: "safe" | "due" | "overdue";
  totalHours: number;
  lastCheck: string;
  nextCheck: string;
}

const mockAircraft: Aircraft[] = [
  { id: "1", registration: "VT-ABC", type: "Boeing", model: "737-800", status: "safe", totalHours: 24500, lastCheck: "2024-03-15", nextCheck: "2024-06-15" },
  { id: "2", registration: "VT-DEF", type: "Airbus", model: "A320neo", status: "due", totalHours: 18200, lastCheck: "2024-01-10", nextCheck: "2024-04-10" },
  { id: "3", registration: "VT-GHI", type: "Boeing", model: "777-300ER", status: "overdue", totalHours: 35800, lastCheck: "2023-11-20", nextCheck: "2024-02-20" },
  { id: "4", registration: "VT-JKL", type: "Airbus", model: "A380-800", status: "safe", totalHours: 12400, lastCheck: "2024-03-01", nextCheck: "2024-06-01" },
  { id: "5", registration: "VT-MNO", type: "Boeing", model: "787-9", status: "safe", totalHours: 8900, lastCheck: "2024-02-28", nextCheck: "2024-05-28" },
  { id: "6", registration: "VT-PQR", type: "Airbus", model: "A350-900", status: "due", totalHours: 15600, lastCheck: "2024-01-25", nextCheck: "2024-04-25" },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  safe: { label: "Safe", class: "status-safe" },
  due: { label: "Due", class: "status-due" },
  overdue: { label: "Overdue", class: "status-overdue" },
};

const AircraftPage = () => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockAircraft.filter(a =>
    a.registration.toLowerCase().includes(search.toLowerCase()) ||
    a.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aircraft Fleet</h1>
          <p className="text-sm text-muted-foreground">{mockAircraft.length} registered aircraft</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow gap-2">
          <Plus size={16} /> Add Aircraft
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search aircraft..."
            className="w-full pl-9 pr-4 py-2 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" />
        </div>
        <div className="flex rounded-lg border border-border/30 overflow-hidden">
          {(["cards", "table"] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${viewMode === m ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted/40"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Cards view */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a, i) => (
            <motion.div key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card hover-lift group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{a.registration}</h3>
                    <p className="text-xs text-muted-foreground">{a.type} {a.model}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase border ${statusConfig[a.status].class}`}>
                  {statusConfig[a.status].label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 rounded bg-muted/20">
                  <span className="text-muted-foreground">Flight Hours</span>
                  <p className="font-semibold text-foreground mt-0.5">{a.totalHours.toLocaleString()}</p>
                </div>
                <div className="p-2 rounded bg-muted/20">
                  <span className="text-muted-foreground">Last Check</span>
                  <p className="font-semibold text-foreground mt-0.5">{a.lastCheck}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 text-muted-foreground hover:text-primary"><Eye size={14} className="mr-1" /> View</Button>
                <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 text-muted-foreground hover:text-primary"><Edit size={14} className="mr-1" /> Edit</Button>
                <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground hover:text-danger"><Trash2 size={14} /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                {["Registration", "Type", "Model", "Status", "Hours", "Last Check", "Next Check", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{a.registration}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.model}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${statusConfig[a.status].class}`}>
                      {statusConfig[a.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.totalHours.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.lastCheck}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.nextCheck}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1 hover:text-primary text-muted-foreground"><Eye size={14} /></button>
                      <button className="p-1 hover:text-primary text-muted-foreground"><Edit size={14} /></button>
                      <button className="p-1 hover:text-danger text-muted-foreground"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Aircraft Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel neon-border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Add New Aircraft</h2>
                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                {["Registration No.", "Aircraft Type", "Model", "Total Flight Hours"].map(label => (
                  <div key={label}>
                    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                    <input className="w-full px-3 py-2 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
                  </div>
                ))}
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow mt-2"
                  onClick={() => setShowAddModal(false)}>
                  <Plus size={16} className="mr-2" /> Add Aircraft
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AircraftPage;
