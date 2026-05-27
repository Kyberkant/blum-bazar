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
import { notFound } from "next/navigation";
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

    const isBlocked = item.reservedBy && item.reservedBy !== userId && !isAdmin;
    const canView = !isBlocked;


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

 async function cancelReservation() {
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

async function payAction() {
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
    <Stack>

      <Group justify="space-between" align="flex-start">

        <Link href="/cs/prehled-inzeratu" style={{ textDecoration: "none" }}>
          <Button variant="light">← Zpět na bazar</Button>
        </Link>


        {(isOwner || isAdmin) && (
        <Link href={`/cs/prehled-inzeratu/${item.id}/edit`} style={{ textDecoration: "none" }}>
          <Button variant="light">Upravit</Button>
        </Link>

        )}

        {(isOwner || isAdmin) && (

        <Link
          href={`/cs/prehled-inzeratu/${item.id}/smazat`}
          style={{ textDecoration: "none" }}
        >
          <Button color="red" variant="light">
            Smazat inzerát
          </Button>
        </Link>
        )}
      </Group>

      <Card shadow="sm" padding="lg" withBorder>

        {/* FAKE IMAGE */}
        {item.obrazek ? (
          <Image
            src={item.obrazek}
            alt={item.nazev}
            height={220}
            radius="md"
            fit="cover"
            style={{ transition: "transform 0.2s" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 220,
              backgroundColor: "#e9ecef",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#868e96",
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 16,
            }}
          >
            Bez obrázku
          </div>
        )}
        <Stack>
          <Group justify="space-between">
            <Title order={2}>{item.nazev}</Title>
            <Badge>{item.kategorie}</Badge>
          </Group>

          <Divider />

          <Text size="md">{item.popis}</Text>

          <Group justify="space-between">
            <Text fw={700} size="lg">
              {item.cena === 0 ? "Zdarma" : `${item.cena} Kč`}
            </Text>

            {item.cena > 0 && item.iban && (
              <Card withBorder mt="md" padding="md">
                <Stack>
                  <Title order={4}>QR platba</Title>

                  <Alert color="blue">
                    Toto je ukázková platba. Uživatelé si platbu řeší mezi sebou.
                  </Alert>

                  {item.stav === "Platba" && isReservedByMe && item.iban && (

                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        `SPD*1.0*ACC:${item.iban}*AM:${item.cena}*CC:CZK`
                      )}`}
                      alt="QR platba"
                      w={200}
                      h={200}
                      />

                  )}


                </Stack>
              </Card>
            )}

            <Badge
              color={
                item.stav === "Dostupné"
                  ? "green"
                  : item.stav === "Rezervováno"
                  ? "yellow"
                  : item.stav === "Prodáno"
                  ? "red"
                  : "gray"
              }
            >
              {item.stav}
            </Badge>
          </Group>

          <Divider />

          <Alert title="Kontakt">
            <Stack gap={4}>
                <Text>
                  Prodejce: {item.prodejce}
                </Text>

                <Text>
                  Email: {item.email}
                </Text>
              </Stack>
          </Alert>

          <Text c="dimmed" size="sm">
            Stav: {item.stav}
          </Text>


            {item.stav === "Dostupné" && isSignedIn && (
              <form action={reserveAction}>
                <Button type="submit" color="green">
                  Rezervovat
                </Button>
              </form>
            )}

            {item.stav === "Rezervováno" && isReservedByMe && (
              <Group>
                <form action={cancelReservation}>
                  <Button color="gray">Zrušit rezervaci</Button>
                </form>

                <form action={payAction}>
                  <Button color="blue">Zaplatit</Button>
                </form>
              </Group>
            )}

            {isBlocked && (
              <Alert color="yellow">
                Inzerát je rezervovaný jiným uživatelem
              </Alert>
            )}
        </Stack>
      </Card>
    </Stack>
  );
}
