
import { Card, Text, Title, Badge, Stack, Group, SimpleGrid, Button, TextInput } from "@mantine/core";
import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import Link from "next/link";



export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
})
{
  const { search } = await searchParams;
  const data = await db.select().from(inzeraty);

  const filtered = data.filter((item) =>
  (item.nazev + item.popis)
    .toLowerCase()
    .includes((search || "").toLowerCase())
  );

  return (

    <Stack gap="md">

      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>Bazar</Title>
          <Text c="dimmed" size="sm">
            Prohlížej si inzeráty ostatních uživatelů nebo najdi něco, co se ti hodí.
          </Text>
        </div>

        <Link href="/cs/prehled-inzeratu/novy"
        style={{ textDecoration: "none" }}>

          <Button variant="filled" color="blue">
            Přidat položku
          </Button>
        </Link>
      </Group>

      <form>
        <TextInput
          name="search"
          placeholder="Hledat podle názvu nebo popisu..."
          defaultValue={search}
        />
      </form>

      <Title order={2}>inzeráty</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/cs/prehled-inzeratu/${item.id}`}
            style={{ textDecoration: "none" }}
          >
            <Card shadow="sm" padding="md" withBorder style={{ cursor: "pointer"}}>

              <Stack>
                <Group justify="space-between">
                  <Text fw={600}>{item.nazev}</Text>
                  <Badge color="blue">{item.kategorie}</Badge>
                </Group>

                <Text size="sm">{item.popis}</Text>

                <Group justify="space-between">
                  <Text fw={700}>
                    {item.cena === 0 ? "Zdarma" : `${item.cena} Kč`}
                  </Text>


                  <Badge
                    color={
                      item.stav === "Dostupné"
                        ? "green"
                        : item.stav === "Rezervováno"
                        ? "yellow"
                        : "red"
                    }
                    variant="light"
                    size="sm"
                  >
                    {item.stav}
                  </Badge>
                </Group>

              </Stack>
            </Card>
          </Link>
        ))}
      </SimpleGrid>

    </Stack>
  );
}

