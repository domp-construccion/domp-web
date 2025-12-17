"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  type SiteSettings,
  type TeamMember,
  type ProcessStep,
} from "@/lib/admin-storage";

type ApiResponse =
  | { ok: true; data: SiteSettings }
  | { ok: false; message: string };

export default function AdminNosotrosPage() {
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
        setError(null);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorMsg = result.message || "Error al guardar";
        console.error("❌ Error al guardar:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Error al guardar:", errorMessage);
      setError(`Error de conexión: ${errorMessage}. Verifica tu conexión a internet e intenta nuevamente.`);
    } finally {
      setSaving(false);
    }
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    if (!settings) return;
    const updated = { ...settings };
    updated.nosotros.teamMembers[index] = {
      ...updated.nosotros.teamMembers[index],
      [field]: value,
    };
    setSettings(updated);
  };

  const addTeamMember = () => {
    if (!settings) return;
    const updated = { ...settings };
    updated.nosotros.teamMembers.push({
      role: "",
      name: "",
      description: "",
      imageUrl: "",
    });
    setSettings(updated);
  };

  const removeTeamMember = (index: number) => {
    if (!settings) return;
    const updated = { ...settings };
    updated.nosotros.teamMembers.splice(index, 1);
    setSettings(updated);
  };

  const updateProcessStep = (
    index: number,
    field: keyof ProcessStep,
    value: string | number
  ) => {
    if (!settings) return;
    const updated = { ...settings };
    updated.nosotros.processSteps[index] = {
      ...updated.nosotros.processSteps[index],
      [field]: value,
    };
    setSettings(updated);
  };

  const addValue = () => {
    if (!settings) return;
    const updated = { ...settings };
    updated.nosotros.valores.push("");
    setSettings(updated);
  };

  const removeValue = (index: number) => {
    if (!settings) return;
    const updated = { ...settings };
    updated.nosotros.valores.splice(index, 1);
    setSettings(updated);
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
            <h1 className="text-3xl font-bold text-gray-900">Nosotros</h1>
            <Link
              href="/admin"
              className="text-accent hover:text-accent-hover font-medium"
            >
              ← Volver
            </Link>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              Cambios guardados correctamente
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Historia */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Historia</h2>
              <textarea
                value={settings.nosotros.historia}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    nosotros: { ...settings.nosotros, historia: e.target.value },
                  })
                }
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </section>

            {/* Misión */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Misión</h2>
              <textarea
                value={settings.nosotros.mision}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    nosotros: { ...settings.nosotros, mision: e.target.value },
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </section>

            {/* Visión */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Visión</h2>
              <textarea
                value={settings.nosotros.vision}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    nosotros: { ...settings.nosotros, vision: e.target.value },
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </section>

            {/* Valores */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Valores</h2>
              {settings.nosotros.valores.map((valor, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={valor}
                    onChange={(e) => {
                      const updated = { ...settings };
                      updated.nosotros.valores[index] = e.target.value;
                      setSettings(updated);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addValue}
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                + Agregar Valor
              </button>
            </section>

            {/* Equipo */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Equipo</h2>
              {settings.nosotros.teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rol
                      </label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) =>
                          updateTeamMember(index, "role", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          updateTeamMember(index, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={member.description}
                      onChange={(e) =>
                        updateTeamMember(index, "description", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Foto
                    </label>
                    <input
                      type="text"
                      value={member.imageUrl || ""}
                      onChange={(e) =>
                        updateTeamMember(index, "imageUrl", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="/imagenes/equipo/nombre.jpg"
                    />
                    {member.imageUrl && (
                      <div className="mt-2 relative w-24 h-24">
                        <Image
                          src={member.imageUrl}
                          alt={member.name || member.role}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTeamMember}
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                + Agregar Miembro
              </button>
            </section>

            {/* Proceso */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Proceso de Trabajo
              </h2>
              {settings.nosotros.processSteps.map((step, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paso #
                      </label>
                      <input
                        type="number"
                        value={step.step}
                        onChange={(e) =>
                          updateProcessStep(index, "step", parseInt(e.target.value))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) =>
                          updateProcessStep(index, "title", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        updateProcessStep(index, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </section>

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

