import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Intenta cargar el usuario desde localStorage
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const decoded = jwtDecode(token);
            const role = decoded.role || 
                        (decoded.authorities && decoded.authorities[0]) || 
                        "CLIENTE";
            
            return {
                email: decoded.sub,
                token,
                role: role.toLowerCase().replace('role_', ''),
                name: decoded.name || decoded.sub || "Usuario"
            };
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    });

    const login = (userData) => {
        const normalizedUser = {
            ...userData,
            role: userData.role.toLowerCase().replace('role_', '')
        };
        setUser(normalizedUser);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        // Limpia TODO rastro de autenticación
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Limpia cookies si las usas
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);