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
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateInzerat(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const zdarma = formData.get("zdarma") === "on";

  const nazev = String(formData.get("nazev") || "").trim();
  const popis = String(formData.get("popis") || "").trim();
  const kategorie = String(formData.get("kategorie") || "").trim();
  const stav = String(formData.get("stav") || "").trim();
  const prodejce = String(formData.get("prodejce") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const obrazek = String(formData.get("obrazek") || "").trim();

  if (
    !nazev ||
    !popis ||
    !kategorie ||
    !stav ||
    !prodejce ||
    !email
  ) {
    redirect(`/cs/prehled-inzeratu/${id}/edit?error=1`);
  }

  if (!email.includes("@")) {
  redirect(`/cs/prehled-inzeratu/${id}/edit?error=1`);
  }

  await db
    .update(inzeraty)
    .set({
      nazev,
      popis,
      cena: zdarma ? 0 : Number(formData.get("cena")),
      kategorie,
      stav,
      prodejce,
      email,
      obrazek,
    })
    .where(eq(inzeraty.id, id));



  revalidatePath(`/cs/prehled-inzeratu/${id}`);
  redirect(`/cs/prehled-inzeratu/${id}`);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
})
{
  const { id } = await params;
  const { error } = await searchParams;

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



  return (
    <Stack>
      {/* BACK BUTTON */}
      <Link
        href={`/cs/prehled-inzeratu/${inzerat.id}`}
        style={{ textDecoration: "none" }}
      >
        <Button variant="light">← Zpět na detail</Button>
      </Link>

      {error && (
        <Alert color="red" title="Chyba">
          Vyplň všechna povinná pole
        </Alert>
      )}

      {/* FORM */}
      <Card shadow="sm" padding="lg" withBorder maw={600}>
        <form action={updateInzerat}>
          <Stack>
            <Title order={2}>Upravit inzerát</Title>

            <TextInput
              label="Název věci"
              defaultValue={inzerat.nazev}
              name="nazev"
            />

            <Textarea
              label="Popis"
              defaultValue={inzerat.popis}
              name="popis"
            />

            <NumberInput
              label="Cena"
              defaultValue={inzerat.cena}
              name="cena"
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
              name="kategorie"
            />

            <Select
              label="Stav"
              defaultValue={inzerat.stav}
              data={[
                "Dostupné",
                "Rezervováno",
                "Prodáno",
              ]}
              name="stav"
            />

            <TextInput
              label="Jméno prodejce"
              defaultValue={inzerat.prodejce}
              name="prodejce"
            />

            <TextInput
              label="Email"
              defaultValue={inzerat.email}
              name="email"
            />

            <TextInput
              label="URL obrázku"
              name="obrazek"
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



