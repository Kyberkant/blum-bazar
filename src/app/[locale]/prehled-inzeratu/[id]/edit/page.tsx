import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import { eq } from "drizzle-orm";
import {
  Card,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Stack,
  Title,
  Checkbox,
  Group,
  Alert,
} from "@mantine/core";
import Link from "next/link";
import { redirect } from "@/i18n/navigation";
import { revalidatePath } from "next/cache";

async function updateInzerat(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await db
    .update(inzeraty)
    .set({
      nazev: String(formData.get("nazev")),
      popis: String(formData.get("popis")),
      cena: Number(formData.get("cena")),
      kategorie: String(formData.get("kategorie")),
      stav: String(formData.get("stav")),
      prodejce: String(formData.get("prodejce")),
      email: String(formData.get("email")),
      obrazek: String(formData.get("obrazek")),
    })
    .where(eq(inzeraty.id, id));

  revalidatePath(`/cs/prehled-inzeratu/${id}`);
  redirect(`/cs/prehled-inzeratu/${id}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const inzeratId = Number(id);

  if (isNaN(inzeratId)) {
    return <Alert color="red">Neplatné ID</Alert>;
  }

  const [inzerat] = await db
    .select()
    .from(inzeraty)
    .where(eq(inzeraty.id, inzeratId));

  if (!inzerat) {
    return <Alert color="red">Inzerát nenalezen</Alert>;
  }

  const zdarma = FormData.get("zdarma") === "on";

  return (
    <Stack>
      {/* BACK BUTTON */}
      <Link
        href={`/cs/prehled-inzeratu/${inzerat.id}`}
        style={{ textDecoration: "none" }}
      >
        <Button variant="light">← Zpět na detail</Button>
      </Link>

      {/* FORM */}
      <Card shadow="sm" padding="lg" withBorder maw={600}>
        <form action={updateInzerat}>
          <Stack>
            <Title order={2}>Upravit inzerát</Title>

            <TextInput
              label="Název věci"
              defaultValue={inzerat.nazev}
            />

            <Textarea
              label="Popis"
              defaultValue={inzerat.popis}
            />

            <NumberInput
              label="Cena"
              defaultValue={inzerat.cena}
            />

            <Select
              label="Kategorie"
              defaultValue={inzerat.kategorie}
              data={[
                "Elektronika",
                "Sport",
                "Nábytek",
                "Oblečení",
                "Knihy",
                "Dětské věci",
                "Ostatní",
              ]}
            />

            <Select
              label="Stav"
              defaultValue={inzerat.stav}
              data={[
                "Dostupné",
                "Rezervováno",
                "Prodáno",
              ]}
            />

            <TextInput
              label="Jméno prodejce"
              defaultValue={inzerat.prodejce}
            />

            <TextInput
              label="Email"
              defaultValue={inzerat.email}
            />

            <TextInput
              label="URL obrázku"
              // defaultValue={inzerat.obrazek}
            />

            <Checkbox
              label="Zdarma"
              defaultChecked={inzerat.cena === 0}
            />

            <Group>
              <Button type="submit" color="green">
                Uložit změny

              </Button>

              <input type="hidden" name="id" value={inzerat.id} />

              <Link
                href={`/cs/prehled-inzeratu/${inzerat.id}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="light">
                  Zrušit
                </Button>
              </Link>
            </Group>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}



