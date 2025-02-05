import { error } from "@sveltejs/kit";
import { db, cacheFlushesTable } from "$lib/server/db";
import { flushCaches } from "$lib/server/data";

export async function POST({ locals }) {
  if (!locals.slackSession) {
    return error(401, { message: "Not logged in" });
  }

  await db.insert(cacheFlushesTable).values({
    userId: locals.slackSession.userId,
    timestamp: new Date().toISOString(),
  });

  flushCaches(locals.slackSession.userId);
  console.log(`Flushed caches for ${locals.slackSession.userId}`);
  return new Response("OK");
}
