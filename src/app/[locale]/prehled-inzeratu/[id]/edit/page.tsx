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
  FileInput
} from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import fs from "fs/promises";
import path from "path";

import InzeratForm from "@/components/InzeratForm";

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

  const file = formData.get("obrazekFile") as File;

  let imagePath = obrazek || String(formData.get("oldObrazek") || "");

  // upload nového obrázku
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

  if (!email ||!email.includes("@")) {
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
      obrazek: imagePath,
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
  const user = await currentUser();


  const isAdmin = (user?.publicMetadata as any)?.role === "admin";


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

  if (!inzerat || (inzerat.userId !== user?.id && !isAdmin)) {
    notFound();
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
          <InzeratForm  inzerat={inzerat}/>


              <input type="hidden" name="id" value={inzerat.id} />

              <input
                type="hidden"
                name="oldObrazek"
                value={inzerat.obrazek || ""}
              />

        </form>
      </Card>
    </Stack>
  );
}



// !email.includes("@") nefunguje
