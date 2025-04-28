// src/Api/login_user.js
import axios from "axios";

export async function loginUser(credentials) {
    try {
        const response = await axios.post("http://localhost:PORT/api/user/login", credentials, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            return { success: false, message: error.response.data.message || "Error al iniciar sesión" };
        } else if (error.request) {
            console.error("No response received:", error.request);
        }
        return { success: false, message: error.message };
    }
}
