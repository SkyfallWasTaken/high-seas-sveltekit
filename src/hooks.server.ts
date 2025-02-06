import { sequence } from "@sveltejs/kit/hooks";
import { db, slackSessionsTable } from "./lib/server/db";
import { eq } from "drizzle-orm";
import { fetchShips } from "./lib/server/data";
import { getShop } from "./lib/server/shop";
import { redirect, type Handle } from "@sveltejs/kit";
import { fetchPerson } from "./lib/server/person";

const slackMiddleware: Handle = async ({ event, resolve }) => {
  const start = performance.now();
  const sessionId = event.cookies.get("session");
  if (!sessionId) return resolve(event);
  const slackSessions = await db
    .select()
    .from(slackSessionsTable)
    .where(eq(slackSessionsTable.sessionId, sessionId))
    .execute();
  if (slackSessions.length === 0) {
    console.log(
      `slackMiddleware (early exit) took ${performance.now() - start}ms`
    );
    return resolve(event);
  }
  const slackSession = slackSessions[0];
  event.locals.slackSession = slackSession;

  console.log(`slackMiddleware took ${performance.now() - start}ms`);
  return resolve(event);
};

const personMiddleware: Handle = async ({ event, resolve }) => {
  const start = performance.now();
  const slackSession = event.locals.slackSession;
  if (!slackSession) return resolve(event);

  const person = await fetchPerson(slackSession.userId);
  if (!person) {
    // person = await airtable('people').create({
    //     email: slackSession.email,
    //     slack_id: slackSession.userId,
    // })
    throw new Error("Not creating an Airtable person record.");
  }
  event.locals.person = person;

  console.warn("Banlist is not being checked!");
  console.log(`personMiddleware took ${performance.now() - start}ms`);
  return resolve(event);
};

const loadDataMiddleware: Handle = async ({ event, resolve }) => {
  await Promise.all([
    (async () => {
      const start = performance.now();
      if (!event.locals.slackSession) return;

      event.locals.shopItems = await getShop();

      console.log(`loadShop took ${performance.now() - start}ms`);
    })(),
    (async () => {
      const start = performance.now();
      if (!event.locals.slackSession) return;

      const ships = await fetchShips(event.locals.slackSession.userId);
      event.locals.ships = ships;

      console.log(`loadShips took ${performance.now() - start}ms`);
    })(),
  ]);

  return resolve(event);
};

const redirectMiddleware: Handle = async ({ event, resolve }) => {
  if (
    !event.locals.slackSession &&
    event.url.pathname !== "/" &&
    event.url.pathname !== "/api/slack-callback" &&
    !event.url.pathname.includes("/wrapped/U")
  )
    return redirect(302, "/");
  return resolve(event);
};

const instrumentStartMiddleware: Handle = async ({ event, resolve }) => {
  console.log("Starting instrumentation");
  event.locals.startTime = performance.now();
  return resolve(event);
};

const instrumentEndMiddleware: Handle = async ({ event, resolve }) => {
  const endTime = performance.now();
  console.log(`Request took ${endTime - event.locals.startTime}ms`);
  return resolve(event);
};

export const handle = sequence(
  instrumentStartMiddleware,
  slackMiddleware,
  redirectMiddleware,
  personMiddleware,
  loadDataMiddleware,
  instrumentEndMiddleware
);
