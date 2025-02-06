import { drizzle } from "drizzle-orm/libsql";
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from "$env/static/private";

export const db = drizzle({
  connection: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
});

export {
  slackSessionsTable,
  cacheFlushesTable,
  publicWrappedTable,
  shopOrdersTable,
  type SlackSession,
} from "./schema";
