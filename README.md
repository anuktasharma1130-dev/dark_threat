# DARKTRACE
### Dark Web Threat Intelligence & Actor Attribution Platform
**Smart India Hackathon (SIH 2026) — Problem Statement PS 26151: "Dark Web Threat Actor De-anonymization"**

---

## 🛡️ Executive Summary & Purpose

DARKTRACE is a high-fidelity, interactive cybersecurity prototype designed for SIH 2026 screening evaluation. It demonstrates an end-to-end defensible workflow for de-anonymizing threat actors across darknet marketplaces, underground forums, and simulated Tor hidden services.

> [!IMPORTANT]
> **Ethical & Safety Notice (100% Synthetic Threat Intelligence)**:
> This prototype is built strictly for demonstration and screening evaluation. It uses a **curated, synthetic threat-actor intelligence dataset** (e.g. `ShadowX`, `NightWolf`, `CipherGhost`, `hs-demo-*.onion`, `demo-infrastructure.example`).
> It **does NOT** perform real-world Tor hidden-service crawling, offensive network exploitation, credential theft, malware distribution, or de-anonymization of real private individuals.

---

## ⚡ Key Capabilities & Features

1. **Continuous Footprint Collection & Autonomous Monitoring**:
   - Monitored catalog of 24 darknet marketplaces, forums, escrow networks, and simulated hidden-service endpoints.
   - Interactive "Run Collection Cycle" action simulating incremental raw footprint and entity discovery.

2. **Tor Hidden-Service Infrastructure De-anonymization**:
   - Automated evaluation of 5 core detection vectors:
     - Exposed `/server-status` directive
     - SSL/TLS certificate serial correlation to transparency logs
     - Default web service headers & OS banners
     - Descriptor publishing cadence anomalies (UTC+3 cron synchronization)
     - JA3/JA4 & TCP stack infrastructure fingerprinting
   - Direct correlation pipeline mapping `.onion` services to candidate clearnet servers (`demo-infrastructure.example`, IP: `198.51.100.42`).

3. **Cross-Marketplace Actor Mapping (Interactive Graph)**:
   - Dynamic topological node-link visualization powered by `@xyflow/react`.
   - Maps relationships across Actors, Handles, PGP Keys, Crypto Wallets, Marketplaces, Forums, Personas, and Infrastructure.
   - Edge labels (`uses`, `linked_to`, `controls`, `observed_on`, `correlated_with`, `trust_link`).
   - Zoom, pan, node filtering, cluster presets, and instant entity drawer.

4. **AI-Assisted Persona Linkage & Stylometric Profiling**:
   - Backend machine learning analysis using Python `scikit-learn` TF-IDF vectorization and cosine similarity.
   - Comparative stylometric metrics (Stylometry %, Vocabulary Jaccard %, Sentence Length variance %, Behavioural similarity %, Diurnal 24h schedule correlation %).
   - Automated rebranding and persona migration detection (e.g., verifying `XShadow_New` is a migrated alias of `ShadowX`).

5. **Explainable Attribution Confidence Heuristic**:
   - Weighted multi-dimensional attribution model:
     - Identity Correlation: 25%
     - Infrastructure Correlation: 20%
     - Stylometric Similarity: 20%
     - Behavioural Similarity: 15%
     - Historical Continuity: 10%
     - Cross-Platform Evidence: 10%

6. **Forensic Timeline & Intelligence Reports**:
   - Chronological event timeline filterable by Actor, Date, Source, and Event Category.
   - One-click export of structured threat data in **CSV** and **JSON** formats.
   - Export-ready **HTML Dossier Reports** suitable for law enforcement or leadership briefings.

---

## 🏗️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND (React 19 + Vite)           │
│  - Tailwind CSS (Navy / Charcoal Dark SOC Aesthetic)   │
│  - React Router DOM                                    │
│  - @xyflow/react (Interactive Relationship Graph)      │
│  - Recharts (Diurnal trends, categories, timeline)     │
│  - Lucide React Icons                                  │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (/api/*)
┌───────────────────────────▼────────────────────────────┐
│                   BACKEND (FastAPI + Python 3.13)      │
│  - scikit-learn (TF-IDF Vectorizer, Cosine Similarity) │
│  - Pydantic v2 (Validation schemas)                    │
│  - SQLite Database (Pre-seeded with synthetic records) │
│  - Dynamic Autonomous Collection Simulator             │
│  - CSV / JSON / HTML Report Generators                 │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Run the Prototype Locally

### Prerequisites
- **Python**: 3.10+ (tested with Python 3.13)
- **Node.js**: 18+ (tested with Node 24 & npm 11)

---

### Step 1: Start the Backend Server

```bash
# Navigate to the backend directory
cd backend

# (Optional) Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate      # On Windows
# source venv/bin/activate # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload --port 8000
```
Backend will be live at: **`http://127.0.0.1:8000`**  
Interactive Swagger API docs at: **`http://127.0.0.1:8000/docs`**

---

### Step 2: Start the Frontend Application

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies (already initialized)
npm install

# Start the Vite development server
npm run dev
```
Frontend will be live at: **`http://localhost:5173`**

---

## 🧪 Demonstration Walkthrough Guide (For PPT Screenshots)

1. **Command Center (`/`)**:
   - Review the 6 core KPI cards, 30-day activity trend chart, and threat category breakdown.
   - Click **"Run Collection Cycle"** to observe real-time simulated footprint ingestion.
2. **Threat Actors (`/actors`)**:
   - Filter actors by Category (e.g., *Data Theft*, *Credential Trading*) or adjust the Min Confidence slider.
   - Click **"Investigate"** on `ShadowX` to open the full actor intelligence profile.
3. **Actor Profile (`/actors/actor-001`)**:
   - Inspect identity indicators (Handles, PGP Fingerprints, Crypto Wallets).
   - Review the **Attribution Confidence Meter** (87% with 6-factor explainable breakdown).
   - Click **"Generate Report"** to view and download the formatted intelligence dossier.
4. **Infrastructure Analyzer (`/infrastructure`)**:
   - Select `hs-demo-7f3a.onion` or switch synthetic targets.
   - Click **"Analyze Indicators"** to watch the simulated diagnostic pipeline probe server-status, SSL certificates, and map correlation to `demo-infrastructure.example` (84% correlation confidence).
5. **Relationship Graph (`/graph`)**:
   - Explore the multi-hop topological graph.
   - Zoom, pan, switch entity type filters, or click any node to view details in the slideout panel.
6. **AI Persona Analysis (`/personas`)**:
   - Compare `Persona A: ShadowX` vs `Persona B: XShadow_New`.
   - Click **"Run Persona Analysis"** to execute the backend TF-IDF cosine similarity engine.
   - Review stylometric match (91%), vocabulary overlap, diurnal schedule chart, and the **"Likely Rebranded / Migrated Persona"** verdict.
7. **Timeline (`/timeline`) & Sources (`/sources`)**:
   - Inspect chronological event records and source reliability ratings.
8. **Reports & Exports (`/reports`)**:
   - Download CSV, JSON, or generated HTML dossiers with one click.

---

## ⚖️ Synthetic Data & Hackathon Disclaimer
This software prototype was created solely for Smart India Hackathon (SIH 2026) screening evaluation of Problem Statement PS 26151. No real-world targets, real names, live Tor endpoints, or copyrighted forensic feeds are utilized.
