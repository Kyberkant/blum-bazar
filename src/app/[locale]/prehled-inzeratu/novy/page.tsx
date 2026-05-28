
import {
  Button,
  Card,
  Stack,
} from "@mantine/core";

import Link from "next/link";

import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import fs from "fs/promises";
import path from "path";
import InzeratForm from "@/components/InzeratForm";

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
        : Math.max(0, Number(formData.get("cena"))),

      kategorie: String(formData.get("kategorie")),
      stav: String(formData.get("stav")),

      rezervovano: 0,

      prodejce: String(formData.get("prodejce")),
      email: String(formData.get("email")),

      obrazek: imagePath,

      userId: userId,

      iban: String(formData.get("iban") || ""),
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
          <InzeratForm />
        </form>
      </Card>
    </Stack>
  );
}

