import {
  Title,
  Text,
  Stack,
  Button,
  Paper,
  Box,
} from "@mantine/core";

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
    <Box
      style={{
        minHeight: "calc(100vh - 90px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* background glow */}
      <Box
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,106,0,0.18) 0%, rgba(255,106,0,0) 70%)",
          top: -80,
          right: -80,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <Paper
        radius={32}
        p={60}
        maw={720}
        w="100%"
        bg="white"
        style={{
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        <Stack align="center" gap="xl">
          {/* badge */}
          <Box
            px={16}
            py={8}
            style={{
              borderRadius: 999,
              background: "rgba(255,106,0,0.08)",
              color: "#ff6a00",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 0.5,
            }}
          >
            BLOGIC MARKETPLACE
          </Box>

          <Stack gap="md" align="center">
            <Title
              ta="center"
              fw={900}
              style={{
                fontSize: "clamp(42px, 7vw, 74px)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "#111",
              }}
            >
              {t("page.home.title")}
            </Title>

            <Text
              ta="center"
              c="dimmed"
              maw={540}
              size="lg"
              style={{
                lineHeight: 1.7,
                fontSize: "1.1rem",
              }}
            >
              Vítej v moderním bazar systému Blogic.
              <br />
              Nakupuj, prodávej a rezervuj jednoduše.
            </Text>
          </Stack>

          <Link
            href="/cs/prehled-inzeratu"
            style={{ textDecoration: "none" }}
          >
            <Button
              size="xl"
              radius="xl"
              px={38}
              h={58}
              style={{
                background: "#ff6a00",
                color: "white",
                fontWeight: 800,
                transition: "all 0.2s ease",
                boxShadow: "0 10px 30px rgba(255,106,0,0.28)",
              }}
            >
              Vstoupit do bazaru
            </Button>
          </Link>
        </Stack>
      </Paper>
    </Box>
  );
}
