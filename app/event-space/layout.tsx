import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.events;

export default function EventSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
