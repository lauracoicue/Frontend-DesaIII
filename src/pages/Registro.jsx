import React, { useState } from 'react';
import axios from "axios";
import bcrypt from "bcryptjs";

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
    const formIsValid = Object.keys(errors).every((key) => !errors[key]); // Sin errores
    if (formIsValid && confirmPassword === formData.contrasena) {
      setLoading(true);
      try {
        // Hashear la contraseña antes de enviarla
        const hashedPassword = await bcrypt.hash(formData.contrasena, 10);
        const formDataToSend = { ...formData, contrasena: hashedPassword };
        
        formDataToSend.cedula = parseInt(formData.cedula, 10);
        const response = await axios.post("http://localhost:5173/api/user/registro", formDataToSend, {
          headers: { "Content-Type": "application/json" }
        });

        console.log('Usuario registrado:', response.data);
        alert('Usuario registrado con éxito.');
        window.location.href = "/";
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Hubo un error al registrar el usuario.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Por favor corrige los errores antes de enviar.');
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
              />
            </div>
            {errors.cedula && <span className="text-red-600 text-sm mt-1">{errors.cedula}</span>}
          </div>

          {/* Campos texto */}
          {[
            { name: 'nombre', icon: 'person' },
            { name: 'apellido', icon: 'person' },
            { name: 'pais', icon: 'location_on' },
            { name: 'ciudad', icon: 'location_on' },
            { name: 'direccion', icon: 'location_on' },
            { name: 'codigoPostal', icon: 'markunread_mailbox' },
            { name: 'telefono', icon: 'phone' },
            { name: 'correo', icon: 'email' }
          ].map(({ name, icon }) => (
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
              />
            </div>
            {errors.confirmPassword && <span className="text-red-600 text-sm mt-1">{errors.confirmPassword}</span>}
          </div>

          {/* Botón */}
          <div className="md:col-span-3 flex justify-center">
            <button
              type="submit"
              className="bg-blue-950 text-white py-2 my-4 rounded-xl hover:bg-blue-900 w-1/3"
              disabled={loading}from-blue-100 to-white p-4
            >
              {loading ? 'Registrando...' : 'Registrarme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
