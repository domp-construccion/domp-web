"use client";

import { useEffect, useState } from "react";

type SiteSettings = {
  phones: string[];
  emails: string[];
  whatsapp: string;
  address: string;
  city: string;
  serviceAreas: string[];
  social: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
  hero: {
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
  };
  nosotros: {
    historia: string;
    mision: string;
    vision: string;
    valores: string[];
    teamMembers: Array<{
      role: string;
      name: string;
      description: string;
      imageUrl?: string;
    }>;
    processSteps: Array<{
      step: number;
      title: string;
      description: string;
    }>;
  };
  colors: {
    primary: string;
    accent: string;
    accentHover: string;
    backgroundLight: string;
    textDark: string;
  };
};

type ApiResponse =
  | {
      ok: true;
      data: SiteSettings;
    }
  | {
      ok: false;
      message: string;
    };

export default function AdminSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});

  // Verificar autenticación al cargar
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
        setIsAuthenticated(false);
      } else {
        setSettingsError("Error al verificar autenticación");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setIsAuthenticated(false);
    } finally {
      setLoadingSettings(false);
    }
  };

  const loadSettings = async () => {
    try {
      setLoadingSettings(true);
      setSettingsError(null);
      const response = await fetch("/api/admin/settings");
      const result = (await response.json()) as ApiResponse;

      if (result.ok) {
        setSettings(result.data);
        setFormData(result.data);
      } else {
        setSettingsError(result.message || "Error al cargar configuración");
      }
    } catch (error) {
      console.error("Error al cargar settings:", error);
      setSettingsError("Error al cargar la configuración");
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.ok) {
        setIsAuthenticated(true);
        loadSettings();
      } else {
        setLoginError(result.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setLoginError("Error al iniciar sesión");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // Asegurarse de que se envíen todos los campos necesarios
      if (!settings) {
        setSaveError("No se pudieron cargar los settings actuales");
        setSaving(false);
        return;
      }

      const dataToSave: SiteSettings = {
        ...settings,
        ...formData,
        // Asegurar que los arrays siempre estén presentes
        phones: formData.phones !== undefined ? formData.phones : settings.phones,
        emails: formData.emails !== undefined ? formData.emails : settings.emails,
        serviceAreas: formData.serviceAreas !== undefined ? formData.serviceAreas : settings.serviceAreas,
        // Asegurar que los objetos anidados estén completos
        social: formData.social !== undefined ? { ...settings.social, ...formData.social } : settings.social,
        hero: formData.hero !== undefined ? { ...settings.hero, ...formData.hero } : settings.hero,
        nosotros: formData.nosotros !== undefined ? { ...settings.nosotros, ...formData.nosotros } : settings.nosotros,
        colors: formData.colors !== undefined ? { ...settings.colors, ...formData.colors } : settings.colors,
      };

      console.log("💾 Enviando datos al servidor:", JSON.stringify({ emails: dataToSave.emails, phones: dataToSave.phones }, null, 2));

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();

      if (result.ok) {
        console.log("✅ Datos guardados exitosamente:", JSON.stringify({ emails: result.data.emails }, null, 2));
        setSaveSuccess(true);
        setSettings(result.data);
        setFormData(result.data);
        setSaveError(null);
        setTimeout(() => setSaveSuccess(false), 3000);
        // Forzar recarga de la página después de guardar para ver los cambios
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorMsg = result.message || "Error al guardar";
        console.error("❌ Error al guardar:", errorMsg);
        setSaveError(errorMsg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("❌ Error al guardar:", errorMessage);
      setSaveError(`Error de conexión: ${errorMessage}. Verifica tu conexión a internet e intenta nuevamente.`);
    } finally {
      setSaving(false);
    }
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [...(prev.phones || []), ""],
    }));
  };

  const removePhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      phones: prev.phones?.filter((_, i) => i !== index) || [],
    }));
  };

  const updatePhone = (index: number, value: string) => {
    setFormData((prev) => {
      const phones = [...(prev.phones || [])];
      phones[index] = value;
      return { ...prev, phones };
    });
  };

  const addEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [...(prev.emails || []), ""],
    }));
  };

  const removeEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateEmail = (index: number, value: string) => {
    setFormData((prev) => {
      const emails = [...(prev.emails || [])];
      emails[index] = value;
      return { ...prev, emails };
    });
  };

  const addServiceArea = () => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: [...(prev.serviceAreas || []), ""],
    }));
  };

  const removeServiceArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateServiceArea = (index: number, value: string) => {
    setFormData((prev) => {
      const serviceAreas = [...(prev.serviceAreas || [])];
      serviceAreas[index] = value;
      return { ...prev, serviceAreas };
    });
  };

  // Login form
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Acceso de Administrador
          </h1>
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loginLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading
  if (loadingSettings || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Error loading settings
  if (settingsError && !settings) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{settingsError}</p>
          <button
            onClick={loadSettings}
            className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Main settings form
  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Configuración del Sitio
            </h1>
            <a
              href="/admin/cotizaciones"
              className="text-accent hover:text-accent-hover font-medium"
            >
              ← Volver a Cotizaciones
            </a>
          </div>

          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              Configuración guardada correctamente
            </div>
          )}

          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {saveError}
            </div>
          )}

          {!settings ? (
            <p className="text-gray-600">Cargando configuración...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Información de Contacto */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Información de Contacto
                </h2>

                <div className="space-y-4">
                  {/* Teléfonos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfonos
                    </label>
                    {(formData.phones || []).map((phone, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => updatePhone(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                          placeholder="614 2156600"
                        />
                        <button
                          type="button"
                          onClick={() => removePhone(index)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPhone}
                      className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      + Agregar Teléfono
                    </button>
                  </div>

                  {/* Emails */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emails
                    </label>
                    {(formData.emails || []).map((email, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => updateEmail(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                          placeholder="domp@contruccion.mx"
                        />
                        <button
                          type="button"
                          onClick={() => removeEmail(index)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addEmail}
                      className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      + Agregar Email
                    </button>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      id="whatsapp"
                      value={formData.whatsapp || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          whatsapp: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="614 2156600"
                    />
                  </div>

                  {/* Dirección */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Calle y número"
                    />
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Chihuahua, Chihuahua"
                    />
                  </div>

                  {/* Zonas de Servicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zonas de Servicio
                    </label>
                    {(formData.serviceAreas || []).map((area, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={area}
                          onChange={(e) =>
                            updateServiceArea(index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                          placeholder="Chihuahua y alrededores"
                        />
                        <button
                          type="button"
                          onClick={() => removeServiceArea(index)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addServiceArea}
                      className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      + Agregar Zona
                    </button>
                  </div>
                </div>
              </section>

              {/* Redes Sociales */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Redes Sociales
                </h2>
                
                {/* Redes Sociales Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      value={formData.social?.instagram || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          social: {
                            ...(prev.social || {}),
                            instagram: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="https://instagram.com/domp"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="facebook"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      value={formData.social?.facebook || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          social: {
                            ...(prev.social || {}),
                            facebook: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="https://facebook.com/domp"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="tiktok"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      TikTok
                    </label>
                    <input
                      type="url"
                      id="tiktok"
                      value={formData.social?.tiktok || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          social: {
                            ...(prev.social || {}),
                            tiktok: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="https://tiktok.com/@domp"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      value={formData.social?.linkedin || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          social: {
                            ...(prev.social || {}),
                            linkedin: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="https://linkedin.com/company/domp"
                    />
                  </div>
                </div>

                {/* Redes Sociales Adicionales */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redes Sociales Adicionales
                  </label>
                  {Object.entries(formData.social || {})
                    .filter(([key]) => !["instagram", "facebook", "tiktok", "linkedin"].includes(key))
                    .map(([key, value], index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => {
                            const newSocial: { [key: string]: string | undefined } = { ...(formData.social || {}) };
                            const oldValue = newSocial[key];
                            delete newSocial[key];
                            newSocial[e.target.value] = oldValue;
                            setFormData((prev) => ({
                              ...prev,
                              social: newSocial,
                            }));
                          }}
                          className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                          placeholder="Nombre (ej: YouTube)"
                        />
                        <input
                          type="url"
                          value={value || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              social: {
                                ...(prev.social || {}),
                                [key]: e.target.value,
                              },
                            }))
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSocial: { [key: string]: string | undefined } = { ...(formData.social || {}) };
                            delete newSocial[key];
                            setFormData((prev) => ({
                              ...prev,
                              social: newSocial,
                            }));
                          }}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newKey = `red_social_${Date.now()}`;
                      setFormData((prev) => {
                        const newSocial: { [key: string]: string | undefined } = { ...(prev.social || {}) };
                        newSocial[newKey] = "";
                        return {
                          ...prev,
                          social: newSocial,
                        };
                      });
                    }}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    + Agregar Red Social
                  </button>
                </div>
              </section>

              {/* Hero Section */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Sección Hero (Página Principal)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="headline"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Título Principal
                    </label>
                    <input
                      type="text"
                      id="headline"
                      value={formData.hero?.headline || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hero: {
                            headline: e.target.value,
                            subheadline: prev.hero?.subheadline || "",
                            primaryCtaText: prev.hero?.primaryCtaText || "",
                            primaryCtaHref: prev.hero?.primaryCtaHref || "",
                            secondaryCtaText: prev.hero?.secondaryCtaText || "",
                            secondaryCtaHref: prev.hero?.secondaryCtaHref || "",
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="DomP"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subheadline"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subtítulo
                    </label>
                    <textarea
                      id="subheadline"
                      value={formData.hero?.subheadline || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hero: {
                            headline: prev.hero?.headline || "",
                            subheadline: e.target.value,
                            primaryCtaText: prev.hero?.primaryCtaText || "",
                            primaryCtaHref: prev.hero?.primaryCtaHref || "",
                            secondaryCtaText: prev.hero?.secondaryCtaText || "",
                            secondaryCtaHref: prev.hero?.secondaryCtaHref || "",
                          },
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Empresa líder en construcción..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="primaryCtaText"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Texto Botón Principal
                      </label>
                      <input
                        type="text"
                        id="primaryCtaText"
                        value={formData.hero?.primaryCtaText || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hero: {
                              headline: prev.hero?.headline || "",
                              subheadline: prev.hero?.subheadline || "",
                              primaryCtaText: e.target.value,
                              primaryCtaHref: prev.hero?.primaryCtaHref || "",
                              secondaryCtaText: prev.hero?.secondaryCtaText || "",
                              secondaryCtaHref: prev.hero?.secondaryCtaHref || "",
                            },
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="Cotizar Proyecto"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="primaryCtaHref"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Enlace Botón Principal
                      </label>
                      <input
                        type="text"
                        id="primaryCtaHref"
                        value={formData.hero?.primaryCtaHref || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hero: {
                              headline: prev.hero?.headline || "",
                              subheadline: prev.hero?.subheadline || "",
                              primaryCtaText: prev.hero?.primaryCtaText || "",
                              primaryCtaHref: e.target.value,
                              secondaryCtaText: prev.hero?.secondaryCtaText || "",
                              secondaryCtaHref: prev.hero?.secondaryCtaHref || "",
                            },
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="/contacto"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="secondaryCtaText"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Texto Botón Secundario
                      </label>
                      <input
                        type="text"
                        id="secondaryCtaText"
                        value={formData.hero?.secondaryCtaText || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hero: {
                              headline: prev.hero?.headline || "",
                              subheadline: prev.hero?.subheadline || "",
                              primaryCtaText: prev.hero?.primaryCtaText || "",
                              primaryCtaHref: prev.hero?.primaryCtaHref || "",
                              secondaryCtaText: e.target.value,
                              secondaryCtaHref: prev.hero?.secondaryCtaHref || "",
                            },
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="Ver Proyectos"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="secondaryCtaHref"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Enlace Botón Secundario
                      </label>
                      <input
                        type="text"
                        id="secondaryCtaHref"
                        value={formData.hero?.secondaryCtaHref || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hero: {
                              headline: prev.hero?.headline || "",
                              subheadline: prev.hero?.subheadline || "",
                              primaryCtaText: prev.hero?.primaryCtaText || "",
                              primaryCtaHref: prev.hero?.primaryCtaHref || "",
                              secondaryCtaText: prev.hero?.secondaryCtaText || "",
                              secondaryCtaHref: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="/proyectos"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Botón Guardar */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

