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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos listos para enviar:', formData);
    alert('Formulario enviado correctamente. Revisa la consola para ver los datos.');
  };

  return (
    <div style={styles.container}>
      <h2>Formulario de Postulación</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        <div style={styles.formGroup}>
          <label htmlFor="nombre" style={styles.label}>Nombre Completo:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej. Juan Pérez"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="correo" style={styles.label}>Correo Electronico:</label>
          <input
            type="text"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            placeholder="Ej. correo@mail.com"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="telefono" style={styles.label}>Número telefonico:</label>
          <input
            type="Int"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            placeholder="Ej. +56 9 1234 5678"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="familiaCargo" style={styles.label}>Familia de Cargo:</label>
          <select
            id="familiaCargo"
            name="familiaCargo"
            value={formData.familiaCargo}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="" disabled>Selecciona una categoría...</option>
            <option value="tecnologia">Tecnología / TI</option>
            <option value="recursos_humanos">Recursos Humanos</option>
            <option value="ventas">Ventas y Marketing</option>
            <option value="finanzas">Finanzas y Contabilidad</option>
            <option value="operaciones">Operaciones y Logística</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="cargoPostular" style={styles.label}>Cargo a Postular:</label>
          <input
            type="text"
            id="cargoPostular"
            name="cargoPostular"
            value={formData.cargoPostular}
            onChange={handleChange}
            required
            placeholder="Ej. Desarrollador Frontend"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="cv" style={styles.label}>Subir CV:</label>
          <input
            type="file"
            id="cv"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <small style={styles.helpText}>Formatos permitidos: PDF, DOCX.</small>
        </div>

        <button type="submit" style={styles.button}>
          Enviar Postulación
        </button>

      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '450px',
    margin: '2rem auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  helpText: {
    color: '#666',
    fontSize: '12px',
    marginTop: '4px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
  }
};

export default FormularioPostulacion;
