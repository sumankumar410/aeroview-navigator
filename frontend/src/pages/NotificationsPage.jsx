import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Wrench, Bell, CheckCheck } from "lucide-react";
import { useNotificationStore, useAircraftStore, useMaintenanceStore } from "@/hooks/useDataStore";
import { useEffect, useState } from "react";

const typeStyles = {
  overdue: "text-danger bg-danger/10 border-danger/20",
  due: "text-warning bg-warning/10 border-warning/20",
  completed: "text-success bg-success/10 border-success/20",
  info: "text-primary bg-primary/10 border-primary/20",
};

const typeIcons = {
  overdue: AlertTriangle,
  due: Clock,
  completed: CheckCircle,
  info: Wrench,
};

const NotificationsPage = () => {
  const { aircraft } = useAircraftStore();
  const { records } = useMaintenanceStore();
  const { notifications, generateNotifications, markRead, markAllRead, unreadCount } = useNotificationStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    generateNotifications(aircraft, records);
  }, [aircraft, records, generateNotifications]);

  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="text-primary" size={24} /> Notifications
          </h1>
          <p className="text-sm text-muted-foreground">{unreadCount} unread alerts</p>
        </div>
        <button onClick={markAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-primary hover:bg-primary/10 transition-colors border border-primary/20">
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "overdue", "due", "completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border
              ${filter === f ? "bg-primary/15 text-primary border-primary/30" : "bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40"}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card text-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n, i) => {
            const Icon = typeIcons[n.type] || Wrench;
            return (
              <motion.div key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => markRead(n.id)}
                className={`glass-card flex items-start gap-4 transition-all hover:border-primary/20 cursor-pointer
                  ${!n.read ? "border-l-2 border-l-primary bg-primary/5" : ""}`}
              >
                <div className={`p-2 rounded-lg border ${typeStyles[n.type]}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground">{n.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
