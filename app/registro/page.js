"use client";

import { useState } from "react";

export default function RegistroPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "No se pudo completar el registro.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("No se pudo conectar con el servidor. Intentalo de nuevo.");
    }
  }

  if (status === "done") {
    return (
      <main className="wrap">
        <span className="kicker">Registro completado</span>
        <h1>Bienvenido, {form.name}</h1>
        <p className="lead">
          Tu tarjeta de fidelizacion ha sido creada. La opcion de anadirla a
          Apple Wallet o Google Wallet llega en el siguiente paso.
        </p>
      </main>
    );
  }

  return (
    <main className="wrap">
      <span className="kicker">Nuevo cliente</span>
      <h1>Registrate en la tarjeta de fidelizacion</h1>
      <p className="lead">
        Rellena tus datos para empezar a sumar sellos en cada visita.
      </p>

      <form className="card form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          required
          value={form.name}
          onChange={update("name")}
          placeholder="Tu nombre"
        />

        <label htmlFor="phone">Telefono</label>
        <input
          id="phone"
          required
          type="tel"
          value={form.phone}
          onChange={update("phone")}
          placeholder="600 000 000"
        />

        <label htmlFor="email">Correo electronico</label>
        <input
          id="email"
          required
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="tu@correo.com"
        />

        {status === "error" && <p className="error-text">{message}</p>}

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando..." : "Crear mi tarjeta"}
        </button>
      </form>
    </main>
  );
}
