import Link from "next/link";

export default function Home() {
  return (
    <main className="wrap">
      <span className="kicker">Bienvenido</span>
      <h1>Cada ronda suma.</h1>
      <p className="lead">
        Regístrate en la tarjeta de fidelización de Dirty y empieza a sumar
        sellos en cada visita. A la décima, invita la casa.
      </p>
      <Link href="/registro" className="hero-cta">
        Crear mi tarjeta →
      </Link>
    </main>
  );
}
