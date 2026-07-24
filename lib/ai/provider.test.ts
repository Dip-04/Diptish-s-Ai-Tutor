import { afterEach, describe, expect, it, vi } from "vitest";
import { AIConfigurationError, OpenAIProvider } from "./provider";

const originalKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.OPENAI_TEXT_MODEL;

afterEach(() => {
  vi.unstubAllGlobals();
  process.env.OPENAI_API_KEY = originalKey;
  process.env.OPENAI_TEXT_MODEL = originalModel;
});

describe("OpenAIProvider", () => {
  it("fails clearly without server configuration and never calls fetch", async () => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_TEXT_MODEL;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(new OpenAIProvider().evaluateAnswer(
      { question: "Explain authentication.", answer: "Authentication verifies the identity of a user." },
      "test-user"
    )).rejects.toBeInstanceOf(AIConfigurationError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an empty structured response", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_TEXT_MODEL = "test-model";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ output: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })));

    await expect(new OpenAIProvider().evaluateAnswer(
      { question: "Explain authentication.", answer: "Authentication verifies the identity of a user." },
      "test-user"
    )).rejects.toThrow("no structured output");
  });
});
