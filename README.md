# Mint — Free AI Spend Audit

Mint helps startup founders and engineering managers find out if they're overpaying for AI tools. Enter your current AI subscriptions and get an instant audit showing overspend, savings opportunities, and a personalized AI-generated summary — no signup required.

**Live URL:** https://mint-eight-blush.vercel.app

---

## What It Does

1. You enter your AI tools (Cursor, Claude, ChatGPT, GitHub Copilot, etc.), your plan, seats, and monthly spend
2. The audit engine analyzes your stack — are you on the right plan? Are you paying for overlapping tools?
3. You get an instant results page showing total monthly + annual savings, per-tool breakdown with reasoning, and an AI-generated personalized summary
4. You can capture the report via email and share your audit via a unique public URL
5. High-savings audits surface Credex as a way to capture even more savings via discounted AI credits

---

## Screenshots

### Spend Input Form
> Add screenshot here

### Audit Results Page
> Add screenshot here

### Lead Capture
> Add screenshot here

---

## Quick Start

### Prerequisites
- Node.js v20+
- MongoDB Atlas account (free)
- Groq API key (free)
- Resend API key (free)

### Install and Run Locally

```bash
git clone https://github.com/Sudhanshu-32/MINT.git
cd MINT
npm install
```

Create `.env.local` in the root:

```env
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run Tests

```bash
npm run test
```

### Deploy

Push to `main` — Vercel auto-deploys via GitHub integration.

Add these environment variables in Vercel dashboard:
- `MONGODB_URI`
- `GROQ_API_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_BASE_URL`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MongoDB Atlas |
| AI Summary | Groq API (Llama 3.1 8B) |
| Email | Resend |
| Tests | Vitest |
| CI/CD | GitHub Actions |
| Deploy | Vercel |

---

## Decisions

1. **Next.js over plain React + Express** — API routes, SSR, and file-based routing in one repo. Shareable audit URLs with Open Graph tags are trivial with App Router. A separate Express server would have added deployment complexity for no benefit.

2. **MongoDB over Supabase/Postgres** — Audit results have a variable number of recommendations per tool which maps naturally to MongoDB documents. A relational schema would have required joins for every audit read.

3. **Groq (Llama 3.1) over Anthropic/Gemini** — Anthropic API requires paid credits. Gemini free tier is geo-restricted in India. Groq is genuinely free, fast, and strong enough for 100-word summaries.

4. **Hardcoded rules for audit engine, not AI** — The audit logic needs to be deterministic, testable, and defensible to a finance person. AI-generated recommendations would be unpredictable and untestable. Knowing when NOT to use AI is part of good engineering.

5. **Email captured after value shown** — Showing full audit results before asking for email maximizes trust and conversion. Users who've already seen $500/mo in savings are far more likely to share their email than users who haven't seen anything yet.

---

## Project Structure
src/
├── app/
│   ├── api/
│   │   ├── audit/route.ts       ← creates audit, saves to MongoDB
│   │   ├── summary/route.ts     ← Groq AI summary generation
│   │   └── lead/route.ts        ← saves email lead, sends Resend email
│   ├── audit/[id]/page.tsx      ← shareable results page
│   └── page.tsx                 ← landing page with spend form
├── components/
│   ├── form/
│   │   ├── SpendForm.tsx        ← main input form
│   │   └── ToolRow.tsx          ← per-tool input row
│   └── results/
│       ├── HeroSavings.tsx      ← big savings number
│       ├── ToolBreakdown.tsx    ← per-tool recommendation card
│       ├── LeadCapture.tsx      ← email capture form
│       └── ShareButton.tsx      ← copy shareable URL
├── lib/
│   ├── auditEngine.ts           ← core audit logic
│   ├── pricingData.ts           ← all tool pricing data
│   └── mongodb.ts               ← database connection
├── models/
│   ├── Audit.ts                 ← MongoDB audit schema
│   └── Lead.ts                  ← MongoDB lead schema
└── types/
└── index.ts                 ← TypeScript types