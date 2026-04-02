import { motion } from "framer-motion";
import { User, Shield, Bell, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration and preferences</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          {theme === "dark" ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-primary" />} Appearance
        </h2>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
          <div>
            <p className="text-sm text-foreground">Theme</p>
            <p className="text-xs text-muted-foreground">Switch between dark and light mode</p>
          </div>
          <button onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors border border-primary/20">
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <User size={16} className="text-primary" /> Profile
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between p-3 rounded-lg bg-muted/20">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm text-foreground font-medium">{user?.name || "Admin"}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/20">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-sm text-foreground font-medium">{user?.role || "Administrator"}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/20">
            <span className="text-sm text-muted-foreground">Session</span>
            <span className="text-sm text-success font-medium">Active</span>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <Bell size={16} className="text-primary" /> Notifications
        </h2>
        <div className="space-y-3">
          {["Email alerts for overdue maintenance", "Push notifications for due tasks", "Weekly fleet status summary"].map(opt => (
            <label key={opt} className="flex items-center gap-3 text-sm text-foreground cursor-pointer p-2 rounded hover:bg-muted/20 transition-colors">
              <input type="checkbox" defaultChecked className="accent-primary" />
              {opt}
            </label>
          ))}
        </div>
      </motion.div>

      {/* Data management */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <Shield size={16} className="text-primary" /> Data Management
        </h2>
        <div className="flex gap-3">
          <Button variant="outline" size="sm"
            className="text-xs border-border/40 text-muted-foreground hover:text-danger hover:border-danger/40"
            onClick={() => {
              localStorage.clear();
              toast.success("All data cleared. Refresh to reload defaults.");
            }}>
            Reset All Data
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Keyboard shortcuts: Ctrl+K (search) · Esc (close panels)
        </p>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
