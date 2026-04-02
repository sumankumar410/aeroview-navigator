import { motion } from "framer-motion";
import { Settings, User, Shield, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const SettingsPage = () => (
  <div className="space-y-6 max-w-2xl">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="text-sm text-muted-foreground">System configuration and preferences</p>
    </div>

    {[
      { title: "Profile", icon: User, fields: ["Full Name", "Email Address", "Role"] },
      { title: "Security", icon: Shield, fields: ["Current Password", "New Password", "Confirm Password"] },
      { title: "Notifications", icon: Bell, fields: [] },
    ].map((section, i) => (
      <motion.div key={section.title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="glass-card"
      >
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <section.icon size={16} className="text-primary" /> {section.title}
        </h2>
        {section.fields.length > 0 ? (
          <div className="space-y-3">
            {section.fields.map(f => (
              <div key={f}>
                <label className="text-xs text-muted-foreground mb-1 block">{f}</label>
                <input type={f.toLowerCase().includes("password") ? "password" : "text"}
                  className="w-full px-3 py-2 bg-muted/40 border border-border/30 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
              </div>
            ))}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs neon-glow">
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {["Email alerts for overdue maintenance", "Push notifications for due tasks", "Weekly fleet status summary"].map(opt => (
              <label key={opt} className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary" />
                {opt}
              </label>
            ))}
          </div>
        )}
      </motion.div>
    ))}
  </div>
);

export default SettingsPage;
