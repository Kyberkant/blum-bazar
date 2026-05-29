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
      <Button
        radius="xl"
        size="md"
        style={{
          background: "#ff6a00",
          color: "white",
          fontWeight: 800,
          boxShadow: "0 12px 30px rgba(255,106,0,0.25)",
          transition: "all 0.2s ease",
        }}
      >
        + Přidat inzerát
      </Button>
    </Link>
  ) : (
    <SignInButton mode="modal">
      <Button
        radius="xl"
        variant="light"
        size="md"
        style={{
          border: "1px solid rgba(0,0,0,0.08)",
          fontWeight: 700,
          transition: "0.2s",
        }}
      >
        Přihlásit se pro přidání
      </Button>
    </SignInButton>
  );
}
