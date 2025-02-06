import { error } from "@sveltejs/kit";
import { getWrappedData } from "$lib/server/wrapped";
import { db, publicWrappedTable } from "$lib/server/db";
import { fetchPerson, fetchShips } from "$lib/server/data";
import { eq } from "drizzle-orm";

export async function load({ locals, params }) {
  if (!locals.slackSession) return error(401, { message: "Not logged in" });

  const userId = params.id;
  const consent = await db
    .select()
    .from(publicWrappedTable)
    .where(eq(publicWrappedTable.userId, userId))
    .execute();

  if (!consent.length) {
    if (userId === locals.slackSession.userId) {
      await db
        .insert(publicWrappedTable)
        .values({
          userId: locals.slackSession.userId,
          timestamp: new Date().toISOString(),
        })
        .execute();
    } else {
      return error(401, { message: "Watch out bucko" });
    }
  }

  const person = await fetchPerson(userId);
  const ships = await fetchShips(userId);
  const wrapped = await getWrappedData(userId, person, ships);

  return { wrapped };
}
