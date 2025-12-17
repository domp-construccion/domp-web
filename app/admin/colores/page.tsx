"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type SiteSettings } from "@/lib/admin-storage";

type ApiResponse =
  | { ok: true; data: SiteSettings }
  | { ok: false; message: string };

export default function AdminColoresPage() {
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
        setTimeout(() => {
          setSuccess(false);
          window.location.reload();
        }, 2000);
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

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Colores</h1>
            <Link
              href="/admin"
              className="text-accent hover:text-accent-hover font-medium"
            >
              ← Volver
            </Link>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              Colores guardados correctamente. Recargando página...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Primario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Primario
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.colors.primary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          primary: e.target.value,
                        },
                      })
                    }
                    className="w-16 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.colors.primary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          primary: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#101932"
                  />
                </div>
                <div
                  className="mt-2 h-12 rounded"
                  style={{ backgroundColor: settings.colors.primary }}
                />
              </div>

              {/* Color Accent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Accent (Naranja)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.colors.accent}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          accent: e.target.value,
                        },
                      })
                    }
                    className="w-16 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.colors.accent}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          accent: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#F18121"
                  />
                </div>
                <div
                  className="mt-2 h-12 rounded"
                  style={{ backgroundColor: settings.colors.accent }}
                />
              </div>

              {/* Color Accent Hover */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Accent Hover
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.colors.accentHover}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          accentHover: e.target.value,
                        },
                      })
                    }
                    className="w-16 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.colors.accentHover}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          accentHover: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#e0771a"
                  />
                </div>
                <div
                  className="mt-2 h-12 rounded"
                  style={{ backgroundColor: settings.colors.accentHover }}
                />
              </div>

              {/* Background Light */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fondo Claro
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.colors.backgroundLight}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          backgroundLight: e.target.value,
                        },
                      })
                    }
                    className="w-16 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.colors.backgroundLight}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          backgroundLight: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#EDEDED"
                  />
                </div>
                <div
                  className="mt-2 h-12 rounded border border-gray-300"
                  style={{ backgroundColor: settings.colors.backgroundLight }}
                />
              </div>

              {/* Text Dark */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto Oscuro
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.colors.textDark}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          textDark: e.target.value,
                        },
                      })
                    }
                    className="w-16 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.colors.textDark}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: {
                          ...settings.colors,
                          textDark: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#171719"
                  />
                </div>
                <div
                  className="mt-2 h-12 rounded flex items-center justify-center"
                  style={{ backgroundColor: settings.colors.textDark }}
                >
                  <span className="text-white text-sm">Texto de ejemplo</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Colores"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

