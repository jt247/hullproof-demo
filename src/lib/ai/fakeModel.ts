// Deterministic stand in for a hosted model, so the demo needs no provider.
// It reads the whole prompt and acts on tool markers like [[tool:name {"a":1}]].

export type ToolCall = { name: string; args: Record<string, unknown> };
export type ModelReply = { text: string; toolCalls: ToolCall[] };

const MARKER = /\[\[tool:(\w+)\s+(\{.*?\})\]\]/g;

export async function complete(input: { system: string; prompt: string }): Promise<ModelReply> {
  const toolCalls: ToolCall[] = [];
  for (const match of input.prompt.matchAll(MARKER)) {
    try {
      toolCalls.push({ name: match[1], args: JSON.parse(match[2]) as Record<string, unknown> });
    } catch {
      // ignore malformed markers
    }
  }
  const visible = input.prompt.replace(MARKER, "").trim();
  return { text: `Summary: ${visible.slice(0, 200)}`, toolCalls };
}
