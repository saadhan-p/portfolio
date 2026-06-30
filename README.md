# SAADHAN_P // CORE_PORTFOLIO_OS V1.0

A high-performance, cyber-brutalist developer portfolio and interactive terminal system. Designed with a retro-futuristic dark aesthetic, featuring real-time AI-powered transmission logging, dynamic telemetry, and simulated secure system requisitions.

---

## 🛠 SYSTEM_SPECIFICATIONS

- **Frontend Core:** React 19 (TypeScript) + Vite
- **Styling Engine:** Tailwind CSS v4
- **Animation Layer:** Motion (formerly Framer Motion)
- **Backend Kernel:** Node.js + Express
- **Cognitive Processor:** Google Gemini 3.5 Flash (via `@google/genai`)

---

## ⚡ KEY_FEATURES

### 1. Interactive Project Requisitions (`PROJECT_INDEX`)
A custom project browser. Users can request access to projects (e.g., *Isolated Cloud Infrastructure*, *OpenGRC*, *Sentinel*). The system plays a real-time terminal decryption animation before securely redirecting the client to the respective GitHub repository.

### 2. AI-Powered Transmission Terminal (`TRANSMISSION`)
An interactive contact terminal. Transmissions are analyzed in real-time by a customized **Gemini 3.5 Flash** model acting as the system's core kernel. The AI classifies the transmission (e.g., `HIRING`, `COOPERATION`, `THREAT TESTING`), assesses a threat level (`LOW`, `MEDIUM`, `HIGH`), and returns a stylized hexadecimal-signed acknowledgment.

### 3. Live System Telemetry & Logs
- **Dynamic System Logs:** Automatically registers all transmission acknowledgments, local recoveries, and core events with unique hashes and timestamps.
- **Hardware Specs Panel:** Displays live-simulated memory allocation, CPU load, and network packets to complete the brutalist terminal interface.

---

## 🚀 LOCAL_INSTALLATION

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/saadhan-p/portfolio.git
cd portfolio
npm install
```

### 2. Configure Environment Variables
Copy the example environment file and add your credentials:
```bash
cp .env.example .env
```
Open `.env` and configure:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```
*(Get a free Gemini API Key from [Google AI Studio](https://aistudio.google.com/))*

### 3. Launch Development Server
```bash
npm run dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 📦 PRODUCTION_DEPLOYMENT

This application is fully prepared for containerized or server-based deployments.

### Build and Run
```bash
# Build both the React SPA and Express Server
npm run build

# Start the production server
npm start
```

### Deploying to Render / Railway
1. Connect your GitHub repository.
2. Set the **Build Command** to `npm run build`.
3. Set the **Start Command** to `npm start`.
4. Configure the following **Environment Variables**:
   - `NODE_ENV="production"`
   - `GEMINI_API_KEY="your_api_key"`
   - `APP_URL="https://your-deployed-url.com"`
