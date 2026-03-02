# Zephyr RFID Payment System

Zephyr is a real-time RFID payment platform with an ESP8266 reader, Flask backend, MQTT bridge, and a role-based web dashboard for top-up and sales flows.

## LIVE ACCESS URL

### **[http://157.173.101.159:9224/](http://157.173.101.159:9224/)**

Frontend Link: http://157.173.101.159:9224/topup

## Features

- Real-time RFID card scan updates over MQTT + Socket.IO.
- Role-based dashboards for both `agent` (top-up) and `sales` (payment) flows.
- Shared live transaction ledger.
- SQLite persistence for cards, balances, and transactions.
- Updated premium dashboard UI (responsive, reduced empty space, improved visual polish).

## Project Structure

- `Payment/backend/app.py`: Flask app, Socket.IO events, MQTT integration, routes, and transaction logic.
- `Payment/backend/templates/dashboard.html`: Unified agent/sales dashboard UI.
- `Payment/backend/templates/admin.html`: Admin data view.
- `Payment/backend/templates/index.html`, `login.html`, `agent_login.html`, `sales_login.html`: Entry and auth pages.
- `Payment/ESP_RFID/ESP_RFID.ino`: ESP8266 + MFRC522 firmware.

## Current Backend Behavior

- Host/port: `0.0.0.0:9224`
- MQTT broker: `broker.benax.rw`
- Topics: `rfid/team_zephyr/card/status`, `rfid/team_zephyr/card/pay`, `rfid/team_zephyr/card/topup`
- Default login credentials: Agent `agent` / `agentpass`, Sales `sales` / `salespass`

## Routes

- `GET /`: Landing page
- `GET /login`: Login selector
- `GET /login/agent`: Agent login page
- `POST /login/agent`: Agent authentication
- `GET /login/sales`: Sales login page
- `POST /login/sales`: Sales authentication
- `GET /topup-dashboard`: Agent dashboard
- `GET /payment-dashboard`: Sales dashboard
- `GET /admin`: Admin page
- `POST /topup`: Top-up transaction
- `POST /pay`: Payment transaction

## Local Setup

1. Go to the project root:
```bash
cd Payment
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows PowerShell
```

3. Install dependencies:
```bash
pip install -U pip
pip install flask flask-socketio flask-cors flask-sqlalchemy paho-mqtt
```

4. Run backend:
```bash
python backend/app.py
```

5. Open in browser:
- `http://157.173.101.159:9224/`

## Hardware Notes

- Open `Payment/ESP_RFID/ESP_RFID.ino` in Arduino IDE.
- Install libraries: `ESP8266WiFi`, `PubSubClient`, `MFRC522`, `ArduinoJson`.
- Set Wi-Fi and team configuration, then flash the ESP8266.

## Tech Stack

- Backend: Flask, Flask-SocketIO, Flask-SQLAlchemy
- Frontend: HTML, Tailwind CSS, JavaScript, Socket.IO
- Messaging: MQTT
- Database: SQLite
- Hardware: ESP8266 + MFRC522
