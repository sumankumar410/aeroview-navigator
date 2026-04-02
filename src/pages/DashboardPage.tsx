import { motion } from "framer-motion";
import { Plane, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, Gauge } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from "recharts";

const statCards = [
  { title: "Total Aircraft", value: 48, icon: Plane, color: "text-primary", bg: "bg-primary/10", trend: "+3" },
  { title: "Active Maintenance", value: 12, icon: Wrench, color: "text-warning", bg: "bg-warning/10", trend: "+2" },
  { title: "Overdue Tasks", value: 5, icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", trend: "-1" },
  { title: "Completed This Month", value: 34, icon: CheckCircle, color: "text-success", bg: "bg-success/10", trend: "+8" },
];

const barData = [
  { month: "Jan", completed: 28, pending: 5 },
  { month: "Feb", completed: 32, pending: 3 },
  { month: "Mar", completed: 25, pending: 8 },
  { month: "Apr", completed: 30, pending: 4 },
  { month: "May", completed: 34, pending: 6 },
  { month: "Jun", completed: 38, pending: 2 },
];

const pieData = [
  { name: "Safe", value: 31, color: "hsl(142, 71%, 45%)" },
  { name: "Due", value: 12, color: "hsl(38, 92%, 50%)" },
  { name: "Overdue", value: 5, color: "hsl(0, 84%, 60%)" },
];

const lineData = [
  { day: "Mon", flights: 42, checks: 8 },
  { day: "Tue", flights: 38, checks: 12 },
  { day: "Wed", flights: 45, checks: 6 },
  { day: "Thu", flights: 40, checks: 10 },
  { day: "Fri", flights: 50, checks: 4 },
  { day: "Sat", flights: 35, checks: 14 },
  { day: "Sun", flights: 30, checks: 9 },
];

const recentActivity = [
  { aircraft: "B737-800 (VT-ABC)", action: "Engine overhaul completed", status: "safe", time: "1h ago" },
  { aircraft: "A320 (VT-DEF)", action: "Landing gear inspection due", status: "due", time: "3h ago" },
  { aircraft: "B777-300 (VT-GHI)", action: "Hydraulic check overdue", status: "overdue", time: "5h ago" },
  { aircraft: "A380 (VT-JKL)", action: "Avionics update scheduled", status: "due", time: "1d ago" },
];

const statusBadge: Record<string, string> = {
  safe: "status-safe",
  due: "status-due",
  overdue: "status-overdue",
};

const aiPredictions = [
  { aircraft: "B737-800 (VT-ABC)", component: "Engine Turbine", risk: 12, trend: "stable" },
  { aircraft: "A320 (VT-DEF)", component: "Landing Gear", risk: 78, trend: "rising" },
  { aircraft: "B777-300 (VT-GHI)", component: "Hydraulic Pump", risk: 45, trend: "stable" },
];

const DashboardPage = () => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <h1 className="text-2xl font-bold text-foreground">Mission Control</h1>
      <p className="text-sm text-muted-foreground">Fleet status overview · Real-time monitoring</p>
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((s, i) => (
        <motion.div key={s.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card hover-lift group cursor-default"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.title}</p>
              <p className={`text-3xl font-bold mt-2 ${s.color}`}>
                <AnimatedCounter target={s.value} />
              </p>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp size={10} /> {s.trend} this week
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Charts row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Bar chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="glass-card lg:col-span-2">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity size={16} className="text-primary" /> Maintenance Overview
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 26% 20%)" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'hsl(222 41% 10%)', border: '1px solid hsl(220 26% 20%)', borderRadius: 8, color: 'hsl(210 40% 92%)' }} />
            <Bar dataKey="completed" fill="hsl(187 94% 43%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="glass-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Fleet Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'hsl(222 41% 10%)', border: '1px solid hsl(220 26% 20%)', borderRadius: 8, color: 'hsl(210 40% 92%)' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {pieData.map(p => (
            <div key={p.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Line chart & Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="glass-card">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" /> Weekly Operations
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 26% 20%)" />
            <XAxis dataKey="day" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'hsl(222 41% 10%)', border: '1px solid hsl(220 26% 20%)', borderRadius: 8, color: 'hsl(210 40% 92%)' }} />
            <Area type="monotone" dataKey="flights" stroke="hsl(187 94% 43%)" fill="hsl(187 94% 43% / 0.1)" />
            <Area type="monotone" dataKey="checks" stroke="hsl(217 91% 60%)" fill="hsl(217 91% 60% / 0.1)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="glass-card">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock size={16} className="text-primary" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className={`px-2 py-1 rounded text-[10px] font-semibold uppercase border ${statusBadge[a.status]}`}>
                {a.status}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground font-medium truncate">{a.aircraft}</p>
                <p className="text-[10px] text-muted-foreground">{a.action}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* AI Predictions */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
      className="glass-card neon-border">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Gauge size={16} className="text-primary" />
        AI Predictive Maintenance
        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full uppercase tracking-wider">Beta</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiPredictions.map((p, i) => (
          <div key={i} className="p-4 rounded-lg bg-muted/20 border border-border/20">
            <p className="text-xs font-medium text-foreground">{p.aircraft}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{p.component}</p>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">Failure Risk</span>
                <span className={p.risk > 60 ? "text-danger" : p.risk > 30 ? "text-warning" : "text-success"}>{p.risk}%</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.risk}%` }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.2 }}
                  className={`h-full rounded-full ${p.risk > 60 ? "bg-danger" : p.risk > 30 ? "bg-warning" : "bg-success"}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default DashboardPage;
