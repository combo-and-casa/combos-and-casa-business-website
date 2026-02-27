import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.restaurantReservations;

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
