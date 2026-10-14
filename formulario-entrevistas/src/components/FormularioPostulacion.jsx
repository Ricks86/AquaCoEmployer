import React, { useState } from 'react';

const FormularioPostulacion = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    familiaCargo: '',
    cargoPostular: '',
    cv: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Crear un objeto FormData para enviar datos y archivos
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('familiaCargo', formData.familiaCargo);
    data.append('cargoPostular', formData.cargoPostular);
    if (formData.cv) {
      data.append('cv', formData.cv);
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('¡Formulario enviado correctamente al servidor!');
      } else {
        alert('Hubo un error al enviar el formulario.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Botón Volver */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors cursor-pointer"
        >
          <span className="mr-1">&larr;</span> Volver
        </button>

        {/* Cabecera */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Formulario de Postulación
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Completa la información del postulante y adjunta los documentos requeridos.
          </p>
        </div>

        {/* Tarjeta del Formulario (Card) */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nombre Completo */}
              <div className="md:col-span-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-teal-600 focus:border-teal-600 outline-none transition-colors"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  placeholder="Ej. correo@mail.com"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-teal-600 focus:border-teal-600 outline-none transition-colors"
                />
              </div>

              {/* Número Telefónico */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Número Telefónico
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  placeholder="Ej. +56 9 1234 5678"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-teal-600 focus:border-teal-600 outline-none transition-colors"
                />
              </div>

              {/* Familia de Cargo */}
              <div>
                <label htmlFor="familiaCargo" className="block text-sm font-medium text-gray-700 mb-1">
                  Familia de Cargo
                </label>
                <select
                  id="familiaCargo"
                  name="familiaCargo"
                  value={formData.familiaCargo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-teal-600 focus:border-teal-600 outline-none transition-colors bg-white"
                >
                  <option value="" disabled>Selecciona una categoría...</option>
                  <option value="tecnologia">Tecnología / TI</option>
                  <option value="recursos_humanos">Recursos Humanos</option>
                  <option value="ventas">Ventas y Marketing</option>
                  <option value="finanzas">Finanzas y Contabilidad</option>
                  <option value="operaciones">Operaciones y Logística</option>
                </select>
              </div>

              {/* Cargo a Postular */}
              <div>
                <label htmlFor="cargoPostular" className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo a Postular
                </label>
                <input
                  type="text"
                  id="cargoPostular"
                  name="cargoPostular"
                  value={formData.cargoPostular}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Desarrollador Frontend"
                  className="w-full border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-teal-600 focus:border-teal-600 outline-none transition-colors"
                />
              </div>

              {/* Caja de Estado Inicial */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Inicial
                </label>
                <div className="w-full bg-orange-50 border border-orange-100 text-orange-700 p-3 rounded-md font-medium text-sm">
                  PENDIENTE
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  El postulante ingresará automáticamente con este estado en el sistema.
                </p>
              </div>

              {/* Subir CV */}
              <div className="md:col-span-2">
                <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
                  Subir CV
                </label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-teal-600 focus:border-teal-600 outline-none transition-colors file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">Formatos permitidos: PDF, DOCX.</p>
              </div>

            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end items-center mt-8 space-x-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-800 font-medium px-4 text-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-6 py-2.5 transition-colors shadow-sm cursor-pointer text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Crear Solicitud
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioPostulacion;
