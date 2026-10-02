 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Eye, Trash2, FileText, Image as ImageIcon, FileSpreadsheet, File, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileStore, } from "@/hooks/useDataStore";
import ReportViewerModal from "@/components/ReportViewerModal";
import TiltCard from "@/components/TiltCard";
import { toast } from "sonner";

const typeIcons = { pdf: FileText, image: ImageIcon, spreadsheet: FileSpreadsheet };

function getFileType(name) {
  const ext = _optionalChain([name, 'access', _ => _.split, 'call', _2 => _2("."), 'access', _3 => _3.pop, 'call', _4 => _4(), 'optionalAccess', _5 => _5.toLowerCase, 'call', _6 => _6()]) || "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["xlsx", "xls", "csv"].includes(ext)) return "spreadsheet";
  return "other";
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB to keep localStorage safe

const ReportsPage = () => {
  const { files, addFile, deleteFile } = useFileStore();
  const [dragActive, setDragActive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [form, setForm] = useState({ title: "", aircraft: "", date: "", description: "" });
  const fileInputRef = useRef(null);
  const [viewing, setViewing] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const openFormWithFile = (file) => {
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`File too large (max ${MAX_FILE_BYTES / 1024 / 1024}MB for browser storage)`);
      return;
    }
    setPendingFile(file);
    setForm({ title: file.name.replace(/\.[^.]+$/, ""), aircraft: "", date: new Date().toISOString().split("T")[0], description: "" });
    setShowForm(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = _optionalChain([e, 'access', _7 => _7.dataTransfer, 'access', _8 => _8.files, 'optionalAccess', _9 => _9[0]]);
    if (f) openFormWithFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pendingFile) return;
    if (!form.title.trim() || !form.aircraft.trim()) {
      toast.error("Title and Aircraft ID are required");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      addFile({
        name: pendingFile.name,
        type: getFileType(pendingFile.name),
        size: formatSize(pendingFile.size),
        aircraft: form.aircraft,
        title: form.title,
        description: form.description,
        reportDate: form.date,
        dataUrl: reader.result ,
        mimeType: pendingFile.type,
      });
      toast.success("Report uploaded");
      setShowForm(false);
      setPendingFile(null);
    };
    reader.onerror = () => toast.error("Failed to read file");
    reader.readAsDataURL(pendingFile);
  };

  const handleView = (file) => {
    setViewing(file);
  };

  const handleDeleteFile = (id) => {
    deleteFile(id);
    toast.success("Report removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Documents</h1>
          <p className="text-sm text-muted-foreground">{files.length} reports · Upload PDF, image or spreadsheet</p>
        </div>
        <Button onClick={() => _optionalChain([fileInputRef, 'access', _10 => _10.current, 'optionalAccess', _11 => _11.click, 'call', _12 => _12()])} className="neon-glow">
          <Plus size={16} className="mr-1" /> Add Report
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.xlsx,.xls,.csv"
          onChange={(e) => { const f = _optionalChain([e, 'access', _13 => _13.target, 'access', _14 => _14.files, 'optionalAccess', _15 => _15[0]]); if (f) openFormWithFile(f); e.target.value = ""; }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => _optionalChain([fileInputRef, 'access', _16 => _16.current, 'optionalAccess', _17 => _17.click, 'call', _18 => _18()])}
        className={`glass-card border-2 border-dashed transition-all text-center py-10 cursor-pointer
          ${dragActive ? "border-primary/60 bg-primary/5 scale-[1.01]" : "border-border/30 hover:border-primary/30"}`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-sm text-foreground font-medium">
          {dragActive ? "Drop file here" : "Drag & drop a report here"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse · max 4MB</p>
      </motion.div>

      {/* Modal form */}
      {showForm && pendingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="glass-panel p-6 w-full max-w-md space-y-4 neon-border relative"
          >
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Report Details</h2>
              <p className="text-xs text-muted-foreground truncate">{pendingFile.name} · {formatSize(pendingFile.size)}</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Title *</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxLength={100} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Aircraft ID *</label>
                <Input value={form.aircraft} onChange={e => setForm({ ...form, aircraft: e.target.value })} placeholder="VT-ABC" maxLength={20} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Report Date</label>
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  maxLength={500}
                  rows={3}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="neon-glow">Upload</Button>
            </div>
          </motion.form>
        </div>
      )}

      {files.length === 0 ? (
        <div className="glass-card text-center py-12">
          <File className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No reports uploaded</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((r, i) => {
            const Icon = typeIcons[r.type] || File;
            return (
              <TiltCard key={r.id} max={8}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleView(r)}
                  className="glass-card flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 neon-glow">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.title || r.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.aircraft} · {r.size} · {r.reportDate || r.uploadedAt}</p>
                    {r.description && <p className="text-[10px] text-muted-foreground truncate mt-0.5">{r.description}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-primary"
                      onClick={(e) => { e.stopPropagation(); handleView(r); }} aria-label="View report">
                      <Eye size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(r.id); }}
                      className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-danger" aria-label="Delete report">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              </TiltCard>
            );
          })}
        </div>
      )}

      <ReportViewerModal file={viewing} onClose={() => setViewing(null)} />
    </div>
  );
};

export default ReportsPage;
