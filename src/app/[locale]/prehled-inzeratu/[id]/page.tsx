import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import { eq } from "drizzle-orm";
import { Card, Text, Title, Badge, Stack, Group, Button, Divider, Alert} from "@mantine/core";
import Link from "next/link";


export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  const [item] = await db
    .select()
    .from(inzeraty)
    .where(eq(inzeraty.id, id));

  if (!item) {
    return <Alert color="red">Inzerát nenalezen</Alert>;
  }

  return (
    <Stack>
      {/* ZPĚT */}
      <Button component={Link} href="/inzeraty" variant="light">
        ← Zpět na bazar
      </Button>

      {/* DETAIL */}
      <Card shadow="sm" padding="lg" withBorder>
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

            <Badge color={item.rezervovano ? "red" : "green"}>
              {item.rezervovano ? "Rezervováno" : "Volné"}
            </Badge>
          </Group>

          <Divider />

          <Alert title="Kontakt">
            Kontakt na prodávajícího: +420 123 456 789
          </Alert>

          <Text c="dimmed" size="sm">
            Stav: {item.stav}
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
