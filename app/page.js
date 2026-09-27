export default function Home() {
  return (
    <main className="wrap">
      <span className="kicker">Primer despliegue</span>
      <h1>Tarjeta de fidelización</h1>
      <p className="lead">
        Si estás viendo esta página en tu dominio de Vercel, el circuito
        GitHub → Vercel ya funciona de principio a fin. Todavía no hay
        registro de clientes ni base de datos conectada — es el primer
        paso antes de añadir esas piezas.
      </p>
      <div className="card">
        <h2>Próximos pasos</h2>
        <ul>
          <li>Formulario de registro (nombre, teléfono y correo)</li>
          <li>Base de datos de clientes y sellos</li>
          <li>Tarjeta en Apple Wallet / Google Wallet</li>
        </ul>
      </div>
    </main>
  );
}
