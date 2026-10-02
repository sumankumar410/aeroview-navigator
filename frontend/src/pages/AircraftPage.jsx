 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Plus, Search, Edit, Trash2, Eye, X, Upload, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

import { useEffect } from "react";











const statusConfig = {
  safe: { label: "Safe", class: "status-safe" },
  due: { label: "Due", class: "status-due" },
  overdue: { label: "Overdue", class: "status-overdue" },
};

const emptyForm = { registration: "", type: "", model: "", totalHours: 0, lastCheck: "", nextCheck: "" };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AircraftPage = () => {
const [aircraft, setAircraft] = useState([]);


useEffect(() => {
  fetchAircraft();
}, []);

const fetchAircraft = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/aircraft`);

    // fix Mongo _id → id
    const data = res.data.map((a) => ({
      ...a,
      id: a._id
    }));

    setAircraft(data);
  } catch (err) {
    toast.error("Failed to load aircraft");
  }
};
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("cards");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sortKey, setSortKey] = useState("registration");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let list = aircraft.filter(a =>
      (a.registration.toLowerCase().includes(search.toLowerCase()) ||
       a.model.toLowerCase().includes(search.toLowerCase()) ||
       a.type.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" || a.status === statusFilter)
    );
    list.sort((a, b) => {
      const aVal = String((a )[sortKey] || "");
      const bVal = String((b )[sortKey] || "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return list;
  }, [aircraft, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const validate = () => {
    const e = {};
    if (!form.registration.trim()) e.registration = "Required";
    if (!form.type.trim()) e.type = "Required";
    if (!form.model.trim()) e.model = "Required";
    if (form.totalHours < 0) e.totalHours = "Must be >= 0";
    if (!form.lastCheck) e.lastCheck = "Required";
    if (!form.nextCheck) e.nextCheck = "Required";
    if (form.lastCheck && form.nextCheck && new Date(form.nextCheck) <= new Date(form.lastCheck)) {
      e.nextCheck = "Must be after last check";
    }
    // Check duplicate registration (excluding current edit)
    if (form.registration && aircraft.some(a => a.registration === form.registration.trim() && a.id !== editingId)) {
      e.registration = "Already exists";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setErrors({}); setShowModal(true); };
  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({ registration: a.registration, type: a.type, model: a.model, totalHours: a.totalHours, lastCheck: a.lastCheck, nextCheck: a.nextCheck });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async () => {
  if (!validate()) return;

  try {
    if (editingId) {
      await axios.put(`${API_URL}/api/aircraft/${editingId}`, form);
      toast.success(`Aircraft updated`);
    } else {
      await axios.post(`${API_URL}/api/aircraft`, form);
      toast.success(`Aircraft added`);
    }

    fetchAircraft(); // refresh list
    setShowModal(false);

  } catch (err) {
    toast.error(_optionalChain([err, 'access', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.error]) || "Error");
  }
};
const handleDelete = async (id) => {
  try {
    const ac = aircraft.find(a => a.id === id);

    await axios.delete(`${API_URL}/api/aircraft/${id}`);

    toast.success(`Aircraft ${_optionalChain([ac, 'optionalAccess', _4 => _4.registration]) || ""} deleted`);
    setShowDeleteConfirm(null);
    fetchAircraft();

  } catch (e2) {
    toast.error("Delete failed");
  }
};
 const handleImport = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(_optionalChain([ev, 'access', _5 => _5.target, 'optionalAccess', _6 => _6.result]) );

        if (Array.isArray(data)) {
          for (const item of data) {
            if (item.registration && item.type && item.model) {
              await axios.post(`${API_URL}/api/aircraft`, {
                registration: item.registration,
                type: item.type,
                model: item.model,
                totalHours: item.totalHours || 0,
                lastCheck: item.lastCheck,
                nextCheck: item.nextCheck,
              });
            }
          }

          toast.success(`Imported ${data.length} aircraft`);
          fetchAircraft();
        }

      } catch (e3) {
        toast.error("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

  input.click();
};

  const InputField = ({ label, field, type = "text" }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input type={type}
        value={(form )[field]}
        onChange={e => setForm(prev => ({ ...prev, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
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
          <h1 className="text-2xl font-bold text-foreground">Aircraft Fleet</h1>
          <p className="text-sm text-muted-foreground">{aircraft.length} registered aircraft</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleImport}
            className="text-xs border-border/40 text-muted-foreground hover:text-primary">
            <Upload size={14} className="mr-1" /> Import
          </Button>
          <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow gap-2 text-xs">
            <Plus size={14} /> Add Aircraft
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search aircraft..."
            className="w-full pl-9 pr-4 py-2 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" />
        </div>
        <div className="flex gap-1">
          {["all", "safe", "due", "overdue"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border
                ${statusFilter === s ? "bg-primary/15 text-primary border-primary/30" : "bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-border/30 overflow-hidden">
          {(["cards", "table"] ).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${viewMode === m ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted/40"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card text-center py-12">
          <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No aircraft found</p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a, i) => (
            <motion.div key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
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
                  <span className="text-muted-foreground">Next Check</span>
                  <p className="font-semibold text-foreground mt-0.5">{a.nextCheck}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => setShowDetail(a)} className="flex-1 text-xs h-8 text-muted-foreground hover:text-primary"><Eye size={14} className="mr-1" /> View</Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(a)} className="flex-1 text-xs h-8 text-muted-foreground hover:text-primary"><Edit size={14} className="mr-1" /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(a.id)} className="text-xs h-8 text-muted-foreground hover:text-danger"><Trash2 size={14} /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                {[
                  { key: "registration", label: "Registration" },
                  { key: "type", label: "Type" },
                  { key: "model", label: "Model" },
                  { key: "status", label: "Status" },
                  { key: "totalHours", label: "Hours" },
                  { key: "lastCheck", label: "Last Check" },
                  { key: "nextCheck", label: "Next Check" },
                ].map(h => (
                  <th key={h.key} onClick={() => toggleSort(h.key)}
                    className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none">
                    <span className="flex items-center gap-1">{h.label} <ArrowUpDown size={10} /></span>
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Actions</th>
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
                      <button onClick={() => setShowDetail(a)} className="p-1 hover:text-primary text-muted-foreground"><Eye size={14} /></button>
                      <button onClick={() => openEdit(a)} className="p-1 hover:text-primary text-muted-foreground"><Edit size={14} /></button>
                      <button onClick={() => setShowDeleteConfirm(a.id)} className="p-1 hover:text-danger text-muted-foreground"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-panel neon-border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">{editingId ? "Edit" : "Add"} Aircraft</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <InputField label="Registration No." field="registration" />
                <InputField label="Aircraft Type (e.g. Boeing)" field="type" />
                <InputField label="Model (e.g. 737-800)" field="model" />
                <InputField label="Total Flight Hours" field="totalHours" type="number" />
                <InputField label="Last Check Date" field="lastCheck" type="date" />
                <InputField label="Next Check Date" field="nextCheck" type="date" />
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow mt-2" onClick={handleSubmit}>
                  {editingId ? <><Edit size={16} className="mr-2" /> Update Aircraft</> : <><Plus size={16} className="mr-2" /> Add Aircraft</>}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetail(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel neon-border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">{showDetail.registration}</h2>
                <button onClick={() => setShowDetail(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ["Type", `${showDetail.type} ${showDetail.model}`],
                  ["Status", showDetail.status.toUpperCase()],
                  ["Total Hours", showDetail.totalHours.toLocaleString()],
                  ["Last Check", showDetail.lastCheck],
                  ["Next Check", showDetail.nextCheck],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between p-2 rounded bg-muted/20">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="text-foreground font-medium">{v}</span>
                  </div>
                ))}
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
              <h3 className="text-foreground font-semibold mb-2">Delete Aircraft?</h3>
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

export default AircraftPage;
