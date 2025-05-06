import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/loginUser";

const Form = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const validarEmail = (email) => {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        return regex.test(email);
    };

    const validarPassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    };

    const handleLogin = async () => {
        setError("");

        if (!validarEmail(email)) {
            setError("Correo inválido.");
            return;
        }

        if (!validarPassword(password)) {
            setError("La contraseña debe tener al menos 8 caracteres con un carácter especial.");
            return;
        }

        try {
            const data = await loginUser({ correo: email, contrasena: password });

            if (!data || data.success === false) {
                setError(data.message || "Credenciales incorrectas.");
                return;
            }


            if (data.rol === "admin") {
                navigate("/admin-dashboard");
            } else if (data.rol === "cliente") {
                navigate("/cliente-dashboard");
            } else if (data.rol === "repartidor") {
                navigate("/repartidor-dashboard");
            } else {
                setError("Rol no reconocido o usuario no registrado.");
            }

        } catch (error) {
            setError(error.message || "Ocurrió un error al iniciar sesión.");
        }
    };

    return (
            <div className="bg-white w-full max-w-md ">
                <h1 className="text-4xl font-semibold text-center">Bienvenido de nuevo</h1>
                <p className="font-medium text-lg text-gray-500 text-center mt-3">Disfruta de tus compras</p>

                <form className="mt-16" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="email" className="font-serif font-medium text-lg">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-xl mt-1 mx-1"
                        placeholder="Correo electrónico"
                    />
                </form>

                <form className="mt-12" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="password" className="font-serif font-medium text-lg">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-2 border-gray-300 p-3 rounded-xl mt-1 mx-1"
                        placeholder="Contraseña"
                    />
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                <div className="flex flex-col items-center gap-4 p-8 mt-6">
                    <Link to="/recoverpass" className="text-blue-950">¿Olvidaste tu contraseña?</Link>
                </div>

                <button
                    onClick={handleLogin}
                    className={`w-full py-3 rounded-xl text-white font-bold border border-blue-950 px-32 text-center 
                        active:scale-[.98] hover:scale-[1.01] ease-in-out mt-6 ${
                            email && password ? "bg-blue-950" : "bg-gray-400 cursor-not-allowed opacity-50"
                        }`}
                    disabled={!email || !password}
                >
                    Iniciar sesión
                </button>
                <button className="w-full active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out border border-blue-950 text-black py-3 rounded-xl text-center font-bold mt-6 flex items-center justify-center gap-2">
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

