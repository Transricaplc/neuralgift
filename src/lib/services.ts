export type AIService = {
  id: string;
  name: string;
  category: "LLM" | "Image" | "Voice" | "Code";
  cost: number;
  blurb: string;
  color: string;
};

export const AI_SERVICES: AIService[] = [
  { id: "chatgpt", name: "ChatGPT Plus", category: "LLM", cost: 20, blurb: "OpenAI's flagship assistant", color: "#10A37F" },
  { id: "claude", name: "Claude Pro", category: "LLM", cost: 20, blurb: "Anthropic's thoughtful model", color: "#D97757" },
  { id: "perplexity", name: "Perplexity Pro", category: "LLM", cost: 20, blurb: "Answers with sources", color: "#20B8CD" },
  { id: "midjourney", name: "Midjourney Basic", category: "Image", cost: 10, blurb: "Generative image art", color: "#C7B8FF" },
  { id: "runway", name: "Runway Standard", category: "Image", cost: 15, blurb: "Video & motion AI", color: "#75FB4C" },
  { id: "elevenlabs", name: "ElevenLabs Starter", category: "Voice", cost: 11, blurb: "Realistic voice synthesis", color: "#F5C542" },
  { id: "cursor", name: "Cursor Pro", category: "Code", cost: 20, blurb: "AI pair programmer", color: "#8B5CF6" },
];
