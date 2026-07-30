import { prisma } from "./prisma";
import { serializeJson } from "@/lib/utils/json";

/**
 * Append an entry to the activity log. Best-effort: logging must never break the primary
 * action, so failures are swallowed. Powers the dashboard "Recent Activity" feed.
 */
export async function logActivity(entry: {
  action: string;
  message: string;
  projectId?: string;
  meta?: unknown;
}): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        action: entry.action,
        message: entry.message,
        projectId: entry.projectId ?? null,
        meta: serializeJson(entry.meta),
      },
    });
  } catch (err) {
    console.error("Failed to log activity", err);
  }
}
