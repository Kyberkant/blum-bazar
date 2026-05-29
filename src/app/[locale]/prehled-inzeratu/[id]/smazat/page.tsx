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
  Divider,
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
    <Stack align="center" mt={60}>
      <Card
        withBorder
        shadow="sm"
        radius="md"
        maw={520}
        w="100%"
        style={{
          borderLeft: "4px solid #ff6b00",
        }}
      >
        <Stack gap="md">
          {/* HEADER */}
          <Group justify="space-between">
            <Title order={2}>Smazání inzerátu</Title>
          </Group>

          <Divider />

          {/* WARNING */}
          <Alert color="orange" title="Pozor">
            Tato akce je nevratná. Inzerát bude trvale odstraněn.
          </Alert>

          {/* ITEM INFO */}
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Opravdu chceš smazat tento inzerát?
            </Text>

            <Text fw={700} size="lg">
              {item.nazev}
            </Text>
          </Stack>

          <Divider />

          {/* ACTIONS */}
          <Group justify="space-between">
            <Link
              href={`/cs/prehled-inzeratu/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="light" color="gray">
                Zrušit
              </Button>
            </Link>

            <form action={deleteInzerat}>
              <input type="hidden" name="id" value={item.id} />

              <Button
                type="submit"
                color="orange"
                style={{
                  backgroundColor: "#ff6b00",
                }}
              >
                Ano, smazat
              </Button>
            </form>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}
