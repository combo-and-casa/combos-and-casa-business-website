import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.restaurantAbout;

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
