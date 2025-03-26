// import fs from "fs";
import axios from "axios";

export async function registerUser(userData) {
    async function postUser() {
        try {
            const response = await axios.post("http://localhost:8090/api/user/registro", userData, {
                headers: { "Content-Type": "application/json" }});
            return response.data;
        } catch (error) {
            console.error("Error posting user data:", error.message);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            } else if (error.request) {
                console.error("No response received:", error.request);
            }
            return { success: false, message: error.message };
        }
    }
    return postUser();
}
