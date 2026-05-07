export interface PlanInfo {
  name: string;
  pricePerSeat: number;
  minSeats?: number;
  maxSeats?: number;
  features: string[];
}

export interface ToolPricing {
  displayName: string;
  plans: Record<string, PlanInfo>;
  category: "coding" | "writing" | "general" | "api";
}

export const PRICING_DATA: Record<string, ToolPricing> = {
  cursor: {
    displayName: "Cursor",
    category: "coding",
    plans: {
      hobby: {
        name: "Hobby",
        pricePerSeat: 0,
        features: ["2000 completions/month", "50 slow requests"],
      },
      pro: {
        name: "Pro",
        pricePerSeat: 20,
        features: ["Unlimited completions", "500 fast requests", "Claude 3.5"],
      },
      business: {
        name: "Business",
        pricePerSeat: 40,
        features: ["Everything in Pro", "Admin dashboard", "SSO"],
      },
    },
  },
  github_copilot: {
    displayName: "GitHub Copilot",
    category: "coding",
    plans: {
      individual: {
        name: "Individual",
        pricePerSeat: 10,
        features: ["Code completions", "Chat in IDE"],
      },
      business: {
        name: "Business",
        pricePerSeat: 19,
        features: ["Everything in Individual", "Policy management"],
      },
      enterprise: {
        name: "Enterprise",
        pricePerSeat: 39,
        features: ["Everything in Business", "Custom models", "Audit logs"],
      },
    },
  },
  claude: {
    displayName: "Claude",
    category: "general",
    plans: {
      free: {
        name: "Free",
        pricePerSeat: 0,
        features: ["Limited messages", "Claude 3.5 Haiku"],
      },
      pro: {
        name: "Pro",
        pricePerSeat: 20,
        features: ["5x more usage", "Claude 3.5 Sonnet", "Projects"],
      },
      max: {
        name: "Max",
        pricePerSeat: 100,
        features: ["20x more usage", "All models", "Priority access"],
      },
      team: {
        name: "Team",
        pricePerSeat: 30,
        minSeats: 5,
        features: ["Everything in Pro", "Admin console", "Priority access"],
      },
      enterprise: {
        name: "Enterprise",
        pricePerSeat: 60,
        features: ["Custom usage limits", "SSO", "Audit logs"],
      },
    },
  },
  chatgpt: {
    displayName: "ChatGPT",
    category: "general",
    plans: {
      free: {
        name: "Free",
        pricePerSeat: 0,
        features: ["Limited GPT-4o", "Basic tools"],
      },
      plus: {
        name: "Plus",
        pricePerSeat: 20,
        features: ["GPT-4o", "DALL-E", "Advanced data analysis"],
      },
      team: {
        name: "Team",
        pricePerSeat: 30,
        minSeats: 2,
        features: ["Everything in Plus", "Admin console", "Higher limits"],
      },
      enterprise: {
        name: "Enterprise",
        pricePerSeat: 60,
        features: ["Unlimited GPT-4", "SSO", "Custom retention"],
      },
    },
  },
  anthropic_api: {
    displayName: "Anthropic API",
    category: "api",
    plans: {
      payg: {
        name: "Pay as you go",
        pricePerSeat: 0,
        features: ["Per token pricing", "All models"],
      },
    },
  },
  openai_api: {
    displayName: "OpenAI API",
    category: "api",
    plans: {
      payg: {
        name: "Pay as you go",
        pricePerSeat: 0,
        features: ["Per token pricing", "All models"],
      },
    },
  },
  gemini: {
    displayName: "Gemini",
    category: "general",
    plans: {
      free: {
        name: "Free",
        pricePerSeat: 0,
        features: ["Gemini 1.5 Flash", "Limited requests"],
      },
      pro: {
        name: "Google One AI Premium",
        pricePerSeat: 20,
        features: ["Gemini Advanced", "2TB storage", "Gmail AI"],
      },
      enterprise: {
        name: "Enterprise",
        pricePerSeat: 30,
        features: ["Gemini for Workspace", "Admin controls"],
      },
    },
  },
  windsurf: {
    displayName: "Windsurf",
    category: "coding",
    plans: {
      free: {
        name: "Free",
        pricePerSeat: 0,
        features: ["Limited flows", "Basic completions"],
      },
      pro: {
        name: "Pro",
        pricePerSeat: 15,
        features: ["Unlimited flows", "GPT-4o", "Claude 3.5"],
      },
      teams: {
        name: "Teams",
        pricePerSeat: 35,
        features: ["Everything in Pro", "Admin controls", "SSO"],
      },
    },
  },
};