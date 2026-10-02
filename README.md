# ✈️ Aero Spark — Futuristic Aircraft Maintenance & Airworthiness (MRO) System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-black?style=flat&logo=three.js&logoColor=white)](https://threejs.org/)
[![Twilio](https://img.shields.io/badge/Twilio-SMS_Alerts-F22F46?style=flat&logo=twilio&logoColor=white)](https://www.twilio.com/)

**Aero Spark** is a modern, full-stack **Aircraft Maintenance, Repair, and Overhaul (MRO)** tracking and flight airworthiness management application. It features a futuristic cyberpunk/glassmorphic UI with real-time 3D aircraft visualization, live airworthiness scoring, SMS alerts via Twilio, and a secure **Role-Based Access Control (RBAC)** architecture separating the **Admin Mission Control** from the **User Flight Portal**.

---

## 🌟 Key Highlights

- **Pure JavaScript Stack**: Frontend converted 100% to clean JavaScript/JSX (`.jsx`, `.js`) with Vite fast-refresh and zero TypeScript overhead.
- **Dual Role Experience (RBAC)**:
  - 🛡️ **Admin Portal**: Fleet mission control, add/edit aircraft, schedule MRO tasks, export reports, Twilio SMS alerts, system settings.
  - 👤 **User / Flight Portal**: Look up any flight by number (e.g. `AI-101`, `6E-204`) or registration (`VT-ABC`), check airworthiness clearance (Cleared / Due Soon / Grounded), inspect subsystem checks, request urgent inspections, and download signed clearance certificates.
- **3D Interactive Aircraft Model**: Interactive WebGL 3D airframe inspection rendered with Three.js & `@react-three/fiber`.
- **Automated Health Status**: Real-time evaluation of check intervals (A-Check, B-Check, C-Check, D-Check) calculating safe, due, and overdue states.
- **SMS & Emergency Alerts**: Integrated Twilio service for dispatching instant maintenance notifications to technicians and crew.
- **Modern UI / UX**: Glassmorphism, Tailwind CSS, Lucide icons, Framer Motion animations, dark/light mode toggle.

---

## 📁 Project Architecture

The project is structured into two clean, independent directories:

```
aeroview-navigator/
├── frontend/                     # React + Vite + Tailwind + Three.js UI
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/           # Reusable UI & 3D components
│   │   │   ├── ui/               # shadcn / Radix UI component library
│   │   │   ├── Aircraft3D.jsx    # Interactive 3D aircraft visualization
│   │   │   ├── AppSidebar.jsx    # Role-aware navigation sidebar
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── SendAlertCard.jsx # Twilio dispatch card
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx   # Role authentication & route guards
│   │   │   └── ThemeContext.jsx  # Dark/Light theme manager
│   │   ├── hooks/
│   │   │   └── useDataStore.js   # Flight, aircraft, and maintenance stores
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Tabbed User & Admin login
│   │   │   ├── FlightStatusPage.jsx # Flight maintenance status lookup
│   │   │   ├── DashboardPage.jsx # Admin Fleet Mission Control
│   │   │   ├── AircraftPage.jsx  # Fleet management & registration
│   │   │   ├── MaintenancePage.jsx # MRO check logs & work orders
│   │   │   ├── ReportsPage.jsx   # Analytics & CSV/JSON data export
│   │   │   ├── NotificationsPage.jsx # System alerts & history
│   │   │   └── SettingsPage.jsx  # MRO system & Twilio config
│   │   ├── App.jsx               # Route definitions & guards
│   │   ├── index.html            # Vite HTML entry
│   │   └── main.jsx              # React DOM root entry
│   ├── jsconfig.json             # Path alias (@/*) mapping
│   ├── package.json              # Frontend dependencies & scripts
│   ├── tailwind.config.js        # Tailwind CSS theme configuration
│   └── vite.config.js            # Vite bundler configuration
│
└── backend/                      # Node.js + Express + MongoDB REST API
    ├── .env                      # Database URI & Twilio credentials
    ├── package.json              # Backend dependencies
    └── server.js                 # Express server & Mongoose models
```

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB**: Local MongoDB instance running on `127.0.0.1:27017` or a MongoDB Atlas connection string.

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   # Local MongoDB connection (Recommended)
   MONGO_URI=mongodb://127.0.0.1:27017/aircraftDB

   # Twilio SMS Credentials (Optional / Configured)
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   > Output:
   > ```
   > 🚀 Server running on http://localhost:5000
   > ✅ MongoDB Connected
   > ```

---

### 2. Frontend Setup

1. Open a **new terminal** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## 🔐 Login Credentials (RBAC)

The login screen provides a tabbed interface with one-click demo credentials:

| Role | Username | Password | Default Landing Page | Allowed Access |
|---|---|---|---|---|
| **👤 User / Flight Operator** | `user` | `user123` | `/flight-status` | Flight Status, Fleet Overview, Maintenance Schedule, Notifications |
| **🛡️ Administrator** | `admin` | `admin123` | `/dashboard` | Full Admin Mission Control, Reports, Aircraft Management, Settings |

> **Note:** Any custom username with a password of 4 or more characters can log in as a User. Only the designated credentials `admin / admin123` grant full Administrator privileges.

---

## 🛠️ Main Features & Modules

### 1. 🛫 Flight Maintenance Status (`/flight-status`)
- **Search Engine**: Search by Flight Number (`AI-101`, `6E-204`, `AI-308`, `UK-955`, `6E-512`, `AI-821`) or Aircraft Registration (`VT-ABC`, `VT-DEF`, `VT-GHI`, `VT-JKL`).
- **Clearance Status Badge**:
  - 🟢 **Cleared for Takeoff**: Airframe and subsystems certified fit for flight.
  - 🟡 **Maintenance Due Soon**: Routine check due within 15 days; short-haul clearance with monitoring.
  - 🔴 **Grounded / Overdue Check**: Mandatory check overdue; takeoff prohibited.
- **Subsystem Status Checkmarks**: Real-time status for Engines/APU, Avionics/TCAS radar, Hydraulic pressure, and Cabin pressure.
- **Urgent Inspection Request**: Users can dispatch priority pre-departure inspection orders with custom notes directly to the MRO team.
- **Download Airworthiness Certificate**: Instant download of a signed JSON certificate of airworthiness.

### 2. 📊 Mission Control Dashboard (`/dashboard` - Admin Only)
- Interactive 3D aircraft model with component inspection points.
- Fleet metrics: Total Aircraft, Due Soon, Overdue, and Safe counts.
- AI Maintenance Predictions & Component Risk Trends.
- Monthly maintenance distribution charts and flight volume analysis.
- Quick SMS alert dispatch card.

### 3. ✈️ Aircraft Fleet Registry (`/aircraft`)
- Complete fleet catalog with aircraft type, registration, total flight hours, last check, and next scheduled check.
- Filter by status: Safe, Due, Overdue.
- Modal dialog for registering new commercial airliners into the database.

### 4. 🔧 Maintenance Work Orders (`/maintenance`)
- Log and track all A-Check, B-Check, C-Check, and D-Check operations.
- Status tracking: Scheduled, In-Progress, Completed, Overdue.
- Assigned technician tracking and countdown timers to due dates.

### 5. 📈 Reports & Analytics (`/reports` - Admin Only)
- Export fleet maintenance logs and aircraft manifests to **CSV** or **JSON**.
- Filter records by date ranges, aircraft type, and maintenance status.

### 6. ⚙️ System Settings (`/settings` - Admin Only)
- Configure Twilio SMS notification dispatch numbers and API tokens.
- Review database connection status and application configuration.

---

## 🌐 Backend REST API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Request Body Example |
|---|---|---|---|
| `GET` | `/api/aircraft` | Fetch all registered aircraft | — |
| `POST` | `/api/aircraft` | Add a new aircraft to fleet | `{ "registration": "VT-XYZ", "type": "Boeing", "model": "787", "totalHours": 1200, "lastCheck": "2024-01-01", "nextCheck": "2026-07-01" }` |
| `PUT` | `/api/aircraft/:id` | Update aircraft details | `{ "totalHours": 1350, "lastCheck": "2026-04-01" }` |
| `DELETE` | `/api/aircraft/:id` | Remove aircraft from registry | — |
| `POST` | `/api/send-sms` | Dispatch Twilio SMS alert | `{ "to": "+919876543210", "message": "URGENT: Inspection due for VT-ABC" }` |

---

## 📦 Production Build

To create an optimized production build of the frontend:

```bash
cd frontend
npm run build
```

The compiled output will be generated inside `frontend/dist/`. To preview the production bundle locally:

```bash
npm run preview
```

---

## 📄 License & Credits

- Developed for **Aero Spark Aviation Maintenance Systems**.
- Built with ❤️ using React, Vite, Node.js, and Tailwind CSS.
