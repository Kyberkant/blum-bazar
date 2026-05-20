PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_inzeraty` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nazev` text NOT NULL,
	`popis` text NOT NULL,
	`cena` integer NOT NULL,
	`kategorie` text NOT NULL,
	`stav` text NOT NULL,
	`rezervovano` integer NOT NULL,
	`obrazek` text DEFAULT 'public/test.png' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_inzeraty`("id", "nazev", "popis", "cena", "kategorie", "stav", "rezervovano", "obrazek") SELECT "id", "nazev", "popis", "cena", "kategorie", "stav", "rezervovano", "obrazek" FROM `inzeraty`;--> statement-breakpoint
DROP TABLE `inzeraty`;--> statement-breakpoint
ALTER TABLE `__new_inzeraty` RENAME TO `inzeraty`;--> statement-breakpoint
PRAGMA foreign_keys=ON;