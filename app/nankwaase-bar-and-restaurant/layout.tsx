import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.restaurant;

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
