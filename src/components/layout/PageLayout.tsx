

"use client";

import { AppShell, Container, Group, Button } from "@mantine/core";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { PageLogo } from "@/components/layout/PageLogo";

const HEADER_HEIGHT = 90;
const BODY_MAX_WIDTH = 1280;


export function PageLayout({ children }: { children: React.ReactNode }) {
const { isSignedIn } = useUser();

  return (
    <AppShell header={{ height: HEADER_HEIGHT }} padding="md">
      <AppShell.Header px="md">
        <Container size={BODY_MAX_WIDTH} h="100%">
          <Group justify="space-between" h="100%">
            <PageLogo />

            <Group>
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <Button variant="light">Přihlásit se</Button>
                </SignInButton>
              ) : (
                <UserButton />
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size={BODY_MAX_WIDTH}>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
}
