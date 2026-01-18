"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type SiteSettings } from "@/lib/admin-storage";

type ApiResponse =
  | { ok: true; data: SiteSettings }
  | { ok: false; message: string };

export default function AdminPoliticasPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        setIsAuthenticated(true);
        loadSettings();
      } else if (response.status === 401) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");
      const result = (await response.json()) as ApiResponse;

      if (result.ok) {
        setSettings(result.data);
      } else {
        setError(result.message || "Error al cargar datos");
      }
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || "Error al guardar");
      }
    } catch (err) {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !settings) {
    return null;
  }

  const privacidad = settings.politicas?.privacidad || "";
  const terminos = settings.politicas?.terminos || "";

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Políticas y Privacidad
            </h1>
            <Link
              href="/admin"
              className="text-accent hover:text-accent-hover font-medium"
            >
              ← Volver
            </Link>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              Políticas guardadas correctamente.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Nota:</strong> Puede usar HTML en estos campos. Si deja
                los campos vacíos, se mostrará el contenido predeterminado en la
                página pública.
              </p>
            </div>

            {/* Política de Privacidad */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                1. Política de Privacidad
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Contenido HTML de la política de privacidad. Déjelo vacío para
                usar el contenido predeterminado.
              </p>
              <textarea
                value={privacidad}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    politicas: {
                      ...settings.politicas,
                      privacidad: e.target.value,
                    },
                  })
                }
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="Ingrese el contenido HTML de la política de privacidad..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Puede usar etiquetas HTML como &lt;div&gt;, &lt;p&gt;,
                &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
              </p>
            </div>

            {/* Términos y Condiciones */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                2. Términos y Condiciones
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Contenido HTML de los términos y condiciones. Déjelo vacío para
                usar el contenido predeterminado.
              </p>
              <textarea
                value={terminos}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    politicas: {
                      ...settings.politicas,
                      terminos: e.target.value,
                    },
                  })
                }
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="Ingrese el contenido HTML de los términos y condiciones..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Puede usar etiquetas HTML como &lt;div&gt;, &lt;p&gt;,
                &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

