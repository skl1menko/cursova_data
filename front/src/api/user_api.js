// src/api.js
export const getUser = async () => {
    const response = await fetch("http://localhost:5227/api/users");
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return response.json();
};

export const registerUser = async (newUser) => {
    const response = await fetch("http://localhost:5227/api/users/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return response.json(); // Можно вернуть данные нового пользователя или статус
};
