import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.restaurantMenu;

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
