<div align="center">

# 💰 The Pocket Saver

**Take Control of Your Personal Finances with Interactive Dashboards & Local Security**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Demo-10b981?style=for-the-badge)](https://Bhanu-teja-VCE.github.io/the-pocket-saver/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Data_Viz-FF6B6B?style=for-the-badge)

<br/>

*Track expenses, set savings goals, and visualize your financial health with our intuitive and secure platform.*

[Live Demo](https://Bhanu-teja-VCE.github.io/the-pocket-saver/) · [Report Bug](https://github.com/Bhanu-teja-VCE/the-pocket-saver/issues) · [Request Feature](https://github.com/Bhanu-teja-VCE/the-pocket-saver/issues)

</div>

---

## 📋 Table of Contents

- [About The Pocket Saver](#-about-the-pocket-saver)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 🧠 About The Pocket Saver

**The Pocket Saver** is a clean, local-first personal finance tracking application. It bridges the gap between over-complicated enterprise budgeting software and simple spreadsheets. 

Built with **React 19**, **TypeScript 5**, and **Tailwind CSS v4**, it provides real-time financial tracking, budget analytics, and progress tracking for savings goals. All data is stored locally in your browser, guaranteeing absolute privacy and security for your financial telemetry.

---

## ✨ Key Features

* 📊 **Interactive Dashboard:** Live widgets displaying total balance, monthly income, monthly expenses, and dynamic progress bars for active savings goals.
* 📈 **Visual Financial Analytics:** Interactive pie charts and bar graphs (powered by Recharts) showing expense categorization and monthly spending trends.
* 💸 **Transaction Ledger:** Full expense/income manager to add, edit, and delete transactions with custom tags (e.g. food, rent, shopping).
* 🎯 **Savings Goals:** Define, track, and log contributions to specific savings targets (e.g. vacation, emergency fund) with visual milestone metrics.
* 📥 **Data Exports:** Export your financial records in one click to **Excel spreadsheets (XLSX)** or formatted **PDF statements**.
* 🔒 **Local-First Security:** Encrypted local storage ensures no financial data ever leaves your device.
* 🌓 **Dynamic Themes:** Clean transitions between Premium Light mode and Cyber Dark mode.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 19 (Hooks, Context API)
* **Routing:** React Router DOM v7
* **Language:** TypeScript 5 (Strictly Typed)
* **Styling:** Tailwind CSS v4 (Glassmorphism & animations)
* **Motion:** Framer Motion 12 (Smooth viewport transitions)
* **Data Viz:** Recharts (Dynamic financial charts)
* **Exports:** jsPDF, AutoTable, and SheetJS (XLSX)
* **Icons:** Lucide React

---

## 📂 Project Structure

```
the-pocket-saver/
├── src/
│   ├── components/     # UI elements (charts, tables, forms, protected routes)
│   ├── context/        # Global states (Auth, Finance, and Theme providers)
│   ├── hooks/          # Custom hooks (local storage binders)
│   ├── layout/         # Navigation bars and footer templates
│   ├── pages/          # Full page views (Dashboard, Login, About, Blog, Contact)
│   ├── utils/          # Calculations, tailwind class merge helpers
│   ├── index.css       # Tailwind entry styles
│   └── main.tsx        # React mounting entrypoint
├── public/             # Static public assets
├── tailwind.config.js  # Tailwind CSS parameters
├── vite.config.ts      # Vite configuration with relative path setups
├── package.json        # Dependencies and gh-pages scripts
└── README.md           # Documentation (You are here)
```

---

## 🚀 Getting Started

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bhanu-teja-VCE/the-pocket-saver.git
   cd the-pocket-saver
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Launch development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to run the app.

### Deploy to GitHub Pages

You can deploy the site live to GitHub Pages in one command:
```bash
npm run deploy
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Master Your Money, Save Your Pocket**

Developed by [Bhanu Teja](https://github.com/Bhanu-teja-VCE)

</div>
