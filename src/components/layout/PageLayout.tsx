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
                        background: "#ff6a00",
                        color: "white",
                        border: "none",
                        fontWeight: 700,
                        boxShadow: "0 10px 30px rgba(255,106,0,0.25)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Přihlásit se
                    </Button>
                  </SignInButton>
                ) : (
                  <Paper
                    //
                  >
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: {
                            width: 36,
                            height: 36,
                          },
                        },
                      }}
                    />
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
