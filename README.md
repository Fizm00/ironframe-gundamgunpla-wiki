# 🌌 IronFrame / Gundam Wiki

![Project Status](https://img.shields.io/badge/Status-Active_Development-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Gemini_2.5-purple?style=for-the-badge)

**The Ultimate Encyclopedia for the Universal Century and Beyond.**

IronFrame is a modern, interactive Gundam Wiki application built with the MERN stack. It features a comprehensive database of Mobile Suits, Pilots, and Factions, visualized through stunning UI and powered by next-generation AI.

## ✨ Key Features

### 🤖 IronFrame AI (Ask Haro)
*   **Powered by Google Gemini 2.5**: A context-aware chatbot that knows the Gundam lore.
*   **RAG (Retrieval-Augmented Generation)**: "Haro" reads from our MongoDB database to provide accurate specs on Mobile Suits and Pilots.
*   **Professional Mode**: A sleek, military-grade interface ("IronFrame Archive") for serious inquiries.

### 📊 Admin Command Center
*   **Analytics Dashboard**: Visual charts tracking faction growth, pilot recruitment, and database stats.
*   **CMS**: Full Create/Read/Update/Delete capabilities for managing Lore content.

### 📅 Interactive Timeline
*   A visual history of the Gundam timeline (U.C., A.C., C.E., etc.) allowing users to explore events chronologically.

### 📱 Modern UX/UI
*   **Responsive Design**: Built with Tailwind CSS and Framer Motion for smooth animations.
*   **Glassmorphism**: Premium sci-fi aesthetic with dark mode support.

---

## 🛠️ Tech Stack

### Frontend (Client)
*   **Core**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **State & Data**: Axios, React Router
*   **AI Integration**: React Markdown, Remark GFM

### Backend (Server)
*   **Runtime**: Node.js, Express
*   **Database**: MongoDB (Mongoose)
*   **AI Engine**: @google/genai (Gemini SDK)
*   **Security**: Helmet, Rate Limit, CORS

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Google Gemini API Key

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/yourusername/gundam-wiki.git
cd gundam-wiki
```

**Install Dependencies:**

*Root/Server:*
```bash
cd server
npm install
```

*Client:*
```bash
cd client
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gundam-wiki
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### 4. Running the App

**Development Mode (Run both Client & Server):**

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

The Client will launch at `http://localhost:5173` and the Server at `http://localhost:5000`.

---

## 📂 Project Structure

```
gundam-wiki/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (HaroChat, Admin, etc.)
│   │   ├── pages/          # Route Pages
│   │   ├── services/       # API Integrations
│   │   └── ...
│   └── ...
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Request Logic
│   │   ├── models/         # Mongoose Schemas (Pilot, MS, Faction)
│   │   ├── services/       # External Services (Gemini AI)
│   │   └── ...
│   ├── scripts/            # Seeders & Utility Scripts
│   └── ...
└── ...
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.
