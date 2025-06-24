import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    pais: '',
    ciudad: '',
    direccion: '',
    codigoPostal: '',
    telefono: '',
    correo: '',
    contrasena: '',
    rol: 'CLIENTE'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      validateField(name, value);
    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'cedula':
        if (!/^\d+$/.test(value)) error = 'La cédula debe contener solo números.';
        break;
      case 'correo': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = 'Correo no válido.';
        break;
      }
      case 'telefono': {
        const phoneRegex = /^\d{7,15}$/;
        if (!phoneRegex.test(value)) error = 'El teléfono debe contener solo números (sin prefijo) y tener entre 7 y 15 dígitos.';
        break;
      }
      case 'contrasena': {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(value)) {
          error = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.';
        }
        break;
      }
      case 'confirmPassword':
        if (value !== formData.contrasena) error = 'Las contraseñas no coinciden.';
        break;
      case 'pais':
      case 'ciudad':
        if (!isNaN(value)) error = `El campo ${name} debe ser texto.`;
        break;
      case 'codigoPostal':
        if (isNaN(value)) error = 'Código postal incorrecto.';
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.cedula || !formData.correo || !formData.contrasena) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (Object.values(errors).some(error => error)) {
      alert('Por favor corrige los errores antes de enviar.');
      return;
    }

    if (confirmPassword !== formData.contrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8090/auth/register", {
        cedula: parseInt(formData.cedula, 10),
        nombre: formData.nombre,
        apellido: formData.apellido,
        pais: formData.pais,
        ciudad: formData.ciudad,
        direccion: formData.direccion,
        codigoPostal: formData.codigoPostal,
        telefono: formData.telefono,
        correo: formData.correo,
        contrasena: formData.contrasena,
        rol: formData.rol
      }, {
        headers: { 
          "Content-Type": "application/json",
        }
      });

      console.log('Registro exitoso:', response.data);
      alert('¡Registro completado! Por favor inicia sesión.');
      navigate("/log_in");
      
    } catch (error) {
      console.error('Error en registro:', error);
      let errorMessage = 'Error al registrar. Intente nuevamente.';
      
      if (error.response) {
        // Manejo de errores específicos del backend
        if (error.response.status === 409) {
          errorMessage = 'El correo electrónico ya está registrado.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex justify-center bg-blue-50 to-white">
      <div className="shadow-lg bg-white w-full max-w-7xl p-10 rounded-lg">
        <h1 className="text-3xl text-center font-bold mb-5">Crea una cuenta</h1>
        <h2 className="font-medium text-lg text-gray-500 text-center mt-3 my-8">Es rápido y fácil</h2>
        <hr className="mb-9" />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 gap-x-16">

          {/* Cédula */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="material-icons mr-2">badge</span>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="flex-1 border-2 border-gray-300 p-3 rounded-xl mt-1 placeholder-gray-400"
                placeholder="Cédula"
                required
              />
            </div>
            {errors.cedula && <span className="text-red-600 text-sm mt-1">{errors.cedula}</span>}
          </div>

          {/* Campos texto */}
          {[
            { name: 'nombre', icon: 'person', required: true },
            { name: 'apellido', icon: 'person', required: true },
            { name: 'pais', icon: 'location_on', required: true },
            { name: 'ciudad', icon: 'location_on', required: true },
            { name: 'direccion', icon: 'location_on', required: true },
            { name: 'codigoPostal', icon: 'markunread_mailbox', required: true },
            { name: 'telefono', icon: 'phone', required: true },
            { name: 'correo', icon: 'email', required: true }
          ].map(({ name, icon, required }) => (
            <div className="flex flex-col" key={name}>
              <div className="flex items-center">
                <span className="material-icons mr-2">{icon}</span>
                <input
                  type={name === 'correo' ? 'email' : 'text'}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="flex-1 border-2 border-gray-300 p-3 rounded-xl mt-1 placeholder-gray-400"
                  placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                  required={required}
                />
              </div>
              {errors[name] && <span className="text-red-600 text-sm mt-1">{errors[name]}</span>}
            </div>
          ))}

          {/* Contraseña */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="material-icons mr-2">lock</span>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className="flex-1 border-2 border-gray-300 p-3 rounded-xl mt-1 placeholder-gray-400"
                placeholder="Contraseña"
                required
              />
            </div>
            {errors.contrasena && <span className="text-red-600 text-sm mt-1">{errors.contrasena}</span>}
          </div>

          {/* Confirmar Contraseña */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="material-icons mr-2">lock</span>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                className="flex-1 border-2 border-gray-300 p-3 rounded-xl mt-1 placeholder-gray-400"
                placeholder="Confirmar Contraseña"
                required
              />
            </div>
            {errors.confirmPassword && <span className="text-red-600 text-sm mt-1">{errors.confirmPassword}</span>}
          </div>

          {/* Botón */}
          <div className="md:col-span-3 flex justify-center">
            <button
              type="submit"
              className="bg-blue-950 text-white py-2 my-4 rounded-xl hover:bg-blue-900 w-1/3 transition duration-300 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : 'Registrarme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;