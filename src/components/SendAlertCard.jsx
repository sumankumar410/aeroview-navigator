 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTwilioConfig, useMaintenanceStore } from "@/hooks/useDataStore";
import { toast } from "sonner";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SendAlertCard = () => {
  const { config } = useTwilioConfig();
  const { records = [] } = useMaintenanceStore(); // fallback safety
  const [sending, setSending] = useState(false);

  const pending = records.filter((r) => _optionalChain([r, 'optionalAccess', _ => _.status]) !== "completed");

 const buildMessage = () => {
  if (pending.length === 0) {
    return "Aero Spark: All maintenance OK ✈️";
  }

  return `Aero Spark Maintenance Alert:
Check system dashboard.`;
};

  const handleSend = async () => {
    const { toNumber } = config || {};

    if (!toNumber) {
      toast.error("Please set receiver phone number");
      return;
    }

    try {
      setSending(true);

      const res = await axios.post(`${API_URL}/api/send-sms`, {
        to: toNumber,
        message: buildMessage(),
      });

      toast.success("SMS sent successfully");
      console.log("Twilio SID:", _optionalChain([res, 'access', _2 => _2.data, 'optionalAccess', _3 => _3.sid]));

    } catch (err) {
      console.error(err);

      const errorMsg =
        _optionalChain([err, 'optionalAccess', _4 => _4.response, 'optionalAccess', _5 => _5.data, 'optionalAccess', _6 => _6.error]) ||
        "Failed to send SMS";

      toast.error(errorMsg);

    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card neon-border flex items-center gap-4 flex-wrap"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center neon-glow">
        <MessageSquare className="w-6 h-6 text-primary" />
      </div>

      <div className="flex-1 min-w-[180px]">
        <h3 className="text-sm font-semibold text-foreground">
          Maintenance Alerts
        </h3>
        <p className="text-xs text-muted-foreground">
          {pending.length} pending task(s) ready to send via Twilio SMS
        </p>
      </div>

      <Button
        onClick={handleSend}
        disabled={sending}
        className="neon-glow"
      >
        {sending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Notification
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default SendAlertCard;