import { Card, Text, Title, Badge, Stack, Group, SimpleGrid } from "@mantine/core";

const inzeraty = [
  {
    id: 1,
    nazev: "Inzerát 1",
    popis: "Popis inzerátu 1",
    cena: 9000,
    kategorie: "elektronika",
    stav: "použité"
  },
  {
    id: 2,
    nazev: "Notebook Lenovo",
    popis: "Herní notebook, dobrý stav",
    cena: 0,
    kategorie: "Elektronika",
    stav: "Použité",
  },
  {
    id: 3,
    nazev: "Kolo",
    popis: "Starší kolo, ale funkční",
    cena: 1500,
    kategorie: "Sport",
    stav: "Použité",
  }
];

export default function Page()
{
  return (
    <Stack>
      <Title order={2}>Bazarové inzeráty</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {inzeraty.map((item) => (
            <Card key={item.id} shadow="sm" padding="md" withBorder>
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
              </Stack>
            </Card>
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
//  1. grid layout

// → 2–3 karty vedle sebe

//  2. tlačítko „detail“

// → /inzeraty/1

//  3. filtr

// → kategorie

//  4. reálná data z DB

// → Drizzle + SQLite
