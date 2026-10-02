 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Bell, Sun, Moon, MessageSquare, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useTwilioConfig } from "@/hooks/useDataStore";
import { useEffect } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { config, setConfig } = useTwilioConfig();
  const [draft, setDraft] = useState(config);
  useEffect(() => {
  setDraft(config);
}, [config]);
  const [showToken, setShowToken] = useState(false);

  const saveTwilio = () => {
    if (draft.fromNumber && !draft.fromNumber.startsWith("+")) {
      toast.error("From Number must be in E.164 format (e.g. +15558675310)");
      return;
    }
    if (draft.toNumber && !draft.toNumber.startsWith("+")) {
      toast.error("Receiver Number must be in E.164 format (e.g. +15558675310)");
      return;
    }
    setConfig(draft);
    toast.success("Twilio configuration saved");
  };

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
            <span className="text-sm text-foreground font-medium">{_optionalChain([user, 'optionalAccess', _ => _.name]) || "Admin"}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/20">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-sm text-foreground font-medium">{_optionalChain([user, 'optionalAccess', _2 => _2.role]) || "Administrator"}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/20">
            <span className="text-sm text-muted-foreground">Session</span>
            <span className="text-sm text-success font-medium">Active</span>
          </div>
        </div>
      </motion.div>

      {/* Twilio SMS */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
          <MessageSquare size={16} className="text-primary" /> Twilio SMS Alerts
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Configure credentials for the “Send Notification” button on the dashboard. Stored locally in your browser.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground">Account SID</label>
            <Input value={draft.accountSid} onChange={e => setDraft({ ...draft, accountSid: e.target.value })} placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" maxLength={64} autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground">Auth Token</label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                value={draft.authToken}
                onChange={e => setDraft({ ...draft, authToken: e.target.value })}
                placeholder="••••••••••••••••"
                maxLength={64}
                autoComplete="off"
                className="pr-10"
              />
              <button type="button" onClick={() => setShowToken(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Twilio Phone Number</label>
            <Input value={draft.fromNumber} onChange={e => setDraft({ ...draft, fromNumber: e.target.value })} placeholder="+15017122661" maxLength={20} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Receiver Phone Number</label>
            <Input value={draft.toNumber} onChange={e => setDraft({ ...draft, toNumber: e.target.value })} placeholder="+15558675310" maxLength={20} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={saveTwilio} size="sm" className="neon-glow">
            <Save size={14} className="mr-1" /> Save Credentials
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">
          Note: real SMS delivery requires a backend (browsers cannot call Twilio directly due to CORS & secret exposure).
          The dashboard button validates credentials and previews the message — connect Lovable Cloud to enable live sending.
        </p>
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
