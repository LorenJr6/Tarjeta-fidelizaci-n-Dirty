import Link from "next/link";

export default function Home() {
  return (
    <main className="wrap">
      <span className="kicker">En marcha</span>
      <h1>Tarjeta de fidelización</h1>
      <p className="lead">
        Registro de clientes conectado a una base de datos real. Todavía no
        hay tarjeta de Apple/Google Wallet ni sellado — son los siguientes
        pasos.
      </p>
      <Link href="/registro" className="home-link">
        Ir al formulario de registro →
      </Link>
      <div className="card">
        <h2>Próximos pasos</h2>
        <ul>
          <li>Tarjeta en Apple Wallet / Google Wallet</li>
          <li>Vista del personal para sumar sellos</li>
          <li>Canjeo del premio</li>
        </ul>
      </div>
    </main>
  );
}
