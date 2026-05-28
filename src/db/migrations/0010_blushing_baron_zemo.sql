PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_inzeraty` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nazev` text NOT NULL,
	`popis` text NOT NULL,
	`cena` integer NOT NULL,
	`kategorie` text NOT NULL,
	`stav` text NOT NULL,
	`rezervovano` integer NOT NULL,
	`prodejce` text NOT NULL,
	`email` text NOT NULL,
	`obrazek` text,
	`userId` text NOT NULL,
	`iban` text NOT NULL,
	`reserved_by` text
);
--> statement-breakpoint
INSERT INTO `__new_inzeraty`("id", "nazev", "popis", "cena", "kategorie", "stav", "rezervovano", "prodejce", "email", "obrazek", "userId", "iban", "reserved_by") SELECT "id", "nazev", "popis", "cena", "kategorie", "stav", "rezervovano", "prodejce", "email", "obrazek", "userId", "iban", "reserved_by" FROM `inzeraty`;--> statement-breakpoint
DROP TABLE `inzeraty`;--> statement-breakpoint
ALTER TABLE `__new_inzeraty` RENAME TO `inzeraty`;--> statement-breakpoint
PRAGMA foreign_keys=ON;