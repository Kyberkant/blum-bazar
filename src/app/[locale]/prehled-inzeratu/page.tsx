import { Card, Text, Title, Badge, Stack, Group, SimpleGrid, Button } from "@mantine/core";
import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import Link from "next/link";



export default async function Page()
{
  const data = await db.select().from(inzeraty);

  return (

    <Stack>

      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>Bazar</Title>
          <Text c="dimmed" size="sm">
            Prohlížej si inzeráty ostatních uživatelů nebo najdi něco, co se ti hodí.
          </Text>
        </div>

        <Button variant="filled" color="blue">
          Přidat položku
        </Button>
      </Group>

      <Title order={2}>inzeráty</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {data.map((item) => (
                <Link href={`/inzeraty/${item.id}`} style={{ textDecoration: "none" }}>
                  <Card shadow="sm" padding="md" withBorder>
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

                        <Badge color="gray">{item.stav}</Badge>
                      </Group>

                      <Badge
                        color={item.rezervovano ? "red" : "green"}
                        variant="light"
                      >
                        {item.rezervovano ? "Rezervováno" : "Volné"}
                      </Badge>
                    </Stack>
                  </Card>
                </Link>
      ))}
      </SimpleGrid>

    </Stack>
  );
}

// inzeraty.map(...)
// prochází seznam a vytváří UI

//Card
//jeden inzerát = jedna karta

//Stack
//věci pod sebou

//Group
//věci vedle sebe

//Badge
//malé štítky (kategorie, stav)

//schéma tabulek najdete v src/db/schemas/,

//roadmap

//  2. tlačítko „detail“

// → /inzeraty/1

//  3. filtr

// → kategorie

//  4. reálná data z DB

// → Drizzle + SQLite
