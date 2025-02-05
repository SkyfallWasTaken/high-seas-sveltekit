import { error } from "@sveltejs/kit";
import { getWrappedData } from "$lib/server/wrapped";

export async function GET({ locals }) {
  if (!locals.slackSession || !locals.person || !locals.ships)
    return error(401, { message: "Not logged in" });

  const wrapped = await getWrappedData(
    locals.slackSession.userId,
    locals.person,
    locals.ships
  );

  return new Response(JSON.stringify(wrapped), {
    headers: { "Content-Type": "application/json" },
  });
}
