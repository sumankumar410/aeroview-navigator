import { motion } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Clock, Wrench, CheckCheck } from "lucide-react";
import { AppNotification } from "@/hooks/useDataStore";

const typeStyles: Record<string, string> = {
  overdue: "text-danger bg-danger/10 border-danger/20",
  due: "text-warning bg-warning/10 border-warning/20",
  completed: "text-success bg-success/10 border-success/20",
  info: "text-primary bg-primary/10 border-primary/20",
};

const typeIcons: Record<string, typeof AlertTriangle> = {
  overdue: AlertTriangle,
  due: Clock,
  completed: CheckCircle,
  info: Wrench,
};

interface Props {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const NotificationPanel = ({ notifications, onClose, onMarkRead, onMarkAllRead }: Props) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="absolute right-4 top-16 w-80 glass-panel neon-border z-50 overflow-hidden"
  >
    <div className="flex items-center justify-between p-4 border-b border-border/20">
      <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
      <div className="flex items-center gap-2">
        <button onClick={onMarkAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
          <CheckCheck size={12} /> Mark all read
        </button>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>
    </div>
    <div className="max-h-80 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground text-sm">No notifications</div>
      ) : (
        notifications.map((n, i) => {
          const Icon = typeIcons[n.type] || Wrench;
          return (
            <motion.div key={n.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onMarkRead(n.id)}
              className={`flex items-start gap-3 p-3 border-b border-border/10 hover:bg-muted/30 transition-colors cursor-pointer
                ${!n.read ? "bg-primary/5" : ""}`}
            >
              <div className={`p-1.5 rounded-lg border ${typeStyles[n.type]}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-snug font-medium">{n.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{n.description}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
            </motion.div>
          );
        })
      )}
    </div>
  </motion.div>
);

export default NotificationPanel;
