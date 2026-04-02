import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const RadarBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Grid */}
    <div className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }}
    />
    {/* Radar center */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}
          className="absolute rounded-full border border-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: `${i * 200}px`, height: `${i * 200}px` }}
        />
      ))}
      {/* Sweep */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] animate-radar">
        <div className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
          style={{
            background: 'conic-gradient(from 0deg, transparent, hsl(187 94% 43% / 0.15) 30deg, transparent 60deg)',
          }}
        />
      </div>
      {/* Blips */}
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
    {/* Moving aircraft silhouettes */}
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigate("/dashboard");
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
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 neon-glow"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold neon-text text-primary">AeroTrack</h1>
            <p className="text-muted-foreground text-sm mt-1">Aircraft Maintenance System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-muted/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border bg-muted accent-primary" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all neon-glow">
              {loading ? (
                <motion.div className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </motion.div>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock size={16} /> Secure Login
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield size={12} />
            <span>JWT Encrypted · 256-bit SSL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
