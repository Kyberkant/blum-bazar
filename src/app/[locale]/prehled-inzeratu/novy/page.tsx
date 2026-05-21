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
} from "@mantine/core";

import Link from "next/link";

import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import { redirect } from "next/navigation";


export default function Page() {


  async function createInzerat(formData: FormData) {
    "use server";

    const zdarma = formData.get("zdarma") === "on";

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

      obrazek: String(formData.get("obrazek") || ""),
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
                "Nové",
                "Použité",
                "Poškozené",
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

            <Button type="submit">
              Přidat inzerát
            </Button>

          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
