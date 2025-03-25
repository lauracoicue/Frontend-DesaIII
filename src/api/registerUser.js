export async function registerUser(userData) {
    try {
        const response = await fetch("http://localhost:8090/api/user/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("Error al registrar usuario");
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
