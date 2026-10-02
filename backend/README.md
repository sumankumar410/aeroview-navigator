# 🛠️ Aero Spark — Backend REST API

Node.js & Express REST API server with MongoDB (Mongoose) database connection and Twilio SMS notification service.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose)
- **External Services**: Twilio SMS API
- **Environment**: dotenv

## Environment Variables (`.env`)

Create or update `.env` in this directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/aircraftDB
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Setup & Running

```bash
# Install dependencies
npm install

# Start the server (runs on http://localhost:5000)
npm start
```

## API Endpoints

- `GET /api/aircraft` - Get all aircraft
- `POST /api/aircraft` - Create a new aircraft
- `PUT /api/aircraft/:id` - Update an aircraft
- `DELETE /api/aircraft/:id` - Delete an aircraft
- `POST /api/send-sms` - Send Twilio SMS alert (`{ to, message }`)

For full documentation, see the [Root README](../README.md).
