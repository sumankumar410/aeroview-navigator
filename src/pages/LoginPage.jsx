import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Lock, User, Eye, EyeOff, Shield, AlertCircle, Sparkles, PlaneTakeoff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const RadarBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }}
    />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}
          className="absolute rounded-full border border-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: `${i * 200}px`, height: `${i * 200}px` }}
        />
      ))}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] animate-radar">
        <div className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
          style={{ background: 'conic-gradient(from 0deg, transparent, hsl(187 94% 43% / 0.15) 30deg, transparent 60deg)' }}
        />
      </div>
      {[
        { x: 100, y: -80, delay: 0 },
        { x: -150, y: 60, delay: 1 },
        { x: 200, y: 120, delay: 2 },
        { x: -80, y: -200, delay: 0.5 },
      ].map((blip, i) => (
        <motion.div key={i}
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{ left: `calc(50% + ${blip.x}px)`, top: `calc(50% + ${blip.y}px)` }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 3, delay: blip.delay, repeat: Infinity }}
        />
      ))}
    </div>
    {[0, 1, 2].map((i) => (
      <motion.div key={i} className="absolute text-primary/10"
        initial={{ x: '-10%', y: `${20 + i * 30}%` }}
        animate={{ x: '110%' }}
        transition={{ duration: 20 + i * 5, delay: i * 7, repeat: Infinity, ease: "linear" }}
      >
        <Plane size={24 + i * 8} className="rotate-[-30deg]" />
      </motion.div>
    ))}
  </div>
);

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState("user"); // "user" or "admin"
  const [email, setEmail] = useState("user");
  const [password, setPassword] = useState("user123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // If already logged in, redirect to respective portal
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "Administrator") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/flight-status", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setError("");
    if (role === "admin") {
      setEmail("admin");
      setPassword("admin123");
    } else {
      setEmail("user");
      setPassword("user123");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password, activeRole);
    setLoading(false);
    if (result.success) {
      navigate(result.redirect || (activeRole === "admin" ? "/dashboard" : "/flight-status"));
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background">
      <RadarBackground />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-panel p-8 neon-border">
          <div className="flex flex-col items-center mb-6">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 neon-glow"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              {activeRole === "admin" ? (
                <Shield className="w-8 h-8 text-primary" />
              ) : (
                <PlaneTakeoff className="w-8 h-8 text-primary" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold neon-text text-primary">Aero Spark</h1>
            <p className="text-muted-foreground text-xs mt-1">
              {activeRole === "admin"
                ? "MRO Control & Fleet Administration Console"
                : "Flight Maintenance & Airworthiness Portal"}
            </p>
          </div>

          {/* Role Tabs: User Login vs Admin Login */}
          <div className="flex rounded-lg bg-muted/60 p-1 mb-5 border border-border/30">
            <button
              type="button"
              onClick={() => handleRoleSwitch("user")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeRole === "user"
                  ? "bg-primary text-primary-foreground shadow-sm neon-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-3.5 h-3.5" /> User / Flight Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("admin")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeRole === "admin"
                  ? "bg-primary text-primary-foreground shadow-sm neon-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin Portal
            </button>
          </div>

          {/* Role Banner */}
          <div className="mb-4 p-2.5 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-primary">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              {activeRole === "admin" ? "Admin Access (Full Control)" : "User Access (Flight Status Checker)"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {activeRole === "admin" ? "admin / admin123" : "user / user123"}
            </span>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 flex items-center gap-2 text-danger text-sm"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={activeRole === "admin" ? "Admin Username (admin)" : "Username / Email (e.g. user, pilot)"}
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                className="w-full pl-10 pr-10 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all neon-glow text-sm">
              {loading ? (
                <motion.div className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </motion.div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock size={15} />
                  {activeRole === "admin" ? "Login to Admin Console" : "Check Flight Maintenance Status"}
                </span>
              )}
            </Button>
          </form>

          {/* Quick Demo Autofill Buttons */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleRoleSwitch("user")}
              className={`text-[11px] px-2.5 py-1 rounded transition-all ${
                activeRole === "user"
                  ? "bg-primary/20 text-primary font-semibold border border-primary/30"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Demo: User Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("admin")}
              className={`text-[11px] px-2.5 py-1 rounded transition-all ${
                activeRole === "admin"
                  ? "bg-primary/20 text-primary font-semibold border border-primary/30"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Demo: Admin Login
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <Shield size={12} />
            <span>Role-Based Authentication · Secure JWT</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
