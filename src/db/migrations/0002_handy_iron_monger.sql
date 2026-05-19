CREATE TABLE `inzeraty` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nazev` text NOT NULL,
	`popis` text NOT NULL,
	`cena` integer NOT NULL,
	`kategorie` text NOT NULL,
	`stav` text NOT NULL,
	`rezervovano` integer NOT NULL
);
