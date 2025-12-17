"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipoProyecto: "",
    presupuesto: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    }

    if (!formData.tipoProyecto) {
      newErrors.tipoProyecto = "Debes seleccionar un tipo de proyecto";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          tipoProyecto: formData.tipoProyecto,
          mensaje: formData.mensaje,
          presupuestoEstimado: formData.presupuesto || undefined,
        }),
      });

      const data = (await response.json()) as
        | { ok: true; message?: string }
        | { ok: false; message?: string };

      if (!response.ok || !data.ok) {
        const errorMessage =
          data && "message" in data && data.message
            ? data.message
            : "Error al enviar la solicitud. Intenta nuevamente.";
        console.error("Error en respuesta de /api/cotizaciones:", errorMessage);
        setSubmitStatus("error");
        setErrorMessage(errorMessage);
        return;
      }

      setSubmitStatus("success");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        tipoProyecto: "",
        presupuesto: "",
        mensaje: "",
      });
    } catch (error) {
      console.error("Error al enviar cotización:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Error de conexión. Verifica tu internet e intenta nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Envíanos un mensaje
      </h2>

      {submitStatus === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          <p className="font-semibold">
            Solicitud enviada. Nos pondremos en contacto contigo.
          </p>
          <p className="text-sm mt-1">
            Revisa tu correo para confirmar los datos que nos compartiste.
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p className="font-semibold">Error al enviar el mensaje</p>
          <p className="text-sm mt-1">
            {errorMessage ||
              "Por favor, intenta nuevamente o contáctanos por teléfono."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Juan Domínguez"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="domp@contruccion.mx"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="telefono"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
              errors.telefono ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="614 2156600"
          />
          {errors.telefono && (
            <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tipoProyecto"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tipo de proyecto <span className="text-red-500">*</span>
          </label>
          <select
            id="tipoProyecto"
            name="tipoProyecto"
            value={formData.tipoProyecto}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
              errors.tipoProyecto ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Selecciona un tipo</option>
            <option value="residencial">Construcción Residencial</option>
            <option value="comercial">Construcción Comercial</option>
            <option value="industrial">Construcción Industrial</option>
            <option value="remodelacion">Remodelación</option>
            <option value="ampliacion">Ampliación</option>
            <option value="consultoria">Consultoría</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipoProyecto && (
            <p className="text-red-500 text-sm mt-1">{errors.tipoProyecto}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="presupuesto"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Presupuesto estimado (opcional)
          </label>
          <input
            type="text"
            id="presupuesto"
            name="presupuesto"
            value={formData.presupuesto}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            placeholder="Ej: $500,000 - $1,000,000 MXN"
          />
        </div>

        <div>
          <label
            htmlFor="mensaje"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mensaje <span className="text-red-500">*</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
              errors.mensaje ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Cuéntanos sobre tu proyecto..."
          />
          {errors.mensaje && (
            <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>
    </div>
  );
}

