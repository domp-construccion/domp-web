"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Service = {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  benefits: string[];
  idealClient: string;
  icon?: string;
  imageUrl?: string;
  category?: string;
  galleryImages?: string[];
};

type ApiResponse =
  | { ok: true; data: Service[]; message?: string }
  | { ok: false; message: string };

export default function AdminServicesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Service, "id">>({
    title: "",
    description: "",
    detailedDescription: "",
    benefits: [""],
    idealClient: "",
    imageUrl: "",
    category: "",
    galleryImages: [],
  });

  const categories = [
    "Construcción",
    "Remodelación",
    "Acabados",
    "Instalaciones",
    "Exteriores",
    "Gestión de obra"
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        setIsAuthenticated(true);
        loadServices();
      } else if (response.status === 401) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/services");
      const result = (await response.json()) as ApiResponse;

      if (result.ok) {
        setServices(result.data || []);
      } else {
        setError(result.message || "Error al cargar servicios");
      }
    } catch (err) {
      setError("Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = "/api/admin/services";
      const method = editingService ? "PUT" : "POST";
      const body = editingService
        ? { ...formData, id: editingService.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.ok) {
        setShowForm(false);
        setEditingService(null);
        setFormData({
          title: "",
          description: "",
          detailedDescription: "",
          benefits: [""],
          idealClient: "",
          imageUrl: "",
          category: "",
        });
        setError(null);
        loadServices();
      } else {
        const errorMsg = result.message || "Error al guardar servicio";
        console.error("❌ Error al guardar servicio:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Error al guardar servicio:", errorMessage);
      setError(`Error de conexión: ${errorMessage}. Verifica tu conexión a internet e intenta nuevamente.`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      detailedDescription: service.detailedDescription || "",
      benefits: service.benefits.length > 0 ? service.benefits : [""],
      idealClient: service.idealClient,
      imageUrl: service.imageUrl || "",
      category: service.category || "",
      galleryImages: service.galleryImages || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.ok) {
        loadServices();
      } else {
        setError(result.message || "Error al eliminar servicio");
      }
    } catch (err) {
      setError("Error al eliminar servicio");
    }
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ""],
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits.length > 0 ? newBenefits : [""] });
  };

  const addGalleryImage = () => {
    setFormData({
      ...formData,
      galleryImages: [...(formData.galleryImages || []), ""],
    });
  };

  const updateGalleryImage = (index: number, value: string) => {
    const newImages = [...(formData.galleryImages || [])];
    newImages[index] = value;
    setFormData({ ...formData, galleryImages: newImages });
  };

  const removeGalleryImage = (index: number) => {
    const newImages = (formData.galleryImages || []).filter((_, i) => i !== index);
    setFormData({ ...formData, galleryImages: newImages });
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Administrar Especialidades
            </h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingService(null);
        setFormData({
          title: "",
          description: "",
          detailedDescription: "",
          benefits: [""],
          idealClient: "",
          imageUrl: "",
          category: "",
          galleryImages: [],
        });
              }}
              className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-hover transition-colors"
            >
              + Nueva Especialidad
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {showForm && (
            <div className="mb-8 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingService ? "Editar Especialidad" : "Nueva Especialidad"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Corta *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Detallada (para página individual)
                  </label>
                  <textarea
                    value={formData.detailedDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, detailedDescription: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Descripción más extensa que aparecerá en la página individual de la especialidad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficios *
                  </label>
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder={`Beneficio ${index + 1}`}
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + Agregar Beneficio
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente Ideal *
                  </label>
                  <input
                    type="text"
                    value={formData.idealClient}
                    onChange={(e) =>
                      setFormData({ ...formData, idealClient: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Imagen
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="/imagenes/especialidades/nombre-imagen.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Coloca la imagen en /public/imagenes/especialidades/ y usa la ruta relativa
                  </p>
                  {formData.imageUrl && (
                    <div className="mt-2 relative w-48 h-32 border border-gray-300 rounded">
                      <Image
                        src={formData.imageUrl}
                        alt="Vista previa"
                        fill
                        className="object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Galería de Imágenes (mínimo 5 recomendado)
                  </label>
                  {(formData.galleryImages || []).map((imageUrl, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => updateGalleryImage(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="/imagenes/especialidades/imagen-galería.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                      {imageUrl && (
                        <div className="relative w-24 h-24 border border-gray-300 rounded">
                          <Image
                            src={imageUrl}
                            alt={`Galería ${index + 1}`}
                            fill
                            className="object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + Agregar Imagen a Galería
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Coloca las imágenes en /public/imagenes/especialidades/ y usa la ruta relativa
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingService(null);
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {service.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{service.title}</h3>
                    </div>
                  </div>
                  {service.category && (
                    <p className="text-xs text-accent font-semibold mb-2">
                      {service.category}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {service.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Ideal para: {service.idealClient}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="flex-1 bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && !loading && (
            <p className="text-center text-gray-600 py-8">
              No hay especialidades. Crea una nueva para comenzar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

