import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.gym;

export default function GymLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
