

import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Checkbox,
  Button,
  Card,
  Stack,
  Title,
  FileInput
} from "@mantine/core";

import Link from "next/link";

import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import fs from "fs/promises";
import path from "path";

export default function Page() {


  async function createInzerat(formData: FormData) {
    "use server";

    const zdarma = formData.get("zdarma") === "on";

    const { userId } = await auth();

    if (!userId) {
      throw new Error("Nepřihlášený uživatel");
    }

    // URL fallback
    const imageUrl = String(formData.get("obrazek") || "");

    // uploaded file
    const file = formData.get("obrazekFile") as File;

    let imagePath = imageUrl;

    // upload image
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;

      const uploadPath = path.join(
        process.cwd(),
        "public/uploads",
        fileName
      );

      await fs.writeFile(uploadPath, buffer);

      imagePath = `/uploads/${fileName}`;
    }

    // DB insert
    await db.insert(inzeraty).values({
      nazev: String(formData.get("nazev")),
      popis: String(formData.get("popis")),

      cena: zdarma
        ? 0
        : Number(formData.get("cena")),

      kategorie: String(formData.get("kategorie")),
      stav: String(formData.get("stav")),

      rezervovano: 0,

      prodejce: String(formData.get("prodejce")),
      email: String(formData.get("email")),

      obrazek: imagePath,

      userId: userId,
    });

    redirect("/cs/prehled-inzeratu");
  }

  return (
    <Stack>

      <Link
        href="/cs/prehled-inzeratu"
        style={{ textDecoration: "none" }}
      >
        <Button variant="light" w="fit-content">
          ← Zpět na bazar
        </Button>
      </Link>

      <Card shadow="sm" padding="lg" withBorder maw={500}>
        <form action={createInzerat}>
          <Stack>

            <Title order={2}>Nový inzerát</Title>

            <TextInput
              label="Název věci"
              name="nazev"
              placeholder="Např. Herní notebook"
              required
            />

            <Textarea
              label="Popis"
              name="popis"
              placeholder="Popis inzerátu..."
              required
            />

            <NumberInput
              label="Cena"
              name="cena"
              placeholder="5000"
              disabled={false}

            />

            <Checkbox
              label="Zdarma"
              name="zdarma"
              description="Pokud je inzerát zdarma, cena bude automaticky 0"

            />

            <Select
              label="Kategorie"
              name="kategorie"
              data={[
                "Elektronika",
                "Sport",
                "Nábytek",
                "Oblečení",
                "Knihy",
                "Dětské věci",
                "Ostatní"
              ]}
              required
            />

            <Select
              label="Stav inzerátu"
              name="stav"
              data={[
                "Dostupné",
                "Rezervované",
                "Prodáno",
              ]}
              required
            />

            <TextInput
              label="Jméno prodejce"
              name="prodejce"
              placeholder="Jan Novák"
              required
            />

            <TextInput
              label="Email"
              name="email"
              placeholder="email@example.com"
              required
            />

            <TextInput
              label="URL obrázku"
              name="obrazek"
              placeholder="https://..."

            />

            <FileInput
              label="Obrázek"
              name="obrazekFile"
              accept="image/png,image/jpeg,image/webp"
              description="Pokud nahraješ obrázek i zadáš URL, použije se nahraný obrázek."

            />

            <Button type="submit">
              Přidat inzerát
            </Button>

          </Stack>
        </form>
      </Card>
    </Stack>
  );
}

// TODO zablokovat cenu když je zaškrtnuto zdarma
