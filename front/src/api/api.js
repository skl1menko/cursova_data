const API_URL = "http://localhost:5227/api";

export const getUser = async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
}
