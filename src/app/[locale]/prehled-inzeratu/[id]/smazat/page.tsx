import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import { eq } from "drizzle-orm";

import {
  Card,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Alert,
} from "@mantine/core";

import Link from "next/link";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

async function deleteInzerat(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));


  const [item] = await db
    .select()
    .from(inzeraty)
    .where(eq(inzeraty.id, id));



  await db
    .delete(inzeraty)
    .where(eq(inzeraty.id, id));

  redirect("/cs/prehled-inzeratu");
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const itemId = Number(id);
  const { userId } = await auth();
  const [item] = await db
    .select()
    .from(inzeraty)
    .where(eq(inzeraty.id, itemId));

  const user = await currentUser();


  const isAdmin = (user?.publicMetadata as any)?.role === "admin";

  if (!item) {
    return (
      <Alert color="red">
        Inzerát nenalezen
      </Alert>
    );
  }

  if (!item || (item.userId !== user?.id && !isAdmin)) {
    notFound();
  }

  return (
    <Stack maw={500}>
      <Card withBorder padding="lg">
        <Stack>

          <Title order={2}>
            Smazat inzerát
          </Title>

          <Alert color="red" title="Varování">
            Tato akce je nevratná.
          </Alert>

          <Text>
            Opravdu chceš smazat:
          </Text>

          <Text fw={700}>
            {item.nazev}
          </Text>

          <Group>

            <form action={deleteInzerat}>
              <input
                type="hidden"
                name="id"
                value={item.id}
              />

              <Button
                type="submit"
                color="red"
              >
                Ano, smazat
              </Button>
            </form>

            <Link
              href={`/cs/prehled-inzeratu/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="light">
                Zrušit
              </Button>
            </Link>

          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}
