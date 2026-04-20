import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { getStoreSettings } from "@/lib/store-settings";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  
  return {
    title: settings?.store_name ? `${settings.store_name} | Agencia Comercial` : "D'XILVA | Agencia Comercial",
    description: settings?.meta_description || "Plataforma e-commerce premium de D'XILVA, conectando mercados con accesibilidad y diseño.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
