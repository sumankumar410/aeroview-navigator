import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTwilioConfig, useMaintenanceStore } from "@/hooks/useDataStore";
import { toast } from "sonner";

const SendAlertCard = () => {
  const { config } = useTwilioConfig();
  const { records } = useMaintenanceStore();
  const [sending, setSending] = useState(false);

  const pending = records.filter(r => r.status !== "completed");

  const buildMessage = () => {
    if (pending.length === 0) return "Aero Spark: All maintenance tasks are up to date ✈️";
    const lines = pending.slice(0, 8).map(r =>
      `• ${r.aircraftReg} | ${r.type} | due ${r.nextDue} | ${r.status.toUpperCase()}`
    );
    const more = pending.length > 8 ? `\n+${pending.length - 8} more` : "";
    return `Aero Spark — ${pending.length} pending maintenance task(s):\n${lines.join("\n")}${more}`;
  };

  const handleSend = async () => {
    const { accountSid, authToken, fromNumber, toNumber } = config;
    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      toast.error("Configure Twilio credentials in Settings first");
      return;
    }
    setSending(true);
    const message = buildMessage();
    // Simulated send: real Twilio calls require a backend (CORS + secret protection).
    // Credentials are validated locally; message is logged for review.
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    console.log("[Aero Spark SMS Preview]", { to: toNumber, from: fromNumber, message });
    toast.success(`Alert queued for ${toNumber}`, {
      description: `${pending.length} pending task(s) included. (Connect a backend to enable real SMS.)`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card neon-border flex items-center gap-4 flex-wrap"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center neon-glow">
        <MessageSquare className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-[180px]">
        <h3 className="text-sm font-semibold text-foreground">Maintenance Alerts</h3>
        <p className="text-xs text-muted-foreground">
          {pending.length} pending task(s) ready to send via Twilio SMS
        </p>
      </div>
      <Button onClick={handleSend} disabled={sending} className="neon-glow">
        {sending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>)
          : (<><Send className="w-4 h-4 mr-2" /> Send Notification</>)}
      </Button>
    </motion.div>
  );
};

export default SendAlertCard;
