import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import NotificationPanel from "./NotificationPanel";
import { useState, useEffect } from "react";
import { Bell, Search, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationStore, useAircraftStore, useMaintenanceStore } from "@/hooks/useDataStore";

const DashboardLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const { user } = useAuth();
  const { aircraft } = useAircraftStore();
  const { records } = useMaintenanceStore();
  const { notifications, generateNotifications, unreadCount, markRead, markAllRead } = useNotificationStore();

  // Auto-generate notifications based on data
  useEffect(() => {
    generateNotifications(aircraft, records);
  }, [aircraft, records, generateNotifications]);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
      if (e.key === "Escape") {
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-6 border-b border-border/20 glass-panel sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input id="global-search" placeholder="Search... (Ctrl+K)"
                value={globalSearch} onChange={e => setGlobalSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 w-64 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-danger rounded-full text-[10px] font-bold text-foreground px-1"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="text-sm text-foreground hidden sm:inline">{user?.name || "Admin"}</span>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkRead={markRead}
              onMarkAllRead={markAllRead}
            />
          )}
        </AnimatePresence>

        <main className="flex-1 p-6 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
