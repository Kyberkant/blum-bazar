import { db } from "@/db";
import { inzeraty } from "@/db/schemas/inzeraty";
import { eq } from "drizzle-orm";
import {
  Card,
  Text,
  Title,
  Badge,
  Stack,
  Group,
  Button,
  Divider,
  Alert,
  Image
} from "@mantine/core";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const itemId = Number(id);

  if (isNaN(itemId)) {
    return <Alert color="red">Neplatné ID</Alert>;
  }

  const [item] = await db
    .select()
    .from(inzeraty)
    .where(eq(inzeraty.id, itemId));

  if (!item) {
    return <Alert color="red">Inzerát nenalezen</Alert>;
  }



    const { userId, sessionClaims } = await auth();
    const user = await currentUser();
    const isOwner = user?.id === item.userId;
    const isAdmin = (user?.publicMetadata as any)?.role === "admin";
    const isReservedByMe = item.reservedBy === userId;
    const isSignedIn = !!userId;

    const isBlocked = item.stav === "Rezervováno" && !isReservedByMe && !isAdmin;


async function updateStav(formData: FormData) {
  "use server";

  const novyStav = String(formData.get("stav"));

  await db
    .update(inzeraty)
    .set({
      stav: novyStav,
      reservedBy: novyStav === "Rezervováno" ? user?.id || null : null,
    })
    .where(eq(inzeraty.id, itemId));

    revalidatePath(`/cs/prehled-inzeratu/${itemId}`);
  }

  async function reserveAction(formData: FormData) {
    "use server";

    const { userId } = await auth();

    if (!userId) return;

    await db.update(inzeraty)
      .set({
        stav: "Rezervováno",
        reservedBy: userId,
      })
      .where(eq(inzeraty.id, itemId));

      revalidatePath(`/cs/prehled-inzeratu/${itemId}`);
  }

 async function cancelReservation(formData: FormData) {
  "use server";

  const { userId } = await auth();

    await db.update(inzeraty)
      .set({
        stav: "Dostupné",
        reservedBy: null,
      })
      .where(eq(inzeraty.id, itemId));

      revalidatePath(`/cs/prehled-inzeratu/${itemId}`);
  }

async function payAction(formData: FormData) {
  "use server";

  const { userId } = await auth();

  await db.update(inzeraty)
    .set({
      stav: "Platba",
      reservedBy: userId
    })
    .where(eq(inzeraty.id, itemId));

    revalidatePath(`/cs/prehled-inzeratu/${itemId}`);
}


  return (
  <Stack gap={40}>

    {/* TOP NAV */}
    <Group justify="space-between" align="center">
      <Link href="/cs/prehled-inzeratu" style={{ textDecoration: "none" }}>
        <Button variant="light" radius="xl">
          ← Zpět
        </Button>
      </Link>

      <Group>
        {(isOwner || isAdmin) && (
          <Link
            href={`/cs/prehled-inzeratu/${item.id}/edit`}
            style={{ textDecoration: "none" }}
          >
            <Button variant="light" radius="xl">
              Upravit
            </Button>
          </Link>
        )}

        {(isOwner || isAdmin) && (
          <Link
            href={`/cs/prehled-inzeratu/${item.id}/smazat`}
            style={{ textDecoration: "none" }}
          >
            <Button color="red" variant="light" radius="xl">
              Smazat
            </Button>
          </Link>
        )}
      </Group>
    </Group>

    {/* MAIN CARD */}
    <Card
      radius={32}
      p={0}
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 25px 80px rgba(0,0,0,0.08)",
        overflow: "hidden",
        background: "white",
      }}
    >

      {/* IMAGE SECTION */}
      {item.obrazek ? (
        <Image
          src={item.obrazek}
          alt={item.nazev}
          height={360}
          fit="cover"
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 360,
            background: "linear-gradient(135deg,#f5f5f5,#e9e9e9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          Bez obrázku
        </div>
      )}

      {/* CONTENT */}
      <Stack p={28} gap={22}>

        {/* TITLE ROW */}
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title
              order={1}
              style={{
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              {item.nazev}
            </Title>

            <Text c="dimmed">{item.popis}</Text>
          </Stack>

          <Badge
            size="lg"
            radius="xl"
            color="orange"
            variant="light"
          >
            {item.kategorie}
          </Badge>
        </Group>

        {/* PRICE + STATUS */}
        <Group justify="space-between" align="center">

          <Text
            size="xl"
            fw={900}
            style={{
              fontSize: 28,
              letterSpacing: "-0.03em",
            }}
          >
            {item.cena === 0 ? "Zdarma" : `${item.cena} Kč`}
          </Text>

          <Badge
            size="lg"
            radius="xl"
            color={
              item.stav === "Dostupné"
                ? "green"
                : item.stav === "Rezervováno"
                ? "yellow"
                : item.stav === "Platba"
                ? "blue"
                : "red"
            }
            variant="light"
          >
            {item.stav}
          </Badge>

        </Group>

        {/* QR PAYMENT CARD */}
        {item.cena > 0 && item.iban && (
          <Card
            radius={24}
            p={20}
            style={{
              border: "1px solid rgba(0,0,0,0.06)",
              background:
                "linear-gradient(135deg,#ffffff,#fafafa)",
            }}
          >
            <Stack gap={12}>
              <Title order={4}>QR platba</Title>

              <Alert color="blue" variant="light">
                Toto je ukázková platba. Uživatelé si platbu řeší mezi sebou.
              </Alert>

              {item.stav === "Platba" && isReservedByMe && item.iban && (
                <Group justify="center">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `SPD*1.0*ACC:${item.iban}*AM:${item.cena}*CC:CZK`
                    )}`}
                    w={220}
                    h={220}
                  />
                </Group>
              )}

              {item.stav === "Platba" && isReservedByMe && (
                <form
                  action={async () => {
                    "use server";

                    await db
                      .update(inzeraty)
                      .set({
                        stav: "Prodáno",
                        reservedBy: null,
                      })
                      .where(eq(inzeraty.id, itemId));

                    revalidatePath(`/cs/prehled-inzeratu/${itemId}`);
                  }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    radius="xl"
                    color="green"
                  >
                    Potvrdit zaplacení
                  </Button>
                </form>
              )}
            </Stack>
          </Card>
        )}

        {/* CONTACT */}
        <Card
          radius={24}
          p={18}
          style={{
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Stack gap={6}>
            <Title order={5}>Kontakt</Title>
            <Text>Prodejce: {item.prodejce}</Text>
            <Text>Email: {item.email}</Text>
          </Stack>
        </Card>

        {/* ACTIONS */}
        <Stack gap={10}>

          {item.stav === "Dostupné" && isSignedIn && (
            <form action={reserveAction}>
              <Button
                type="submit"
                fullWidth
                radius="xl"
                color="green"
              >
                Rezervovat
              </Button>
            </form>
          )}

          {item.stav === "Rezervováno" && isReservedByMe && (
            <Group grow>
              <form action={cancelReservation}>
                <Button
                  type="submit"
                  radius="xl"
                  variant="light"
                >
                  Zrušit
                </Button>
              </form>

              <form action={payAction}>
                <Button
                  type="submit"
                  radius="xl"
                  color="blue"
                >
                  Zaplatit
                </Button>
              </form>
            </Group>
          )}

          {(isAdmin || isBlocked) && (
            <Alert color="yellow" variant="light">
              Inzerát je rezervovaný jiným uživatelem
            </Alert>
          )}
        </Stack>

      </Stack>
    </Card>
  </Stack>
);
}
