import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forja Restaurants",
  description: "Wave 2 public web experience for restaurants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}