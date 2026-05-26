"use client";

import Link from "next/link";
import { Button } from "@mantine/core";
import { useUser, SignInButton } from "@clerk/nextjs";

export function AuthAddButton() {
  const { isSignedIn } = useUser();

  return isSignedIn ? (
    <Link
      href="/cs/prehled-inzeratu/novy"
      style={{ textDecoration: "none" }}
    >
      <Button>Přidat položku</Button>
    </Link>
  ) : (
    <SignInButton mode="modal">
      <Button variant="light">
        Přihlásit se pro přidání
      </Button>
    </SignInButton>
  );
}
