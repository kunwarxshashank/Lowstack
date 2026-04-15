# Lowstack

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-black?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Lowstack** is a modern, high-performance educational resource platform designed for university students. It simplifies the process of finding, sharing, and managing study materials such as notes, previous year questions (PYQs), and branch-specific resources.

## 🚀 Features

- **University-Centric Experience**: Filter content based on your specific university and branch.
- **Resource Management**: Organized hierarchy for Semesters, Subjects, and Documents.
- **In-Browser PDF Viewer**: Premium document viewing experience with built-in library support.
- **Personalization**: Save "Favourites" and track your most-used resources.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing using Tailwind CSS and DaisyUI.
- **Secure Authentication**: Powering user sessions with NextAuth.js.
- **Seamless Payments**: Integrated Razorpay for contributions (Hall of Punya) or premium services.
- **Fast Search & Feed**: Discovery-focused interface with branch-wise feeds.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, DaisyUI.
- **Backend**: Next.js Server Components/Actions, Prisma ORM.
- **Database**: MySQL/PostgreSQL (configured via Prisma).
- **Storage**: AWS S3 / DigitalOcean Spaces for document hosting.
- **Authentication**: NextAuth.js (Auth.js).
- **Payments**: Razorpay.
- **Email**: Mailjet.
- **State Management**: Zustand & SWR.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A database instance (MySQL/PostgreSQL)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kunwarxshashank/Lowstack.git
   cd Lowstack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and fill in the required variables (refer to [Environment Variables](#-environment-variables)).
   ```bash
   cp .env.example .env
   ```

4. **Database Migration**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3015](http://localhost:3015) in your browser.

## 🔑 Environment Variables

Required variables for the application to function correctly:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Prisma connection string for your database. |
| `NEXTAUTH_SECRET` | Secret used to hash tokens for NextAuth. |
| `NEXTAUTH_URL` | Canonical URL of your site. |
| `S3_ENDPOINT_URL` | Endpoint for AWS S3 or DigitalOcean Spaces. |
| `S3_ACCESS_KEY_ID` | Access key for S3 storage. |
| `S3_SECRET_ACCESS_KEY` | Secret key for S3 storage. |
| `RAZORPAY_KEY_ID` | Razorpay API Public Key. |
| `RAZORPAY_KEY_SECRET` | Razorpay API Private Secret. |

Refer to `.env.example` for a complete list of configuration options.

## 📜 Scripts

- `npm run dev`: Starts the development server on port 3015.
- `npm run build`: Generates Prisma client and builds the Next.js application.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run type-check`: Runs TypeScript type checking.

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get involved.

## 📄 License

This project is licensed under the **ISC License**.
