import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import { eq } from "drizzle-orm";
import {
  Card,
  Text,
  Title,
  Badge,
  Stack,
  Group,
  Button,
  Divider,
  Alert,
  Image
} from "@mantine/core";
import Link from "next/link";





export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const itemId = Number(id);

  if (isNaN(itemId)) {
    return <Alert color="red">Neplatné ID</Alert>;
  }

  const [item] = await db
    .select()
    .from(inzeraty)
    .where(eq(inzeraty.id, itemId));

  if (!item) {
    return <Alert color="red">Inzerát nenalezen</Alert>;
  }


async function updateStav(formData: FormData) {
  "use server";

  const novyStav = String(formData.get("stav"));

  await db
    .update(inzeraty)
    .set({
      stav: novyStav,
    })
    .where(eq(inzeraty.id, itemId));
}



  return (
    <Stack>
      <Link href="/cs/prehled-inzeratu" style={{ textDecoration: "none" }}>
        <Button variant="light">← Zpět na bazar</Button>
      </Link>

      <Card shadow="sm" padding="lg" withBorder>

        {/* FAKE IMAGE */}
        <div
          style={{
            width: "100%",
            height: 180,
            backgroundColor: "#e9ecef",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#868e96",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          Obrázek
        </div>
        <Stack>
          <Group justify="space-between">
            <Title order={2}>{item.nazev}</Title>
            <Badge>{item.kategorie}</Badge>
          </Group>

          <Divider />

          <Text size="md">{item.popis}</Text>

          <Group justify="space-between">
            <Text fw={700} size="lg">
              {item.cena === 0 ? "Zdarma" : `${item.cena} Kč`}
            </Text>

            <Badge
              color={
                item.stav === "Dostupné"
                  ? "green"
                  : item.stav === "Rezervováno"
                  ? "yellow"
                  : item.stav === "Prodáno"
                  ? "red"
                  : "gray"
              }
            >
              {item.stav}
            </Badge>
          </Group>

          <Divider />

          <Alert title="Kontakt">
            <Stack gap={4}>
                <Text>
                  Prodejce: {item.prodejce}
                </Text>

                <Text>
                  Email: {item.email}
                </Text>
              </Stack>
          </Alert>

          <Text c="dimmed" size="sm">
            Stav: {item.stav}
          </Text>
            <form action={updateStav}>
              <Group>

                <Button
                  type="submit"
                  name="stav"
                  value="Dostupné"
                  color="green"
                  variant="light"
                >
                  Dostupné
                </Button>

                <Button
                  type="submit"
                  name="stav"
                  value="Rezervováno"
                  color="yellow"
                  variant="light"
                >
                  Rezervováno
                </Button>

                <Button
                  type="submit"
                  name="stav"
                  value="Prodáno"
                  color="red"
                  variant="light"
                >
                  Prodáno
                </Button>

              </Group>
            </form>
        </Stack>
      </Card>
    </Stack>
  );
}

