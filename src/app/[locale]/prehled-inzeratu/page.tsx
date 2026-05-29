


import { Card, Text, Title, Badge, Stack, Group, SimpleGrid, Button, TextInput, Select, Checkbox, Paper, Box } from "@mantine/core";
import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import Link from "next/link";
// import { useUser, SignInButton } from "@clerk/nextjs";
import { AuthAddButton } from "@/components/AuthAddButton";


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, kategorie?: string, stav?: string, zdarma?: string }>;
})
{
  const { search, kategorie, stav, zdarma } = await searchParams;
  const data = await db.select().from(inzeraty);

const filtered = data.filter((item) => {

  const matchesSearch =
    (item.nazev + item.popis)
      .toLowerCase()
      .includes((search || "").toLowerCase());

  const matchesKategorie =
    !kategorie || item.kategorie === kategorie;

  const matchesStav =
    !stav || item.stav === stav;

  const matchesZdarma =
    zdarma !== "on" || item.cena === 0;



  return (
    matchesSearch &&
    matchesKategorie &&
    matchesStav &&
    matchesZdarma
  );
});


  return (
  <Stack gap={40}>

    {/* HERO */}
    <Paper
      radius={32}
      p={40}
      style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* glow */}
      <Box
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(
              circle at top right,
              rgba(255,106,0,0.14),
              transparent 35%
            )
          `,
          pointerEvents: "none",
        }}
      />

      <Group justify="space-between" align="center">

        <Stack gap={6}>
          <Badge
            variant="light"
            color="orange"
            radius="xl"
            w="fit-content"
            px={14}
            py={8}
            tt="uppercase"
          >
            Blogic Marketplace
          </Badge>

          <Title
            order={1}
            style={{
              fontSize: "clamp(36px, 6vw, 62px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#111",
              fontWeight: 900,
            }}
          >
            Bazar
          </Title>

          <Text
            c="dimmed"
            maw={560}
            size="lg"
            style={{ lineHeight: 1.7 }}
          >
            Prohlížej si moderní marketplace s rezervacemi,
            QR platbami a správou inzerátů.
          </Text>
        </Stack>

        <AuthAddButton />
      </Group>
    </Paper>

    {/* FILTERS */}
    <Paper
      radius={28}
      p={28}
      style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
      }}
    >
      <form>
        <Stack gap="lg">

          <TextInput
            name="search"
            placeholder="Hledat podle názvu nebo popisu..."
            defaultValue={search}
            radius="xl"
            size="md"
            styles={{
              input: {
                border: "1px solid rgba(0,0,0,0.08)",
                background: "#fafafa",
                height: 52,
                fontSize: 16,
              },
            }}
          />

          <Group align="end">

            <Select
              label="Kategorie"
              name="kategorie"
              placeholder="Všechny"
              data={[
                "Elektronika",
                "Sport",
                "Nábytek",
                "Oblečení",
                "Knihy",
                "Dětské věci",
                "Ostatní"
              ]}
              defaultValue={kategorie}
              w={220}
              radius="xl"
            />

            <Select
              label="Stav"
              name="stav"
              placeholder="Všechny"
              data={[
                "Dostupné",
                "Rezervováno",
                "Prodáno",
                "Platba",
              ]}
              defaultValue={stav}
              w={220}
              radius="xl"
            />

            <Checkbox
              label="Pouze zdarma"
              name="zdarma"
              defaultChecked={zdarma === "on"}
              mb={12}
              color="orange"
            />

            <Button
              type="submit"
              radius="xl"
              size="md"
              style={{
                background: "#ff6a00",
                fontWeight: 700,
                boxShadow: "0 10px 25px rgba(255,106,0,0.25)",
              }}
            >
              Filtrovat
            </Button>

          </Group>

        </Stack>
      </form>
    </Paper>

    {/* SECTION HEADER */}
    <Group justify="space-between">
      <Stack gap={0}>
        <Title
          order={2}
          style={{
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          Inzeráty
        </Title>

        <Text c="dimmed">
          {filtered.length} nalezených položek
        </Text>
      </Stack>
    </Group>

    {/* GRID */}
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">

      {filtered.map((item) => (
        <Link
          key={item.id}
          href={`/cs/prehled-inzeratu/${item.id}`}
          style={{ textDecoration: "none" }}
        >
          <Card
            radius={28}
            p={24}
            style={{
              cursor: "pointer",
              background: "white",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
              transition: "all 0.22s ease",
            }}
          >

            <Stack gap="lg">

              {/* fake image */}
              <Box
                style={{
                  height: 200,
                  borderRadius: 22,
                  background: item.obrazek
                    ? `url(${item.obrazek}) center/cover`
                    : "linear-gradient(135deg,#f5f5f5,#ececec)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {!item.obrazek && (
                  <Text
                    size="sm"
                    c="dimmed"
                    ta="center"
                    mt={90}
                  >
                    Bez obrázku
                  </Text>
                )}
              </Box>

              <Stack gap={8}>

                <Group justify="space-between" align="flex-start">

                  <Stack gap={2}>
                    <Text
                      fw={800}
                      size="lg"
                      style={{
                        lineHeight: 1.2,
                        color: "#111",
                      }}
                    >
                      {item.nazev}
                    </Text>

                    <Text
                      size="sm"
                      c="dimmed"
                      lineClamp={2}
                    >
                      {item.popis}
                    </Text>
                  </Stack>

                  <Badge
                    radius="xl"
                    color="orange"
                    variant="light"
                  >
                    {item.kategorie}
                  </Badge>
                </Group>

                <Group justify="space-between" mt={8}>

                  <Text
                    fw={900}
                    size="xl"
                    style={{
                      color: "#111",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {item.cena === 0
                      ? "Zdarma"
                      : `${item.cena} Kč`}
                  </Text>

                  <Badge
                    radius="xl"
                    size="lg"
                    color={
                      item.stav === "Dostupné"
                        ? "green"
                        : item.stav === "Rezervováno"
                        ? "yellow"
                        : item.stav === "Platba"
                        ? "blue"
                        : "red"
                    }
                    variant="light"
                  >
                    {item.stav}
                  </Badge>

                </Group>

              </Stack>

            </Stack>
          </Card>
        </Link>
      ))}

    </SimpleGrid>

  </Stack>
);
}

// Hey KIMI I need you to design frontend of mymarketplace like web, use 3 colors: black, orange and white, take inspiration from modern award wining websites, use mantine UI, you can import one lib for animations if you provide guide how to install it with npm, do not change the main logic only visuals here is the entering page:
