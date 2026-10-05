import { db } from "../db";

export type ToolContext = { userId: string };

export const outbox: { to: string; text: string }[] = [];

type Tool = (args: Record<string, unknown>, ctx: ToolContext) => unknown;

export const tools: Record<string, Tool> = {
  read_note: (args) => {
    return db.prepare("SELECT id, title, body FROM notes WHERE id = ?").get(String(args.noteId)) ?? null;
  },
  archive_note: (args, ctx) => {
    db.prepare("UPDATE notes SET archived = 1 WHERE id = ? AND owner_id = ?").run(String(args.noteId), ctx.userId);
    return { archived: true };
  },
  email_summary: (args) => {
    outbox.push({ to: String(args.to), text: String(args.text) });
    return { queued: true };
  },
};
