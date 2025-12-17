"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok || response.status === 500) {
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true); // Si el middleware permitió acceso, confiar en eso
      }
    } catch (error) {
      // Si hay error pero el middleware permitió acceso, confiar en eso
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated === null) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Panel de Administración
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/settings"
              className="bg-primary text-white p-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Configuración</h2>
              <p className="text-gray-200">
                Editar teléfonos, correos, dirección y datos de contacto
              </p>
            </Link>
            <Link
              href="/admin/projects"
              className="bg-accent text-white p-6 rounded-lg hover:bg-accent-hover transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Proyectos</h2>
              <p className="text-gray-200">
                Agregar, editar y eliminar proyectos
              </p>
            </Link>
            <Link
              href="/admin/nosotros"
              className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Nosotros</h2>
              <p className="text-gray-200">
                Editar misión, visión, valores y equipo
              </p>
            </Link>
            <Link
              href="/admin/colores"
              className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Colores</h2>
              <p className="text-gray-200">
                Personalizar colores principales y secundarios
              </p>
            </Link>
            <Link
              href="/admin/cotizaciones"
              className="bg-gray-700 text-white p-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Cotizaciones</h2>
              <p className="text-gray-200">
                Ver y gestionar solicitudes de cotización
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

