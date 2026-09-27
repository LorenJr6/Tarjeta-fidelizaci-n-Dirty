"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { REWARD_THRESHOLD } from "@/lib/config";

export default function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setCustomers(data.customers || []);
      setDebugInfo({
        ...data._debug,
        firstRowServerTime: data.customers?.[0]?.server_time,
        firstRowBackendPid: data.customers?.[0]?.backend_pid,
      });
    } catch {
      setError("No se pudo cargar la lista de clientes.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAction(id, action) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo completar la accion.");
      } else {
        await load();
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const readyForReward = customers.filter((c) => c.stamps >= REWARD_THRESHOLD);
  const almostThere = customers.filter(
    (c) => c.stamps < REWARD_THRESHOLD && c.stamps >= REWARD_THRESHOLD - 2
  );

  return (
    <main className="wrap wide">
      <div className="admin-head">
        <div>
          <span className="kicker">Panel del bar</span>
          <h1>Clientes y sellos</h1>
        </div>
        <button className="ghost-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <section className="card">
        <h2>Notificaciones (próximamente)</h2>
        <p className="muted-note">
          Todavía no hay un canal de aviso conectado (push o email). Aquí
          verías a quién le llegaría un recordatorio si estuviera activo:
        </p>
        {almostThere.length === 0 ? (
          <p className="muted-note">
            Nadie está a 1-2 sellos del premio ahora mismo.
          </p>
        ) : (
          <ul className="check">
            {almostThere.map((c) => (
              <li key={c.id}>
                {c.name} — {c.stamps}/{REWARD_THRESHOLD} sellos
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Premio disponible ({readyForReward.length})</h2>
        {readyForReward.length === 0 ? (
          <p className="muted-note">
            Nadie ha llegado a las {REWARD_THRESHOLD} copas todavía.
          </p>
        ) : (
          <ul className="check">
            {readyForReward.map((c) => (
              <li key={c.id}>{c.name} — listo para canjear</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Todos los clientes ({customers.length})</h2>
        {loading ? (
          <p className="muted-note">Cargando...</p>
        ) : customers.length === 0 ? (
          <p className="muted-note">Todavía no hay clientes registrados.</p>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Sellos</th>
                  <th>Premios</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td className="muted-note">
                      {c.phone}
                      <br />
                      {c.email}
                    </td>
                    <td>
                      {c.stamps}/{REWARD_THRESHOLD}
                    </td>
                    <td>{c.rewards}</td>
                    <td className="row-actions-cell">
                      <button
                        className="small-btn"
                        disabled={busyId === c.id || c.stamps >= REWARD_THRESHOLD}
                        onClick={() => handleAction(c.id, "stamp")}
                      >
                        +1 sello
                      </button>
                      <button
                        className="small-btn primary"
                        disabled={busyId === c.id || c.stamps < REWARD_THRESHOLD}
                        onClick={() => handleAction(c.id, "redeem")}
                      >
                        Canjear
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {debugInfo && (
        <p className="muted-note" style={{ marginTop: 20 }}>
          Diagnóstico temporal — host: {debugInfo.dbHost} · consultado a
          las: {debugInfo.checkedAt} · hora del servidor de datos:{" "}
          {debugInfo.firstRowServerTime} · proceso: {debugInfo.firstRowBackendPid}
        </p>
      )}
    </main>
  );
}
