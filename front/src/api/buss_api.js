const API_BASE = "http://localhost:5227/api/buses";

// GET: отримати список автобусів
export const getBuss = async () => {
    const response = await fetch(API_BASE);
    if (!response.ok) {
        throw new Error("Failed to fetch buses");
    }
    return response.json();
};

// POST: додати новий автобус
export const addBus = async (bus) => {
    const response = await fetch("http://localhost:5227/api/buses", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...bus,
            Schedules: []  // Add an empty Schedules array or default schedules data
        }),
    });

    if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(JSON.stringify(errorMessage));  // Updated error handling
    }

    return response.json();  // Return the bus object if successful
};



// DELETE: видалити автобус
export const deleteBus = async (id) => {
    const response = await fetch(`http://localhost:5227/api/buses/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(JSON.stringify(errorMessage));  // Updated error handling
    }
};

// PUT: оновити дані автобуса
export const updateBus = async (id, updatedBus) => {
    const response = await fetch(`http://localhost:5227/api/buses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBus),
    });

    if (!response.ok) {
        const errorText = await response.text(); // plain text
        throw new Error(errorText || "Unknown error during update.");
    }

    // Якщо відповідь порожня — не парсити JSON
    try {
        return await response.json();
    } catch {
        return updatedBus; // або null, якщо хочете
    }
};




