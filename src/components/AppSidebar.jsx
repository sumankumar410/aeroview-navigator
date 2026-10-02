import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Plane, Wrench, FileText, Bell, Settings, LogOut, Shield, ChevronLeft, ChevronRight, Sun, Moon, PlaneTakeoff, User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Role-based navigation items
  const navItems = isAdmin ? [
    { title: "Admin Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Aircraft Fleet", path: "/aircraft", icon: Plane },
    { title: "Maintenance", path: "/maintenance", icon: Wrench },
    { title: "Flight Status", path: "/flight-status", icon: PlaneTakeoff },
    { title: "Reports & Logs", path: "/reports", icon: FileText },
    { title: "Notifications", path: "/notifications", icon: Bell },
    { title: "System Settings", path: "/settings", icon: Settings },
  ] : [
    { title: "Flight Status", path: "/flight-status", icon: PlaneTakeoff },
    { title: "Fleet Overview", path: "/aircraft", icon: Plane },
    { title: "Maintenance Schedule", path: "/maintenance", icon: Wrench },
    { title: "Alerts & Notices", path: "/notifications", icon: Bell },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3 }}
      className="h-screen sticky top-0 flex flex-col glass-panel border-r border-border/30 z-50"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/20">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 neon-glow">
          {isAdmin ? <Shield className="w-5 h-5 text-primary" /> : <PlaneTakeoff className="w-5 h-5 text-primary" />}
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <h2 className="font-bold text-primary neon-text text-sm">Aero Spark</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                isAdmin ? "bg-primary/20 text-primary border border-primary/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
                {isAdmin ? "Admin Console" : "User Portal"}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <NavLink key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative
                ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
            >
              {active && (
                <motion.div layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-full neon-glow"
                />
              )}
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary" : "group-hover:text-primary"} transition-colors`} />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile & actions */}
      <div className="p-2 border-t border-border/20 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 rounded-lg bg-muted/30 border border-border/20 mb-1 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.role}</p>
            </div>
          </div>
        )}

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-xs text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
