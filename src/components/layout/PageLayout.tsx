"use client";

import {
  AppShell,
  Container,
  Group,
  Button,
  Paper,
} from "@mantine/core";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { PageLogo } from "@/components/layout/PageLogo";

import { motion } from "framer-motion";

const HEADER_HEIGHT = 90;
const BODY_MAX_WIDTH = 1280;

export function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useUser();

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      padding="lg"
      styles={{
        main: {
          background: "#ffffff",
        },
      }}
    >
      <AppShell.Header
        px="md"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid #f1f3f5",
        }}
      >
        <Container size={BODY_MAX_WIDTH} h="100%">
          <Group justify="space-between" h="100%">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <PageLogo />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Group>
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <Button
                      radius="xl"
                      size="md"
                      style={{
                        background: "#ff6b00",
                        color: "white",
                        border: "none",
                        fontWeight: 700,
                        transition: "0.2s",
                      }}
                    >
                      Přihlásit se
                    </Button>
                  </SignInButton>
                ) : (
                  <Paper
                    radius="xl"
                    p={4}
                    style={{
                      border: "1px solid #e9ecef",
                      background: "#fff",
                    }}
                  >
                    <UserButton />
                  </Paper>
                )}
              </Group>
            </motion.div>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main
        pt={`calc(${HEADER_HEIGHT}px + 24px)`}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Container size={BODY_MAX_WIDTH}>
            {children}
          </Container>
        </motion.div>
      </AppShell.Main>
    </AppShell>
  );
}
