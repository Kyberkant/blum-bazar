
"use client";

import { useState } from "react";
import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Checkbox,
  Button,
  Stack,
  Title,
  FileInput,
  Paper,
  Group,
  Divider,
  Box,
  Badge,
} from "@mantine/core";

type Props = {
  inzerat?: any;
};

export default function InzeratForm({ inzerat }: Props) {

  const [zdarma, setZdarma] = useState(
    inzerat?.cena === 0
  );

  return (
    <Paper
      radius={28}
      p={28}
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
        background: "white",
      }}
    >
      <Stack gap={22}>

        {/* HEADER */}
        <Group justify="space-between">
          <Title
            order={2}
            style={{
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            {inzerat ? "Upravit inzerát" : "Nový inzerát"}
          </Title>

          <Badge color="orange" variant="light" radius="xl">
            Marketplace
          </Badge>
        </Group>

        <Divider />

        {/* BASIC INFO */}
        <Stack gap={14}>
          <TextInput
            label="Název"
            name="nazev"
            defaultValue={inzerat?.nazev || ""}
            placeholder="Např. Herní notebook"
            radius="md"
          />

          <Textarea
            label="Popis"
            name="popis"
            defaultValue={inzerat?.popis || ""}
            placeholder="Popis inzerátu..."
            minRows={4}
            radius="md"
          />
        </Stack>

        <Divider label="Cena & platba" labelPosition="center" />

        {/* PRICE SECTION */}
        <Stack gap={14}>

          <Group grow align="flex-end">

            <NumberInput
              label="Cena"
              name="cena"
              defaultValue={inzerat?.cena || 0}
              placeholder="5000"
              disabled={zdarma}
              min={0}
              radius="md"
              styles={{
                input: {
                  fontWeight: 700,
                  fontSize: 16,
                },
              }}
            />

            <Box w={220}>
              <TextInput
                label="Účet pro platbu"
                name="iban"
                placeholder="123456789/0800"
                defaultValue={inzerat?.iban || ""}
                required={!zdarma}
              />
            </Box>

          </Group>

          <Checkbox
            label="Zdarma"
            name="zdarma"
            description="Cena bude automaticky nastavena na 0"
            checked={zdarma}
            onChange={(event) =>
              setZdarma(event.currentTarget.checked)
            }
            color="orange"
          />
        </Stack>

        <Divider label="Klasifikace" labelPosition="center" />

        {/* META */}
        <Group grow>
          <Select
            label="Kategorie"
            name="kategorie"
            defaultValue={inzerat?.kategorie || ""}
            data={[
              "Elektronika",
              "Sport",
              "Nábytek",
              "Oblečení",
              "Knihy",
              "Dětské věci",
              "Ostatní",
            ]}
            radius="md"
          />

          <Select
            label="Stav"
            name="stav"
            defaultValue={inzerat?.stav || "Dostupné"}
            data={["Dostupné", "Rezervované", "Prodáno"]}
            radius="md"
          />
        </Group>

        <Divider label="Kontakt" labelPosition="center" />

        {/* CONTACT */}
        <Group grow>
          <TextInput
            label="Prodejce"
            name="prodejce"
            placeholder="Jan Novák"
            defaultValue={inzerat?.prodejce || ""}
            radius="md"
          />

          <TextInput
            label="Email"
            name="email"
            placeholder="email@example.com"
            defaultValue={inzerat?.email || ""}
            radius="md"
          />
        </Group>

        <Divider label="Média" labelPosition="center" />

        {/* MEDIA */}
        <Stack gap={14}>
          <TextInput
            label="URL obrázku"
            name="obrazek"
            placeholder="https://..."
            defaultValue={inzerat?.obrazek || ""}
          />

          <FileInput
            label="Nahrát obrázek"
            name="obrazekFile"
            accept="image/png,image/jpeg,image/webp"
            description="Pokud zadáš URL i soubor, použije se soubor."
          />
        </Stack>

        {/* SUBMIT */}
        <Button
          type="submit"
          size="md"
          radius="xl"
          fullWidth
          style={{
            background: "#ff6a00",
            fontWeight: 800,
            boxShadow: "0 15px 40px rgba(255,106,0,0.25)",
          }}
        >
          {inzerat ? "Uložit změny" : "Vytvořit inzerát"}
        </Button>

      </Stack>
    </Paper>
  );
}
