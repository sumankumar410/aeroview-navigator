import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Eye, Trash2, FileText, Image, FileSpreadsheet, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileStore } from "@/hooks/useDataStore";
import { toast } from "sonner";

const typeIcons: Record<string, typeof FileText> = { pdf: FileText, image: Image, spreadsheet: FileSpreadsheet };

function getFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["xlsx", "xls", "csv"].includes(ext)) return "spreadsheet";
  return "other";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

const ReportsPage = () => {
  const { files, addFile, deleteFile } = useFileStore();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      addFile({
        name: file.name,
        type: getFileType(file.name),
        size: formatSize(file.size),
        aircraft: "Unassigned",
      });
    });
    toast.success(`${fileList.length} file(s) uploaded`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  const handleBrowse = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e: any) => {
      if (e.target.files.length) processFiles(e.target.files);
    };
    input.click();
  };

  const handleDeleteFile = (id: string) => {
    deleteFile(id);
    toast.success("File removed");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Documents</h1>
        <p className="text-sm text-muted-foreground">{files.length} documents · Drag & drop to upload</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleBrowse}
        className={`glass-card border-2 border-dashed transition-all text-center py-12 cursor-pointer
          ${dragActive ? "border-primary/60 bg-primary/5 scale-[1.01]" : "border-border/30 hover:border-primary/30"}`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-sm text-foreground font-medium">
          {dragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse · PDF, JPG, XLSX supported</p>
      </motion.div>

      {files.length === 0 ? (
        <div className="glass-card text-center py-12">
          <File className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No documents uploaded</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((r, i) => {
            const Icon = typeIcons[r.type] || File;
            return (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
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
                  <button className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-primary"
                    onClick={() => toast.info(`Preview: ${r.name}`)}>
                    <Eye size={14} />
                  </button>
                  <button onClick={() => handleDeleteFile(r.id)}
                    className="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
