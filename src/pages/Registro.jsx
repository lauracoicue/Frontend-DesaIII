import React, { useState } from 'react';
import axios from "axios";
import bcrypt from "bcryptjs"; // Importar bcryptjs

const Registro = () => {
  const [formData, setFormData] = useState({
    cedula: 0,
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
        const phoneRegex = /^\+\d+$/;
        if (!phoneRegex.test(value)) error = 'El teléfono debe de tener prefijo.';
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
    <div className="min-h-screen flex items-center justify-center ">
      <div className="shadow-lg bg-blue-950 text-white w-full max-w-md p-10 rounded-lg">
        <h1 className="text-3xl text-center font-bold mb-4">Crea una cuenta</h1>
        <h1 className="text-base text-center font-bold mb-4">Es rápido y fácil</h1>
        <hr />
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center">
            <span className="material-icons mr-2">badge</span>
            <input
              type="number"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
              placeholder="Cédula"
            />
            {errors.cedula && <span className="text-red-500 ml-2">{errors.cedula}</span>}
          </div>

          {/* Mapeo de los campos de entrada */}
          {[
            { name: 'nombre', icon: 'person' },
            { name: 'apellido', icon: 'person' },
            { name: 'pais', icon: 'location_on' },
            { name: 'ciudad', icon: 'location_on' },
            { name: 'direccion', icon: 'location_on' },
          ].map(({ name, icon }) => (
            <div className="mb-4 flex items-center" key={name}>
              <span className="material-icons mr-2">{icon}</span>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
                placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
              />
              {errors[name] && <span className="text-red-500 ml-2">{errors[name]}</span>}
            </div>
          ))}

          <div className="mb-4 flex items-center">
            <span className="material-icons mr-2">email</span>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
              placeholder="Correo"
            />
            {errors.correo && <span className="text-red-500 ml-2">{errors.correo}</span>}
          </div>
          <div className="mb-4 flex items-center">
            <span className="material-icons mr-2">lock</span>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
              placeholder="Contraseña"
            />
            {errors.contrasena && <span className="text-red-500 ml-2">{errors.contrasena}</span>}
          </div>
          <div className="mb-4 flex items-center">
            <span className="material-icons mr-2">lock</span>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
              placeholder="Confirmar Contraseña"
            />
            {errors.confirmPassword && <span className="text-red-500 ml-2">{errors.confirmPassword}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#01C38E] text-white p-2 rounded-md hover:bg-teal-600"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
