"use client";

import { useEffect, useMemo, useState } from "react";

type QuoteStatus = "nuevo" | "contactado" | "cotizado" | "cerrado";

type Quote = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoProyecto: string;
  presupuestoEstimado?: string | null;
  mensaje: string;
  status: QuoteStatus;
  origen: string;
  createdAt: string;
};

type ApiListResponse =
  | {
      ok: true;
      data: Quote[];
    }
  | {
      ok: false;
      message: string;
    };

const STATUS_LABELS: Record<QuoteStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  cotizado: "Cotizado",
  cerrado: "Cerrado",
};

const STATUS_CLASSES: Record<QuoteStatus, string> = {
  nuevo: "bg-blue-100 text-blue-800",
  contactado: "bg-amber-100 text-amber-800",
  cotizado: "bg-purple-100 text-purple-800",
  cerrado: "bg-green-100 text-green-800",
};

export default function AdminCotizacionesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [quotesError, setQuotesError] = useState<string | null>(null);

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sortedQuotes = useMemo(
    () =>
      [...quotes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [quotes],
  );

  const loadQuotes = async () => {
    setLoadingQuotes(true);
    setQuotesError(null);

    try {
      const res = await fetch("/api/cotizaciones", { cache: "no-store" });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setQuotes([]);
        return;
      }

      const data = (await res.json()) as ApiListResponse;

      if (!("ok" in data) || !data.ok) {
        setQuotesError(
          data && "message" in data
            ? data.message
            : "No se pudieron cargar las cotizaciones.",
        );
        return;
      }

      setQuotes(data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error);
      setQuotesError("Ocurrió un error al cargar las cotizaciones.");
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => {
    // Al entrar, intentamos cargar cotizaciones.
    // Si no hay sesión válida, el endpoint devolverá 401 y se mostrará el login.
    void loadQuotes();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setLoginError(data.message || "Credenciales inválidas");
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      setUsername("");
      setPassword("");
      await loadQuotes();
    } catch (error) {
      console.error("Error en login de admin:", error);
      setLoginError("Ocurrió un error al iniciar sesión.");
      setIsAuthenticated(false);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: QuoteStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/cotizaciones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        alert(
          data.message ||
            "No se pudo actualizar el estatus. Intenta nuevamente.",
        );
        return;
      }

      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status } : q)),
      );
    } catch (error) {
      console.error("Error al actualizar estatus:", error);
      alert("Ocurrió un error al actualizar el estatus.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta cotización? Esta acción no se puede deshacer.",
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/cotizaciones/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        alert(
          data.message ||
            "No se pudo eliminar la cotización. Intenta nuevamente.",
        );
        return;
      }

      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) {
        setSelectedQuote(null);
      }
    } catch (error) {
      console.error("Error al eliminar cotización:", error);
      alert("Ocurrió un error al eliminar la cotización.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isAuthenticated === false) {
    // Mostrar formulario de login
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Acceso administrador
          </h1>
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-4 text-sm">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                autoComplete="username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Iniciando sesión..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Cotizaciones
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión interna de solicitudes recibidas desde el sitio web.
            </p>
          </div>
          <button
            onClick={() => void loadQuotes()}
            disabled={loadingQuotes}
            className="inline-flex items-center bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loadingQuotes ? "Actualizando..." : "Actualizar lista"}
          </button>
        </div>

        {quotesError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 text-sm">
            {quotesError}
          </div>
        )}

        {loadingQuotes && quotes.length === 0 ? (
          <p className="text-gray-600">Cargando cotizaciones...</p>
        ) : quotes.length === 0 ? (
          <p className="text-gray-600">
            No hay cotizaciones registradas por el momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tabla principal */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Contacto
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Proyecto
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Estatus
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedQuotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {quote.nombre}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(quote.createdAt).toLocaleString("es-MX")}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-gray-500">
                            {quote.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {quote.telefono}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-800">
                            {quote.tipoProyecto}
                          </div>
                          {quote.presupuestoEstimado && (
                            <div className="text-xs text-gray-500">
                              Presupuesto: {quote.presupuestoEstimado}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${STATUS_CLASSES[quote.status]}`}
                          >
                            {STATUS_LABELS[quote.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => setSelectedQuote(quote)}
                            className="text-xs text-primary hover:underline"
                          >
                            Ver
                          </button>
                          <select
                            value={quote.status}
                            onChange={(e) =>
                              handleStatusChange(
                                quote.id,
                                e.target.value as QuoteStatus,
                              )
                            }
                            disabled={updatingId === quote.id}
                            className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                          >
                            {(
                              Object.keys(
                                STATUS_LABELS,
                              ) as QuoteStatus[]
                            ).map((status) => (
                              <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => void handleDelete(quote.id)}
                            disabled={deletingId === quote.id}
                            className="text-xs text-red-600 hover:underline disabled:opacity-50"
                          >
                            {deletingId === quote.id ? "Eliminando..." : "Borrar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detalle */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detalle de cotización
              </h2>
              {selectedQuote ? (
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">Cliente</p>
                    <p>{selectedQuote.nombre}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>{selectedQuote.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Teléfono</p>
                    <p>{selectedQuote.telefono}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tipo de proyecto</p>
                    <p>{selectedQuote.tipoProyecto}</p>
                  </div>
                  {selectedQuote.presupuestoEstimado && (
                    <div>
                      <p className="font-semibold">Presupuesto estimado</p>
                      <p>{selectedQuote.presupuestoEstimado}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">Mensaje</p>
                    <p className="whitespace-pre-wrap">
                      {selectedQuote.mensaje}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Estatus</p>
                    <p>{STATUS_LABELS[selectedQuote.status]}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Origen</p>
                    <p>{selectedQuote.origen}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Fecha de creación</p>
                    <p>
                      {new Date(selectedQuote.createdAt).toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Selecciona una cotización en la tabla para ver el detalle.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


