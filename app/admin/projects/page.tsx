"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Project = {
  id: string;
  slug: string;
  name: string;
  type: "residencial" | "comercial" | "industrial";
  city: string;
  description: string;
  status: "publicado" | "borrador";
  year?: number;
  imageUrl?: string;
};

type ApiResponse =
  | { ok: true; data: Project[]; message?: string }
  | { ok: false; message: string };

export default function AdminProjectsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Project, "id" | "slug">>({
    name: "",
    type: "residencial",
    city: "",
    description: "",
    status: "borrador",
    year: undefined,
    imageUrl: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        setIsAuthenticated(true);
        loadProjects();
      } else if (response.status === 401) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/projects");
      const result = (await response.json()) as ApiResponse;

      if (result.ok) {
        setProjects(result.data || []);
      } else {
        setError(result.message || "Error al cargar proyectos");
      }
    } catch (err) {
      setError("Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingProject
        ? "/api/admin/projects"
        : "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";
      const body = editingProject
        ? { ...formData, id: editingProject.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.ok) {
        setShowForm(false);
        setEditingProject(null);
        setFormData({
          name: "",
          type: "residencial",
          city: "",
          description: "",
          status: "borrador",
          year: undefined,
          imageUrl: "",
        });
        setError(null);
        loadProjects();
      } else {
        const errorMsg = result.message || "Error al guardar proyecto";
        console.error("❌ Error al guardar proyecto:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Error al guardar proyecto:", errorMessage);
      setError(`Error de conexión: ${errorMessage}. Verifica tu conexión a internet e intenta nuevamente.`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      type: project.type,
      city: project.city,
      description: project.description,
      status: project.status,
      year: project.year,
      imageUrl: project.imageUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.ok) {
        setError(null);
        loadProjects();
      } else {
        const errorMsg = result.message || "Error al eliminar proyecto";
        console.error("❌ Error al eliminar proyecto:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Error al eliminar proyecto:", errorMessage);
      setError(`Error de conexión: ${errorMessage}. Verifica tu conexión a internet e intenta nuevamente.`);
    }
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
            <div className="flex gap-4">
              <Link
                href="/admin"
                className="text-accent hover:text-accent-hover font-medium"
              >
                ← Volver
              </Link>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingProject(null);
                  setFormData({
                    name: "",
                    type: "residencial",
                    city: "",
                    description: "",
                    status: "borrador",
                    year: undefined,
                    imageUrl: "",
                  });
                }}
                className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-hover transition-colors"
              >
                + Nuevo Proyecto
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {showForm && (
            <div className="mb-8 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as Project["type"],
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Project["status"],
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="borrador">Borrador</option>
                      <option value="publicado">Publicado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año
                    </label>
                    <input
                      type="number"
                      value={formData.year || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="/imagenes/proyectos/nombre-imagen.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Coloca la imagen en /public/imagenes/proyectos/ y usa la ruta
                    relativa
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
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
                      setEditingProject(null);
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
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {project.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.imageUrl}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{project.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        project.status === "publicado"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {project.type} • {project.city}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && !loading && (
            <p className="text-center text-gray-600 py-8">
              No hay proyectos. Crea uno nuevo para comenzar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

