# FIFA World Cup 2026 Smart Stadium Assistant

A production-ready, highly interactive, premium "vibe-coded" web application designed to optimize matchday logistics, accessibility, transport, sustainability, and real-time operations for the FIFA World Cup 2026.

---

## 🏟️ Project Overview
* **Chosen Vertical**: Smart Stadium Assistant for Fans, Staff, and Volunteers
* **Target Venues**: MetLife Stadium (NY/NJ), Estadio Azteca (Mexico City), BC Place (Vancouver)
* **Goal**: Provide an AI-enabled, localized, and multi-persona platform that connects fans, volunteers, venue staff, and organizers through a reactive stadium ecosystem.

---

## 🌟 Key Features

### 1. Multi-Persona Context Engine
Dynamically toggles between 4 distinct matchday roles, shifting the UI views and the AI's communication style:
* **Fan**: Warm, friendly guidelines; prioritizes concessions, seats, transit schedules, and hydration spots.
* **Volunteer**: Clear bullet-point checklists, gate crowd redirection protocols, and sensor-sensitive routings.
* **Venue Staff**: Critical security guidelines, incident logs, direct queue mitigations, and ticket-reader override codes.
* **Organizer**: A high-level Executive Command Dashboard showing live incident charts, gate loads, and custom alert injection controls.

### 2. Interactive SVG Map & Pathfinding
A custom interactive SVG rendering of the stadium stands, gates, and services:
* **Visual Heatmaps**: Gates color-code from Green (Normal) to Red (Overcrowded) depending on live crowd pressure.
* **Dijkstra Routing**: Renders glowing, animated paths for:
  * *Shortest Path* (direct Euclidean distance routing).
  * *Accessible Path* (automatically bypasses stairs and selects elevator/ramp links).
  * *Low-Crowd Path* (adds weight penalties to congested stands and busy gates, routing fans around bottlenecks).
* **SVG Node Clicks**: Click directly on nodes on the SVG to set departure points and seating destinations.

### 3. Smart AI Chat Assistant
A natural language chat interface:
* **Hybrid Execution**: If an OpenAI API Key is entered in settings, it queries live `gpt-4o-mini` with custom system prompt templates; otherwise, it falls back to a secure, multilingual local context decision engine.
* **Text-to-Speech (TTS)**: Built-in voice synthesizer reads AI responses aloud for low-vision users.
* **Smart Chips**: Displays dynamic quick-prompts that change based on role and active stadium.

### 4. Eco Hub & Gamified Sustainability
* **Emissions Calculator**: Compares carbon footprints (Metro vs Shuttle vs Rideshare) based on a distance slider.
* **Eco-Sorter Game**: A drag/click mini-game where sorting waste (compost vs recycle vs landfill) yields eco-points, tips, and unlocks the virtual "Matchday Eco-Champion" badge.

### 5. Accessibility Suite
* **High Contrast mode** swaps colors for neon yellows on deep black.
* **Large Text** toggle scales text.
* Voice guidance prompts.
* Detailed directory maps for wheelchair, sensory quiet rooms, and sign language stations.

---

## 🛠️ Tech Stack & Architecture
* **Frontend**: React (Vite)
* **Styling**: Tailwind CSS & CSS Animations
* **Charts**: Recharts (Pie & Bar charts)
* **Icons**: Lucide React
* **Testing**: Vitest (Jest-compatible runner)

---

## 🚀 Getting Started

### 1. Installation
Clone the repository, go into the directory, and run:
```bash
npm install
```

### 2. Run Locally
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Tests
Execute the unit test suites:
```bash
npm run test
```
*(Or `npx vitest run`)*

---

## 📡 AI Prompts & Context Design
The prompt coordinator compiles active states into a single system instruction payload:
1. **Persona instructions**: Swaps behavior rules.
2. **Current variables**: Injects current stadium name, match phase (e.g. egress), and language.
3. **Accessibility parameters**: Appends flags for wheelchair or sensory routing.
4. **Local Fallback**: Utilizes exact keyword mappings (`gate c`, `hydration`, `transit`, `volunteer task`) to query local data structures and returns instant answers in English, Spanish, or French.

---

## 🛡️ Security & Accessibility Compliance
* **Local API Storage**: OpenAI API Keys are stored purely client-side in the browser's `localStorage` and never sent to external servers other than directly to the encrypted OpenAI endpoint.
* **WCAG 2.1 Compliance**: Contrast ratios exceed 7:1 in High Contrast mode. Tab indices and semantic HTML tags (header, main, aside, section) are configured for screen reader efficiency.
