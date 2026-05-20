"use client";

import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Checkbox,
  Button,
  Card,
  Stack,
  Title
} from "@mantine/core";
import { useState } from "react";
import Link from "next/link";




export default function Page() {

  const [zdarma, setZdarma] = useState(false);

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
        <Stack>
          <Title order={2}>Nový inzerát</Title>

          <TextInput
            label="Název věci"
            placeholder="Např. Herní notebook"
            required
          />

          <Textarea
            label="Popis"
            placeholder="Popis inzerátu..."
            required
          />

          <NumberInput
            label="Cena"
            placeholder="5000"
            value={zdarma ? 0 : undefined}
            disabled={zdarma}
          />

          <Checkbox
            label="Zdarma"
            checked={zdarma}
            onChange={(event) =>
              setZdarma(event.currentTarget.checked)
            }
            description="Pokud je inzerát zdarma, cena bude automaticky 0"

          />

          <Select
            label="Kategorie"
            placeholder="Vyber kategorii"
            data={[
              "Elektronika",
              "Sport",
              "Nábytek",
              "Oblečení",
            ]}
            required
          />

          <Select
            label="Stav inzerátu"
            placeholder="Vyber stav"
            data={[
              "Nové",
              "Použité",
              "Poškozené",
            ]}
            required
          />

          <TextInput
            label="Jméno prodejce"
            placeholder="Jan Novák"
            required
          />

          <TextInput
            label="Email"
            placeholder="email@example.com"
            required
          />

          <TextInput
            label="URL obrázku"
            placeholder="https://..."
          />

          <Button>
            Přidat inzerát
          </Button>
        </Stack>
      </Card>
    </Stack>


  );
}
