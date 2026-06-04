# Trendupp

**Africa's Leading Creator Marketplace for Influencer Marketing**

A trusted, two-sided marketplace connecting brands/advertisers with verified content creators, powered by escrow-based payments and structured campaign workflows.

---

## Table of Contents

- [Trendupp](#trendupp)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [What We're Building](#what-were-building)
  - [Technology Stack](#technology-stack)
    - [Frontend](#frontend)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Build for Production](#build-for-production)
    - [Run Tests](#run-tests)
    - [Fix Linting \& Formatting](#fix-linting--formatting)
    - [Linting \& Formatting](#linting--formatting)
  - [🤝 Contributing](#-contributing)
    - [Code Style](#code-style)

---

## Overview

Trendupp solves the fragmented influencer marketing problem by creating a structured, escrow-secured marketplace. Brands struggle to discover and pay creators reliably. Creators lack a trusted platform for paid work. We bridge this gap by acting as a secure middleman, enabling quick campaign execution, verified delivery, and guaranteed payments.

### What We're Building

A **core campaign engine** that allows:

- Brands to launch campaigns in under 15 minutes
- Creators to discover paid opportunities and apply in real-time
- Fast turnaround (48-hour urgency model for both parties)
- Secure escrow-based transactions with guaranteed payouts

---

## Technology Stack

### Frontend

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **State Management:** (TBD - Redux/Zustand/Jotai)
- **HTTP Client:** (TBD - Axios/Fetch)

---

## Project Structure

```
trendupp-fe/
├── app/                        # Next.js app directory
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── features/               # Feature-based routes
│       ├── (admin)/
│       ├── (auth)/
│       ├── (brand)/
│       ├── (creator)/
│       ├── (marketing)/
│       ├── campaigns/          # Core campaign module
│       ├── disputes/
│       ├── escrow/
│       └── notifications/
├── components/                 # Reusable UI components
│   └── ui/
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities & helpers
├── services/                   # API & external services
├── store/                      # State management
├── types/                      # TypeScript types & interfaces
├── utils/                      # General utilities
├── tests/                      # Test files
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Trendupp-App/Trendupp-Web.git
   cd Trendupp-Web
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
yarn build
yarn start
```

### Run Tests

```bash
yarn test

```

### Fix Linting & Formatting

```bash
yarn fix
```

### Linting & Formatting

```bash
yarn lint
yarn format
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Create a feature branch** from `develop`

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write clean, well-documented code** following our style guide
3. **Add tests** for new features
4. **Submit a Pull Request** with a clear description

### Code Style

- Use TypeScript strict mode
- Follow ESLint & Prettier configurations
- Comment complex logic
- Use meaningful variable names

---
