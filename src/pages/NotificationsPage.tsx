import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Wrench, Bell, Filter } from "lucide-react";
import { useState } from "react";

const allNotifications = [
  { id: 1, type: "overdue", title: "Engine Check Overdue", desc: "B737-800 (VT-ABC) engine turbine inspection is 12 days overdue.", time: "2 hours ago", icon: AlertTriangle, read: false },
  { id: 2, type: "due", title: "Landing Gear Inspection Due", desc: "A320neo (VT-DEF) landing gear check due in 8 days.", time: "5 hours ago", icon: Clock, read: false },
  { id: 3, type: "completed", title: "Avionics Update Complete", desc: "B777-300ER (VT-GHI) avionics software updated successfully.", time: "1 day ago", icon: CheckCircle, read: true },
  { id: 4, type: "due", title: "Hydraulic System Scheduled", desc: "A380 (VT-JKL) hydraulic pump replacement scheduled for next week.", time: "2 days ago", icon: Wrench, read: true },
  { id: 5, type: "overdue", title: "Structural Inspection Overdue", desc: "B787-9 (VT-MNO) D-Check structural inspection is 5 days overdue.", time: "3 days ago", icon: AlertTriangle, read: false },
  { id: 6, type: "completed", title: "Routine A-Check Complete", desc: "A350-900 (VT-PQR) routine inspection completed by Eng. Sharma.", time: "4 days ago", icon: CheckCircle, read: true },
];

const typeStyles: Record<string, string> = {
  overdue: "text-danger bg-danger/10 border-danger/20",
  due: "text-warning bg-warning/10 border-warning/20",
  completed: "text-success bg-success/10 border-success/20",
};

const NotificationsPage = () => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? allNotifications : allNotifications.filter(n => n.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="text-primary" size={24} /> Notifications
          </h1>
          <p className="text-sm text-muted-foreground">{allNotifications.filter(n => !n.read).length} unread alerts</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "overdue", "due", "completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border
              ${filter === f ? "bg-primary/15 text-primary border-primary/30" : "bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((n, i) => (
          <motion.div key={n.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card flex items-start gap-4 transition-all hover:border-primary/20 ${!n.read ? "border-l-2 border-l-primary" : ""}`}
          >
            <div className={`p-2 rounded-lg border ${typeStyles[n.type]}`}>
              <n.icon size={16} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">{n.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-2">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
