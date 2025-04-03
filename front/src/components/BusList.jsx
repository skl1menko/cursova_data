import React, { useEffect, useState } from "react";

// API URL для отримання автобусів
const API_URL = "http://localhost:5227/api/buses";

export const getBuses = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

const BusList = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // Викликаємо функцію для отримання автобусів
    const fetchBuses = async () => {
      const busesData = await getBuses();
      setBuses(busesData);
    };

    fetchBuses();
  }, []);

  return (
    <div>
      <h1>Список автобусів</h1>
      <ul>
        {buses.length > 0 ? (
          buses.map((bus) => (
            <li key={bus.bus_id}>
              <p>Модель: {bus.model}</p>
              <p>Кількість місць: {bus.capacity}</p>
              <p>Рік випуску: {bus.year}</p>
            </li>
          ))
        ) : (
          <p>Автобуси не знайдені.</p>
        )}
      </ul>
    </div>
  );
};

export default BusList;
