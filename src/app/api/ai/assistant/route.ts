import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { json, unauthorized, withErrors } from "@/lib/http";
import { AI_DAILY_REQUESTS_PER_USER } from "@/lib/config";
import { complete } from "@/lib/ai/fakeModel";
import { tools } from "@/lib/ai/tools";

const Body = z.object({ question: z.string(), noteId: z.string().optional() });

const SYSTEM = "You help people work with their notes. You can call read_note, archive_note and email_summary.";

const usage = new Map<string, { day: string; count: number }>();

function underBudget(userId: string): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const entry = usage.get(userId);
  const count = entry && entry.day === day ? entry.count : 0;
  if (count >= AI_DAILY_REQUESTS_PER_USER) return false;
  usage.set(userId, { day, count: count + 1 });
  return true;
}

export const POST = withErrors(async (req) => {
  const user = currentUser(req);
  if (!user) return unauthorized();
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Ask a question" }, 400);
  if (!underBudget(user.id)) return json({ error: "Daily limit reached" }, 429);

  let context = "";
  if (parsed.data.noteId) {
    const note = db
      .prepare("SELECT title, body FROM notes WHERE id = ? AND owner_id = ?")
      .get(parsed.data.noteId, user.id) as { title: string; body: string } | undefined;
    if (note) context = `Note "${note.title}":\n${note.body}\n\n`;
  }

  const reply = await complete({ system: SYSTEM, prompt: `${context}Question: ${parsed.data.question}` });

  const results = reply.toolCalls.map((call) => {
    const tool = tools[call.name];
    return { tool: call.name, result: tool ? tool(call.args, { userId: user.id }) : null };
  });
  return json({ answer: reply.text, results });
});
