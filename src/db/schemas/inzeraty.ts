import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const inzeraty = sqliteTable("inzeraty", {
  id: integer().primaryKey({ autoIncrement: true }),

  nazev: text().notNull(),
  popis: text().notNull(),

  cena: integer().notNull(),
  kategorie: text().notNull(),

  stav: text().notNull(), // třeba "Použité"
  rezervovano: integer().notNull(), // 0 = false, 1 = true

  // obrazek: text().notNull().default(""),
   obrazek: text().notNull().default("/obrazky/test.png")
});

export type Inzerat = typeof inzeraty.$inferSelect;


//nove data npm run db:studio
