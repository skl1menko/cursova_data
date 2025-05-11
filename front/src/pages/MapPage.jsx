import React from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPage.css';

// GeoJSON с маршрутом по улицам Черкасс
const cherkasyRoute = {
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: [
            [32.0594, 49.4444], // Центр Черкасс
            [32.0640, 49.4452], // Улица 1
            [32.0700, 49.4460], // Поворот
            [32.0800, 49.4470], // Ещё один поворот
            [32.0850, 49.4480]  // Конечная точка маршрута
        ]
    }
};

// Стиль линии
const lineStyle = {
    id: 'cherkasy-route',
    type: 'line',
    paint: {
        'line-color': '#FF5733',
        'line-width': 4
    }
};

const MapPage = () => {
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
                <Source id="cherkasyRoute" type="geojson" data={cherkasyRoute}>
                    <Layer {...lineStyle} />
                </Source>
            </Map>
        </div>
    );
};

export default MapPage;


https://api.eway.in.ua/?login=login&password=pass&function=routes.Search&city=donetsk&start_lat=48.03676802&start_lng=37.71427346&stop_lat=47.99128114&stop_lng=37.79573751&transports=bus,trol&format=xml