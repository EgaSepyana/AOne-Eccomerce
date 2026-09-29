import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_MODE: z.enum(["mock", "live"]).default("mock"),
  NEXT_PUBLIC_MOCK_LATENCY: z.coerce.number().int().min(0).default(450),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
  NEXT_PUBLIC_MOCK_LATENCY: process.env.NEXT_PUBLIC_MOCK_LATENCY,
});
