import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const inzeraty = sqliteTable("inzeraty", {
  id: integer().primaryKey({ autoIncrement: true }),

  nazev: text().notNull(),
  popis: text().notNull(),

  cena: integer().notNull(),

  kategorie: text().notNull(),
  stav: text().notNull(),

  rezervovano: integer().notNull(),

  prodejce: text().notNull(),
  email: text().notNull(),

  obrazek: text(),

  userId: text().notNull(),

  iban: text("iban").notNull(),

  reservedBy: text("reservedBy"),
});

export type Inzerat = typeof inzeraty.$inferSelect;


//nove data npm run db:studio
