import React, { useState } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import './MapPage.css';

const lineStyle = {
  id: 'cherkasy-route',
  type: 'line',
  paint: {
    'line-color': '#FF5733',
    'line-width': 4
  }
};

const MapPage = () => {
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [showRoute, setShowRoute] = useState(false);

  const handleLoadRoute = async () => {
    try {
      const response = await axios.get('http://localhost:5227/api/routes/1');
      const stops = response.data.stops;

      if (stops && stops.length > 0) {
        const sortedStops = stops.sort((a, b) => a.stopOrder - b.stopOrder);
        const coordinates = sortedStops.map(stop => [stop.longitude, stop.latitude]);

        setRouteGeoJson({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        });

        setShowRoute(true); // відображаємо маршрут після завантаження
      }
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  return (
    <div className="map-container" style={{ height: '100vh' }}>
      <Map
        mapboxAccessToken="pk.eyJ1Ijoic2tsMW1lbmtvIiwiYSI6ImNtYWpzZXZ3NTExOTgya3M3dzEwZmNpaTAifQ.8Hx2WumR1PB9ejb07UWagA"
        initialViewState={{
          longitude: 32.0700,
          latitude: 49.4460,
          zoom: 13
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {showRoute && routeGeoJson && (
          <>
            <Source id="cherkasyRoute" type="geojson" data={routeGeoJson}>
              <Layer {...lineStyle} />
            </Source>

            {routeGeoJson.geometry.coordinates.map(([lng, lat], index) => (
              <Marker key={index} longitude={lng} latitude={lat} color="#007AFF" />
            ))}
          </>
        )}

        <button className="route-num" onClick={handleLoadRoute}>
          21
        </button>
      </Map>
    </div>
  );
};

export default MapPage;
