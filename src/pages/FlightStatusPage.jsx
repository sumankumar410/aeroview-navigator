import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Search, ShieldCheck, AlertTriangle, XCircle, CheckCircle,
  Clock, Gauge, Wrench, Download, Send, CheckCircle2, MapPin, ArrowRight,
  Activity, Calendar, FileText
} from "lucide-react";
import { useFlightStore, exportToJSON } from "@/hooks/useDataStore";
import TiltCard from "@/components/TiltCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function FlightStatusPage() {
  const { flights, getFlightDetails, requestInspection } = useFlightStore();
  const [searchQuery, setSearchQuery] = useState("AI-101");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requestNotes, setRequestNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active searched flight details
  const activeFlight = useMemo(() => {
    return getFlightDetails(searchQuery) || (flights.length > 0 ? getFlightDetails(flights[0].flightNo) : null);
  }, [searchQuery, getFlightDetails, flights]);

  // Filtered flights list
  const filteredFlights = useMemo(() => {
    return flights.filter(f => {
      const details = getFlightDetails(f.flightNo);
      const status = details?.aircraft?.status || "safe";
      if (statusFilter === "safe") return status === "safe";
      if (statusFilter === "due") return status === "due";
      if (statusFilter === "overdue") return status === "overdue";
      return true;
    });
  }, [flights, statusFilter, getFlightDetails]);

  const handleRequestCheck = (e) => {
    e.preventDefault();
    if (!activeFlight) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const ok = requestInspection(activeFlight.flightNo, requestNotes);
      setIsSubmitting(false);
      if (ok) {
        toast.success(`Priority inspection requested for Flight ${activeFlight.flightNo} (${activeFlight.aircraftReg})`);
        setRequestNotes("");
      } else {
        toast.error("Failed to submit request.");
      }
    }, 600);
  };

  const handleDownloadCertificate = () => {
    if (!activeFlight) return;
    const certData = {
      flightNumber: activeFlight.flightNo,
      airline: activeFlight.airline,
      route: activeFlight.route,
      aircraftRegistration: activeFlight.aircraftReg,
      aircraftModel: activeFlight.aircraft?.model || "N/A",
      totalFlightHours: activeFlight.aircraft?.totalHours || 0,
      airworthinessStatus: activeFlight.aircraft?.status || "safe",
      healthScore: `${activeFlight.healthScore}%`,
      lastCheckDate: activeFlight.aircraft?.lastCheck || "N/A",
      nextMandatoryInspection: activeFlight.aircraft?.nextCheck || "N/A",
      recentMaintenanceRecords: activeFlight.records || [],
      issuedAt: new Date().toISOString(),
      authorizedBy: "Aero Spark MRO Airworthiness Authority",
    };
    exportToJSON(certData, `Airworthiness_Certificate_${activeFlight.flightNo}.json`);
    toast.success("Certificate downloaded successfully!");
  };

  const getStatusBadge = (status) => {
    if (status === "safe") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Cleared for Takeoff
        </span>
      );
    }
    if (status === "due") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Maintenance Due Soon
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <XCircle className="w-3.5 h-3.5 text-rose-400" /> Grounded / Overdue Check
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Plane className="w-6 h-6 text-primary" />
            Flight Maintenance Status
          </h1>
          <p className="text-sm text-muted-foreground">
            Search your flight or aircraft registration to check live airworthiness, upcoming inspections, and maintenance clearance.
          </p>
        </div>
        {activeFlight && (
          <Button
            onClick={handleDownloadCertificate}
            variant="outline"
            className="flex items-center gap-2 border-primary/40 hover:bg-primary/10 text-primary"
          >
            <Download className="w-4 h-4" /> Download Clearance Cert
          </Button>
        )}
      </div>

      {/* Search & Quick Selection Bar */}
      <div className="glass-panel p-4 neon-border rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Flight No (e.g. AI-101, 6E-204) or Registration (VT-ABC)..."
              className="pl-10 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {flights.map((f) => (
              <button
                key={f.id}
                onClick={() => setSearchQuery(f.flightNo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  searchQuery.toUpperCase() === f.flightNo.toUpperCase()
                    ? "bg-primary text-primary-foreground font-semibold neon-glow"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.flightNo} ({f.aircraftReg})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Flight Detailed Status Card */}
      {activeFlight ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Status Panel */}
          <div className="lg:col-span-2 space-y-6">
            <TiltCard max={8}>
              <div className="glass-card neon-border p-6 rounded-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-extrabold text-foreground tracking-wide">
                        {activeFlight.flightNo}
                      </h2>
                      <span className="text-sm px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                        {activeFlight.airline}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{activeFlight.origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      <span>{activeFlight.destination}</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(activeFlight.aircraft?.status || "safe")}
                  </div>
                </div>

                {/* Flight & Aircraft Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-xs text-muted-foreground">Assigned Aircraft</p>
                    <p className="text-base font-semibold text-foreground mt-0.5">{activeFlight.aircraftReg}</p>
                    <p className="text-[11px] text-primary">{activeFlight.aircraft?.model || "Commercial Jet"}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-xs text-muted-foreground">Flight Hours</p>
                    <p className="text-base font-semibold text-foreground mt-0.5">
                      {activeFlight.aircraft?.totalHours ? activeFlight.aircraft.totalHours.toLocaleString() : "14,200"} hrs
                    </p>
                    <p className="text-[11px] text-muted-foreground">Total Airframe Time</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-xs text-muted-foreground">Health Score</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className={`text-base font-semibold ${
                        activeFlight.healthScore > 90 ? "text-emerald-400" : activeFlight.healthScore > 60 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {activeFlight.healthScore}%
                      </p>
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Airworthiness Index</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-xs text-muted-foreground">Next Check Due</p>
                    <p className="text-base font-semibold text-foreground mt-0.5">
                      {activeFlight.aircraft?.nextCheck || "Scheduled"}
                    </p>
                    <p className="text-[11px] text-primary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Mandatory MRO Check
                    </p>
                  </div>
                </div>

                {/* Subsystem Health Checklist */}
                <div className="mt-6 pt-4 border-t border-border/20">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Subsystem Airworthiness Checkmarks
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/15 border border-border/15">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">Engines & APU</span>
                        <p className="text-[10px] text-muted-foreground">Thrust & EGT Nominal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/15 border border-border/15">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">Avionics & TCAS</span>
                        <p className="text-[10px] text-muted-foreground">Radar & GPS Sync</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/15 border border-border/15">
                      {activeFlight.aircraft?.status === "overdue" ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      <div>
                        <span className="font-medium text-foreground">Hydraulics</span>
                        <p className="text-[10px] text-muted-foreground">
                          {activeFlight.aircraft?.status === "overdue" ? "Seal Check Overdue" : "Pressure 3,000 PSI"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/15 border border-border/15">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">Cabin Pressure</span>
                        <p className="text-[10px] text-muted-foreground">Oxygen & Seals Verified</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Maintenance History for this Flight */}
            <div className="glass-panel p-5 rounded-xl border border-border/30">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                Recent Maintenance Logs ({activeFlight.aircraftReg})
              </h3>
              {activeFlight.records && activeFlight.records.length > 0 ? (
                <div className="space-y-2.5">
                  {activeFlight.records.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-lg bg-muted/20 border border-border/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-primary">{r.type}</span>
                          <span className="text-xs text-foreground font-medium">— {r.description}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Inspected by: {r.technician || "Authorized Engineer"} · Log Date: {r.date}
                        </p>
                      </div>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium self-start sm:self-auto ${
                        r.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : r.status === "in-progress"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No previous maintenance issues logged for this aircraft. Airframe in prime operational condition.
                </p>
              )}
            </div>
          </div>

          {/* Action / Request Inspection Panel */}
          <div className="space-y-6">
            <div className="glass-card neon-border p-5 rounded-xl">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-1">
                <Wrench className="w-4 h-4 text-primary" />
                Request Flight Inspection
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Submit an urgent maintenance or pre-departure inspection check for flight <b>{activeFlight.flightNo}</b>.
              </p>

              <form onSubmit={handleRequestCheck} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Flight & Aircraft
                  </label>
                  <Input
                    disabled
                    value={`${activeFlight.flightNo} — ${activeFlight.aircraftReg} (${activeFlight.aircraft?.model || ""})`}
                    className="bg-muted/40 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Inspection Remarks / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="E.g. Check hydraulic fluid pressure, brake pads wear, or pilot reported minor cockpit vibration..."
                    className="w-full text-xs rounded-md border border-input bg-background/50 px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2.5 neon-glow flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Dispatching Request..." : "Submit Inspection Request"}
                </Button>
              </form>
            </div>

            {/* Quick Pilot & Operator Notes */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <h4 className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Regulatory Compliance Notice
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                DGCA & ICAO airworthiness standards mandate that any aircraft with status <b>"Grounded"</b> or <b>"Overdue"</b> must complete safety certification before passenger boarding or flight plan filing.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center glass-panel rounded-xl">
          <Plane className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">Flight Not Found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            No flight matching "{searchQuery}". Please select a flight from the quick buttons above.
          </p>
        </div>
      )}

      {/* Fleet Scheduled Flights Status Table */}
      <div className="glass-panel p-5 rounded-xl border border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary" />
              All Scheduled Flights Maintenance Matrix
            </h3>
            <p className="text-xs text-muted-foreground">
              Click any flight to view full airworthiness status and inspection schedule.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {["all", "safe", "due", "overdue"].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2.5 py-1 text-xs rounded-md capitalize transition-all ${
                  statusFilter === filter
                    ? "bg-primary/20 text-primary font-semibold border border-primary/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Flight No</th>
                <th className="py-2.5 px-3">Airline & Route</th>
                <th className="py-2.5 px-3">Aircraft</th>
                <th className="py-2.5 px-3">Departure / Arrival</th>
                <th className="py-2.5 px-3">Health Score</th>
                <th className="py-2.5 px-3">Clearance Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredFlights.map((f) => {
                const details = getFlightDetails(f.flightNo);
                const acStatus = details?.aircraft?.status || "safe";
                const isSelected = activeFlight?.flightNo === f.flightNo;
                return (
                  <tr
                    key={f.id}
                    onClick={() => setSearchQuery(f.flightNo)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10" : "hover:bg-muted/20"
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-foreground">{f.flightNo}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-foreground">{f.airline}</span>
                      <p className="text-[10px] text-muted-foreground">{f.route}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-foreground font-semibold">{f.aircraftReg}</span>
                      <p className="text-[10px] text-primary">{details?.aircraft?.model || "Airbus / Boeing"}</p>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {f.departureTime} ➔ {f.arrivalTime}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-semibold ${
                        f.healthScore > 90 ? "text-emerald-400" : f.healthScore > 60 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {f.healthScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(acStatus)}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchQuery(f.flightNo);
                        }}
                        className="px-2.5 py-1 rounded bg-primary/15 hover:bg-primary/25 text-primary text-[11px] font-medium"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
