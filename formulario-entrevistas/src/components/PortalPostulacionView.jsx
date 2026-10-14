import React, { useState, useRef } from 'react';
import { ArrowLeft, Waves, UploadCloud, Send } from 'lucide-react';

const PortalPostulacionView = ({ onNavigate, onPostulacionSubmitted }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [familia, setFamilia] = useState('');
  const [cargo, setCargo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [file, setFile] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const familias = [
    'Tecnología/TI',
    'Operaciones y Logística',
    'Recursos Humanos',
    'Finanzas y Contabilidad',
    'Ventas y Marketing',
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Debes autorizar a AquaChile para procesar tus antecedentes.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onPostulacionSubmitted({
        nombre,
        email,
        tel,
        cargo,
        familia,
        observaciones,
        file,
      });

      // Limpiar formulario
      setNombre('');
      setEmail('');
      setTel('');
      setFamilia('');
      setCargo('');
      setObservaciones('');
      setFile(null);
      setTermsAccepted(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ENTORNO EXTERNO
          </span>
          <span className="text-xs text-slate-500">Portal Público de Empleos (/postular)</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Volver al Panel Interno RRHH</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0b1329] to-[#0f172a] text-white p-7 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-teal-600 p-2 rounded-lg">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base text-white">AquaChile • Trabaja con Nosotros</div>
            <div className="text-xs text-teal-300">
              Líderes en acuicultura sustentable y desarrollo de talentos
            </div>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-black mb-1.5">
          Postulación a Oportunidades Laborales
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Completa tus antecedentes profesionales para incorporarte a nuestros procesos de selección.
          Tu postulación ingresará automáticamente al equipo de Gestión de Personas.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Datos Personales y de Contacto</h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Ingresa tus datos fidedignos para contactarte ante entrevistas.
            </p>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Camila Morales Sepúlveda"
              className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Email y Tel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico de Contacto *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.nombre@ejemplo.com"
                className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teléfono Móvil (WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="+56 9 8765 4321"
                className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Familia y Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Área o Familia de Cargo *
              </label>
              <select
                required
                value={familia}
                onChange={(e) => setFamilia(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
              >
                <option value="">Selecciona un área laboral...</option>
                {familias.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cargo Específico al que Postulas *
              </label>
              <input
                type="text"
                required
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ej. Supervisor de Centro o Técnico de Planta"
                className="w-full py-2.5 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Subir CV Upload Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Adjuntar Currículum Vitae (CV) * (.pdf, .doc, .docx)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 rounded-xl p-6 text-center cursor-pointer transition-all"
            >
              <div className="bg-teal-100 w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-2 text-teal-700">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="font-bold text-teal-900 text-xs">
                {file ? `Archivo seleccionado: ${file.name}` : 'Haz clic para subir tu CV aquí'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Formatos permitidos: PDF o Word (máx 15MB)
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Resumen / Motivación */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Breve Resumen de Experiencia / Motivación (Opcional)
            </label>
            <textarea
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Cuéntanos brevemente sobre tus principales logros y disponibilidad para desempeñarte en instalaciones de AquaChile..."
              className="w-full py-2 px-3 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            ></textarea>
          </div>

          {/* Checkbox Términos */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-[11px] leading-relaxed">
                Autorizo a AquaChile a almacenar y procesar mis datos personales para fines exclusivos
                de procesos de selección y evaluación psicolaboral.
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium cursor-pointer transition-colors"
            >
              Cancelar y Salir
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2.5 rounded-md transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar mi Postulación a AquaChile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortalPostulacionView;
