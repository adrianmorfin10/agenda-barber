import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google"; // Actualización aquí
import MainComponent from './components/MainComponent';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "Barber Montana",
  description: "Sistema de agendamiento",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body className={`flex ${poppins.className}`}>
        <MainComponent>{children}</MainComponent>
      </body>
    </html>
  );
}
