import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Download, Eye, Trash2, File, Image, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Report {
  id: string;
  name: string;
  type: "pdf" | "image" | "spreadsheet";
  aircraft: string;
  uploadedAt: string;
  size: string;
}

const mockReports: Report[] = [
  { id: "1", name: "Engine_Inspection_VT-ABC.pdf", type: "pdf", aircraft: "VT-ABC", uploadedAt: "2024-03-15", size: "2.4 MB" },
  { id: "2", name: "Landing_Gear_Photos_VT-DEF.jpg", type: "image", aircraft: "VT-DEF", uploadedAt: "2024-03-12", size: "5.1 MB" },
  { id: "3", name: "Maintenance_Log_Q1.xlsx", type: "spreadsheet", aircraft: "Fleet", uploadedAt: "2024-03-10", size: "1.8 MB" },
  { id: "4", name: "Avionics_Report_VT-GHI.pdf", type: "pdf", aircraft: "VT-GHI", uploadedAt: "2024-03-08", size: "3.2 MB" },
];

const typeIcons = { pdf: FileText, image: Image, spreadsheet: FileSpreadsheet };

const ReportsPage = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Documents</h1>
        <p className="text-sm text-muted-foreground">Inspection reports and maintenance documents</p>
      </div>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag}
        onDrop={e => { e.preventDefault(); setDragActive(false); }}
        className={`glass-card border-2 border-dashed transition-all text-center py-12 cursor-pointer
          ${dragActive ? "border-primary/60 bg-primary/5" : "border-border/30 hover:border-primary/30"}`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-sm text-foreground font-medium">Drag & drop files here</p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse · PDF, JPG, XLSX up to 50MB</p>
        <Button variant="outline" className="mt-4 text-xs border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40">
          <Upload size={14} className="mr-2" /> Browse Files
        </Button>
      </motion.div>

      {/* Files grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockReports.map((r, i) => {
          const Icon = typeIcons[r.type];
          return (
            <motion.div key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card hover-lift flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                <p className="text-[10px] text-muted-foreground">{r.aircraft} · {r.size} · {r.uploadedAt}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-primary"><Eye size={14} /></button>
                <button className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-primary"><Download size={14} /></button>
                <button className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-danger"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsPage;
