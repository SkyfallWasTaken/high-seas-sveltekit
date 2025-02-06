import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const slackSessionsTable = sqliteTable("slack_sessions", {
  sessionId: text().primaryKey(),
  userId: text().notNull(),
  name: text().notNull(),
  firstName: text().notNull(),
  pfp: text().notNull(),
  email: text().notNull(),
});

export const cacheFlushesTable = sqliteTable("cache_flushes", {
  userId: text().notNull(),
  timestamp: text().notNull(),
});

export const publicWrappedTable = sqliteTable("public_wrapped", {
  userId: text().primaryKey(),
  timestamp: text().notNull(),
});

export type SlackSession = typeof slackSessionsTable.$inferSelect;
