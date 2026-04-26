import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forja Restaurants",
  description: "Forja Restaurants web app.",
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
