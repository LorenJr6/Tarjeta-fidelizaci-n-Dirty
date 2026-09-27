import "./globals.css";

export const metadata = {
  title: "Tarjeta de fidelización",
  description: "Sistema de fidelización del bar: registro de clientes y sellos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
