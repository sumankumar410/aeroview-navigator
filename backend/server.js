const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= TWILIO CONFIG ================= */
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* ================= MONGODB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

/* ================= SCHEMA ================= */
const aircraftSchema = new mongoose.Schema(
  {
    registration: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    model: { type: String, required: true },
    totalHours: { type: Number, default: 0 },
    lastCheck: { type: String, required: true },
    nextCheck: { type: String, required: true },
    status: {
      type: String,
      enum: ["safe", "due", "overdue"],
      default: "safe",
    },
  },
  { timestamps: true }
);

const Aircraft = mongoose.model("Aircraft", aircraftSchema);

/* ================= STATUS ================= */
const getStatus = (nextCheck) => {
  const today = new Date();
  const next = new Date(nextCheck);

  if (next < today) return "overdue";

  const diff = (next - today) / (1000 * 60 * 60 * 24);
  if (diff <= 7) return "due";

  return "safe";
};

/* ================= ROUTES ================= */

/* GET ALL */
app.get("/api/aircraft", async (req, res) => {
  const data = await Aircraft.find().sort({ createdAt: -1 });
  res.json(data);
});

/* CREATE */
app.post("/api/aircraft", async (req, res) => {
  try {
    const aircraft = new Aircraft({
      ...req.body,
      status: getStatus(req.body.nextCheck),
    });

    const saved = await aircraft.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* UPDATE */
app.put("/api/aircraft/:id", async (req, res) => {
  try {
    const updated = await Aircraft.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        status: getStatus(req.body.nextCheck || new Date()),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* DELETE */
app.delete("/api/aircraft/:id", async (req, res) => {
  await Aircraft.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= TWILIO SMS ================= */
app.post("/api/send-sms", async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    res.json({ success: true, sid: sms.sid });
  } catch (error) {
    console.error("Twilio Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ================= SERVER ================= */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});