import { sequence } from "@sveltejs/kit/hooks";
import { db, publicWrappedTable, slackSessionsTable } from "./lib/server/db";
import { eq } from "drizzle-orm";
import {
  fetchShips,
  fetchPerson,
  fetchPersonByRecordId,
  type Person,
} from "./lib/server/data";
import { getShop } from "./lib/server/shop";
import { error, redirect, type Handle } from "@sveltejs/kit";
import { getWrappedData } from "$lib/server/wrapped";

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

  let person: Person;
  if (slackSession.recordId) {
    person = await fetchPersonByRecordId(
      slackSession.recordId,
      slackSession.userId
    );
  } else {
    person = await fetchPerson(slackSession.userId);
  }
  if (!person) {
    // person = await airtable('people').create({
    //     email: slackSession.email,
    //     slack_id: slackSession.userId,
    // })
    throw new Error("Not creating an Airtable person record.");
  }
  event.locals.person = person;

  if (!slackSession.recordId) {
    await db
      .update(slackSessionsTable)
      .set({ recordId: person.recordId })
      .where(eq(slackSessionsTable.sessionId, slackSession.sessionId))
      .execute();
  }

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
    (async () => {
      const start = performance.now();
      if (event.url.pathname.includes("wrapped/U")) {
        const userId = event.params.id;
        if (!userId) return error(404, { message: "User not found" });

        const consent = await db
          .select()
          .from(publicWrappedTable)
          .where(eq(publicWrappedTable.userId, userId))
          .execute();

        if (!consent.length) {
          if (!event.locals.slackSession) {
            return error(401, { message: "Watch out, bucko" });
          }
          if (userId === event.locals.slackSession.userId) {
            await db
              .insert(publicWrappedTable)
              .values({
                userId: event.locals.slackSession.userId,
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

        console.log(`fetchOrders took ${performance.now() - start}ms`);
        event.locals.wrapped = wrapped;
      }
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
