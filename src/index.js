import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

const response = await openai.responses.parse({
  model: process.env.OPENAI_MODEL,
  input: [
    {
      role: "system",
      content:
        "You are a helpful math tutor. Guide the user through the solution step by step.",
    },
    { role: "user", content: "how can I solve 8x + 7 = -23" },
  ],
  text: {
    format: zodTextFormat(MathReasoning, "math_reasoning"),
  },
});

const math_reasoning = response.output_parsed;
