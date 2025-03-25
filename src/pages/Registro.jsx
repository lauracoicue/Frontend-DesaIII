import React, { useState } from 'react';
import { registerUser } from '../api/registerUser'; // Importa la función de la API

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    pais: '',
    ciudad: '',
    direccion: '',
    codigoPostal: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = 'Correo no válido.';
        break;
      }
      case 'telefono': {
        const phoneRegex = /^\+\d+$/;
        if (!phoneRegex.test(value)) error = 'El teléfono debe de tener prefijo.';
        break;
      }
      case 'password': {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(value)) {
          error = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.';
        }
        break;
      }
      case 'confirmPassword':
        if (value !== formData.password) error = 'Las contraseñas no coinciden.';
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
    if (formIsValid) {
      setLoading(true);
      try {
        const response = await registerUser(formData); // Llama a la API
        alert('Usuario registrado correctamente');
        console.log('Respuesta de la API:', response);
        window.location.href = '/';
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-lg bg-[#132D46] text-white w-full max-w-md p-6 rounded-lg"></div>
        <h1 className="text-3xl text-center font-bold mb-4">Crea una cuenta</h1>
        <h1 className="text-base text-center font-bold mb-4">Es rápido y fácil</h1>
        <hr />
        <br />
        <form onSubmit={handleSubmit}>
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
            <span className="material-icons mr-2">location_on</span>
            <input
              type="text"
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleChange}
              className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
              placeholder="Código Postal"
            />
            {errors.codigoPostal && <span className="text-red-500 ml-2">{errors.codigoPostal}</span>}
          </div>
          <div className="mb-4 flex items-center">
            <span className="material-icons mr-2">phone</span>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
              placeholder="Teléfono"
            />
            {errors.telefono && <span className="text-red-500 ml-2">{errors.telefono}</span>}
          </div>
          <div className="mb-4 flex items-center">
            <span className="material-icons mr-2">email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
              placeholder="Email"
            />
            {errors.email && <span className="text-red-500 ml-2">{errors.email}</span>}
          </div>
          <div className="mb-4 flex items-center">
            <span className="material-icons mr-2">lock</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 p-2 rounded-md bg-gray-800 text-white placeholder-gray-400"
              placeholder="Contraseña"
            />
            {errors.password && <span className="text-red-500 ml-2">{errors.password}</span>}
          </div>
          <div className="mb-4 flex items-center">
            <span className="material-icons mr-2">lock</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
  
  );
};

export default Registro;