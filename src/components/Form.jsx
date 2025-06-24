import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Form = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validarEmail = (email) => {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!validarEmail(email)) {
        setError("Correo inválido.");
        console.warn("❌ Email inválido:", email);
        setLoading(false);
        return;
    }

    try {
        const response = await axios.post("http://localhost:8090/auth/login", {
            correo: email,
            contrasena: password
        });

        const token = response.data.token;

        if (!token) {
            console.error("⚠ No se recibió token del backend.");
            setError("Error inesperado. Intenta más tarde.");
            return;
        }

        // ✅ Decodificar el token
        const decoded = jwtDecode(token);
        console.log("Token decodificado:", decoded);

        // ✅ Determinar el rol
        let role = decoded.role || (decoded.authorities && decoded.authorities[0]) || "CLIENTE";

        // Normalizar
        if (role.toUpperCase().includes("ADMIN")) role = "admin";
        else if (role.toUpperCase().includes("REPARTIDOR")) role = "delivery";
        else role = "client";

        const name = decoded.name || decoded.sub || email;

        // ✅ Guardar en localStorage y contexto
        localStorage.setItem("token", token);
        login({
            email,
            token,
            role,
            name
        });

        console.log("Usuario logueado:", { email, role, name });

        // ✅ Redirigir según rol
        if (role === "admin") {
            navigate("/perfil-admin");
        } else if (role === "delivery") {
            navigate("/perfil-repartidor");
        } else {
            navigate("/perfil");
        }

    } catch (err) {
        console.error("🚫 Error al iniciar sesión:", err.response?.data || err.message);
        setError("Credenciales incorrectas o error en el servidor.");
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="bg-white w-full max-w-md ">
            <h1 className="text-4xl font-semibold text-center">Bienvenido de nuevo</h1>
            <p className="font-medium text-lg text-gray-500 text-center mt-3">Disfruta de tus compras</p>

            <form className="mt-16" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <label htmlFor="email" className="font-serif font-medium text-lg">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-300 p-3 rounded-xl mt-1 mx-1"
                    placeholder="Correo electrónico"
                />
            </form>

            <form className="mt-12" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <label htmlFor="password" className="font-serif font-medium text-lg">Password</label>
                <div className="relative w-full">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-xl mt-1 mx-1 pr-10"
                        placeholder="Contraseña"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <div className="flex flex-col items-center gap-4 p-8 mt-6">
                <Link to="/recoverpass" className="text-blue-950">¿Olvidaste tu contraseña?</Link>
            </div>

            <button
                onClick={handleLogin}
                className={`w-full py-3 rounded-xl text-white font-bold border border-blue-950 px-32 text-center 
                    active:scale-[.98] hover:scale-[1.01] ease-in-out mt-6 ${(email && password && !loading) ? "bg-blue-950" : "bg-gray-400 cursor-not-allowed opacity-50"
                    }`}
                disabled={!email || !password || loading}
            >
                {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>

            <button
                className="w-full active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out border border-blue-950 text-black py-3 rounded-xl text-center font-bold mt-6 flex items-center justify-center gap-2"
                onClick={() => {
                    alert("Login con Google simulado. En producción redirigiría a autenticación real.");
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="30" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Iniciar sesión con Google
            </button>
        </div>
    );
};

export default Form;
