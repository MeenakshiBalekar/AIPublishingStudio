import Anthropic from "@anthropic-ai/sdk";

/**
 * The single provider abstraction. Every AI service calls Claude through this one place, so
 * swapping models, adding retries, or changing providers happens here and nowhere else.
 *
 * If ANTHROPIC_API_KEY is not set, we fall back to a deterministic stub so the whole
 * publishing workflow (projects, assets, generation, editing, versioning, checklist) can be
 * built and demoed without a key. Wire the key in and real generation turns on with no code
 * changes.
 */
export interface GenerateOptions {
  system: string;
  prompt: string;
  maxTokens?: number;
}

export interface AiClient {
  readonly usingStub: boolean;
  generate(options: GenerateOptions): Promise<string>;
}

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

class AnthropicClient implements AiClient {
  readonly usingStub = false;
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generate({ system, prompt, maxTokens = 2048 }: GenerateOptions): Promise<string> {
    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }],
    });

    // Safety classifiers can decline on the newest models — check before reading content.
    if (response.stop_reason === "refusal") {
      throw new Error("The model declined to generate this content.");
    }

    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();
  }
}

/**
 * Deterministic offline stub. Produces plausible, clearly-labelled placeholder text derived
 * from the prompt so the UI and workflow are fully exercisable without a key.
 */
class StubClient implements AiClient {
  readonly usingStub = true;

  async generate({ prompt }: GenerateOptions): Promise<string> {
    const topic = extractTopic(prompt);
    return [
      `‹sample output — set ANTHROPIC_API_KEY for real generation›`,
      "",
      `This is placeholder copy generated for “${topic}”.`,
      `Once your Anthropic API key is configured, this service will produce`,
      `on-brand, ready-to-publish content using your Brand Profile.`,
    ].join("\n");
  }
}

/** Pull a short label out of the prompt for the stub's placeholder text. */
function extractTopic(prompt: string): string {
  const match = prompt.match(/title[:\s]+([^\n]{3,80})/i);
  if (match) return match[1].trim();
  return prompt.split("\n").find((l) => l.trim().length > 8)?.slice(0, 60).trim() || "your content";
}

let cached: AiClient | null = null;

/** Get the active AI client (Anthropic if a key is present, otherwise the stub). */
export function getAiClient(): AiClient {
  if (cached) return cached;
  const key = process.env.ANTHROPIC_API_KEY;
  cached = key ? new AnthropicClient(key) : new StubClient();
  return cached;
}
