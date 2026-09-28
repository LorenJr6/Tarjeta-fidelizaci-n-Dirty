import { Anton, Barlow } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "Dirty · Tarjeta de fidelización",
  description: "Sistema de fidelización del bar: registro de clientes y sellos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${anton.variable} ${barlow.variable}`}>
      <body>
        <header className="site-header">
          <a href="/" className="brand">
            <img src="/dirty-mark.jpg" alt="Dirty" className="brand-mark" />
            <span className="brand-word">
              D<span className="brand-i">i</span>RTY
            </span>
          </a>
          <span className="brand-tag">Tarjeta de fidelización</span>
        </header>
        {children}
      </body>
    </html>
  );
}
