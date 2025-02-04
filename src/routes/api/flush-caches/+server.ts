import { error, redirect } from "@sveltejs/kit";
import { db, cacheFlushesTable } from "$lib/server/db";
import { shipsCache, personCache } from "$lib/server/data";

export async function GET({ locals }) {
  if (!locals.slackSession) {
    return error(401, { message: "Not logged in" });
  }

  await db.insert(cacheFlushesTable).values({
    userId: locals.slackSession.userId,
    timestamp: new Date().toISOString(),
  });

  shipsCache.delete(`${locals.slackSession.userId}-all`);
  personCache.delete(locals.slackSession.userId);
  throw redirect(308, "/shipyard");
}
