import { redirect, error } from "@sveltejs/kit";

export async function load({ locals }) {
  throw redirect(301, `/wrapped/${locals.slackSession?.userId}`);
}
