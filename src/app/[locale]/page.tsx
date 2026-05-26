import { Title, Text, Stack, Button } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.home.title"),
    description: t("page.home.description"),
  };
}

export default async function Page(_: PageProps<"/[locale]">) {
  const t = await getTranslations();

  return (
    <Stack align="center" mt={100}>
      <Title>{t("page.home.title")}</Title>

      <Text c="dimmed">
        Vítej v bazar systému Blogic
      </Text>

      <Link
        href="/cs/prehled-inzeratu"
        style={{ textDecoration: "none" }}
      >
        <Button size="md">
          Vstoupit do bazaru
        </Button>
      </Link>
    </Stack>
  );
}
