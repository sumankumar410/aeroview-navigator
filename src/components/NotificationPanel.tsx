import { motion } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";

const notifications = [
  { id: 1, type: "overdue", title: "Overdue: Engine Check - B737-800", time: "2h ago", icon: AlertTriangle },
  { id: 2, type: "due", title: "Due Soon: Landing Gear Inspection - A320", time: "5h ago", icon: Clock },
  { id: 3, type: "safe", title: "Completed: Avionics Update - B777-300", time: "1d ago", icon: CheckCircle },
  { id: 4, type: "due", title: "Scheduled: Hydraulic System - A380", time: "2d ago", icon: Wrench },
];

const typeStyles: Record<string, string> = {
  overdue: "text-danger bg-danger/10 border-danger/20",
  due: "text-warning bg-warning/10 border-warning/20",
  safe: "text-success bg-success/10 border-success/20",
};

const NotificationPanel = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="absolute right-4 top-16 w-80 glass-panel neon-border z-50 overflow-hidden"
  >
    <div className="flex items-center justify-between p-4 border-b border-border/20">
      <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
        <X size={16} />
      </button>
    </div>
    <div className="max-h-80 overflow-y-auto">
      {notifications.map((n, i) => (
        <motion.div key={n.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-3 p-3 border-b border-border/10 hover:bg-muted/30 transition-colors cursor-pointer"
        >
          <div className={`p-1.5 rounded-lg border ${typeStyles[n.type]}`}>
            <n.icon size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground leading-snug">{n.title}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default NotificationPanel;
