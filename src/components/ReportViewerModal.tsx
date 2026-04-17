import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedFile } from "@/hooks/useDataStore";

interface Props {
  file: UploadedFile | null;
  onClose: () => void;
}

const ReportViewerModal = ({ file, onClose }: Props) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [file, onClose]);

  const renderContent = () => {
    if (!file?.dataUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p>No preview available for this report.</p>
        </div>
      );
    }
    const mime = file.mimeType || "";
    if (mime.startsWith("image/")) {
      return <img src={file.dataUrl} alt={file.title || file.name} className="max-w-full max-h-full object-contain mx-auto" />;
    }
    if (mime === "application/pdf") {
      return <iframe src={file.dataUrl} title={file.title || file.name} className="w-full h-full border-0 rounded-md bg-white" />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <p>This file type can't be previewed inline.</p>
        <a href={file.dataUrl} download={file.name} className="text-primary underline">Download {file.name}</a>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={file.title || file.name}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel neon-border w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
          >
            <header className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border/30">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-foreground truncate">{file.title || file.name}</h2>
                <p className="text-[11px] text-muted-foreground truncate">
                  {file.aircraft} · {file.size} · {file.reportDate || file.uploadedAt}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {file.dataUrl && (
                  <>
                    <a href={file.dataUrl} download={file.name}
                      className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/40 transition-colors"
                      aria-label="Download report">
                      <Download size={16} />
                    </a>
                    <a href={file.dataUrl} target="_blank" rel="noreferrer"
                      className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/40 transition-colors"
                      aria-label="Open in new tab">
                      <ExternalLink size={16} />
                    </a>
                  </>
                )}
                <Button ref={closeRef} variant="ghost" size="icon" onClick={onClose} aria-label="Close viewer">
                  <X size={18} />
                </Button>
              </div>
            </header>
            {file.description && (
              <p className="px-5 py-2 text-xs text-muted-foreground border-b border-border/20 truncate">{file.description}</p>
            )}
            <div className="flex-1 overflow-auto bg-muted/10 p-3">
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportViewerModal;
