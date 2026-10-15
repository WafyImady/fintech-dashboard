# 🏦 Fintech Cashier Dashboard

A production-ready point-of-sale (POS) dashboard built for high-reliability financial transactions. Engineered with a decoupled architecture, strict server-side validation, and a fully automated CI/CD pipeline.

Next.js

TypeScript

Tailwind CSS

Supabase

Docker

GitHub Actions

## 🚀 System Architecture

This application strictly separates frontend presentation from backend database operations to ensure security and data integrity.

- **Frontend Client:** Built with **Next.js (App Router)** and **Tailwind CSS v4**. Handles user input, state management, and basic UI validation.
- **Backend API:** Next.js Serverless Routes intercept all frontend requests. It recalculates fees securely on the server and applies strict payload validation.
- **Database Engine:** **Supabase (PostgreSQL)**. Accessed strictly via server-side Service Role Keys to bypass public Row Level Security (RLS) vulnerabilities.

## 🛡️ DevOps & Security Implementations

- **Build-Time Environment Validation (Zod):** Implemented a “Fail Fast” security mechanism in `next.config.ts`. The application refuses to compile if required environment variables (like API keys or URLs) are missing or misconfigured, preventing silent production failures.
- **Multi-Stage Docker Containerization:** Optimized the production deployment using a 3-stage `Dockerfile`. Next.js standalone builds reduce the final image size and enforce cloud-agnostic hosting.
- **Automated CI/CD Pipeline:** Configured GitHub Actions to execute on every push to `main`.
    - **CI:** Runs Unit/Component testing (**Jest** & React Testing Library) and End-to-End browser testing (**Cypress**).
    - **CD:** Automatically triggers a webhook deployment to **Render** upon successful CI completion.
- **Zero-Downtime Environment Injection:** Utilizes Docker `ARG` and `ENV` mapping to securely inject dynamic cloud variables at build-time.

## 💻 Local Development Setup

To run this project locally, you will need Node.js (v20+) and a Supabase account.

1. **Clone the repository:**
    
    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/fintech-dashboard.git
    cd fintech-dashboard
    ```
    
2. **Install dependencies:**
    
    ```bash
    npm install
    ```
    
3. **Configure Environment Variables:**
Create a `.env.local` file in the root directory and add your Supabase credentials:
    
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    ```
    
4. **Run the development server:**
    
    ```bash
    npm run dev
    ```
    
5. **Run the automated test suite:**
    
    ```bash
    npm run test      # Runs Jest Unit Tests
    npm run cypress   # Opens the Cypress E2E Testing UI
    ```
