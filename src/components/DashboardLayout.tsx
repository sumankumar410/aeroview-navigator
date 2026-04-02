import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import NotificationPanel from "./NotificationPanel";
import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border/20 glass-panel sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder="Search aircraft, logs..."
                className="pl-9 pr-4 py-1.5 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 w-64 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                A
              </div>
              <span className="text-sm text-foreground hidden sm:inline">Admin</span>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
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
