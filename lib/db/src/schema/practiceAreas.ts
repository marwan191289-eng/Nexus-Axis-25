import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const practiceAreasTable = pgTable("practice_areas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  details: text("details").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertPracticeAreaSchema = createInsertSchema(practiceAreasTable).omit({ id: true });
export type InsertPracticeArea = z.infer<typeof insertPracticeAreaSchema>;
export type PracticeArea = typeof practiceAreasTable.$inferSelect;
