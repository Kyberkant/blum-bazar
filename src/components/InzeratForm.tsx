"use client";

import { useState } from "react";
import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Checkbox,
  Button,
  Card,
  Stack,
  Title,
  FileInput,
} from "@mantine/core";
import Link from "next/link";



export default function InzeratForm() {
  const [zdarma, setZdarma] = useState(false);
  return (
        <Stack>

                <Title order={2}>Nový inzerát</Title>

                <TextInput
                  label="Název věci"
                  name="nazev"
                  placeholder="Např. Herní notebook"
                  required
                />

                <Textarea
                  label="Popis"
                  name="popis"
                  placeholder="Popis inzerátu..."
                  required
                />

                <NumberInput
                  label="Cena"
                  name="cena"
                  placeholder="5000"
                  disabled={zdarma}
                  min={0}

                />

                <Checkbox
                  label="Zdarma"
                  name="zdarma"
                  description="Pokud je inzerát zdarma, cena bude automaticky 0"
                  checked={zdarma}
                  onChange={(event) => setZdarma(event.currentTarget.checked)}
                />

                <TextInput
                  label="Účet pro platbu"
                  name="iban"
                  placeholder="123456789/0800"
                />

                <Select
                  label="Kategorie"
                  name="kategorie"
                  data={[
                    "Elektronika",
                    "Sport",
                    "Nábytek",
                    "Oblečení",
                    "Knihy",
                    "Dětské věci",
                    "Ostatní"
                  ]}
                  required
                />

                <Select
                  label="Stav inzerátu"
                  name="stav"
                  data={[
                    "Dostupné",
                    "Rezervované",
                    "Prodáno",
                  ]}
                  required
                />

                <TextInput
                  label="Jméno prodejce"
                  name="prodejce"
                  placeholder="Jan Novák"
                  required
                />

                <TextInput
                  label="Email"
                  name="email"
                  placeholder="email@example.com"
                  required
                />

                <TextInput
                  label="URL obrázku"
                  name="obrazek"
                  placeholder="https://..."

                />

                <FileInput
                  label="Obrázek"
                  name="obrazekFile"
                  accept="image/png,image/jpeg,image/webp"
                  description="Pokud nahraješ obrázek i zadáš URL, použije se nahraný obrázek."

                />

                <Button type="submit">
                  Přidat inzerát
                </Button>

              </Stack>
  );
}
