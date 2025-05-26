import React, { useState, useEffect } from 'react';
import {
    GoogleMap,
    LoadScript,
    DirectionsService,
    DirectionsRenderer
} from '@react-google-maps/api';
import './MapPage.css';

import { fetchRouteById, fetchAllRoutes } from '../api/route-api';

const MapPage = () => {
    const [directions, setDirections] = useState(null);
    const [stops, setStops] = useState([]);
    const [showRoute, setShowRoute] = useState(false);
    const [routeRequested, setRouteRequested] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [mapSize, setMapSize] = useState({
        width: '100%',
        height: '100%'
    });

    useEffect(() => {
        const loadRoutes = async () => {
            try {
                const routesData = await fetchAllRoutes();
                setRoutes(routesData);
            } catch (error) {
                console.error('Failed to load routes:', error);
            }
        };
        loadRoutes();
    }, []);

    useEffect(() => {
        const updateMapSize = () => {
            setMapSize({
                width: '100%',
                height: '100%'
            });
        };

        // Initial size calculation
        updateMapSize();

        // Update size on window resize
        window.addEventListener('resize', updateMapSize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateMapSize);
        };
    }, []);

    const handleLoadRoute = async (routeId) => {
        if (showRoute && selectedRouteId === routeId) {
            setDirections(null);
            setStops([]);
            setShowRoute(false);
            setRouteRequested(false);
            setSelectedRouteId(null);
            return;
        }

        try {
            const data = await fetchRouteById(routeId);
            const sortedStops = data.stops.sort((a, b) => a.stopOrder - b.stopOrder);
            setStops(sortedStops);
            setShowRoute(true);
            setRouteRequested(false);
            setSelectedRouteId(routeId);
        } catch (error) {
            console.error('Failed to load route:', error);
        }
    };

    const directionsCallback = (response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setDirections(response);
                setRouteRequested(true);
            } else {
                console.error('Directions request failed due to ' + response.status);
            }
        }
    };

    const origin = stops.length > 0 ? { lat: stops[0].latitude, lng: stops[0].longitude } : null;
    const destination = stops.length > 1 ? { lat: stops[stops.length - 1].latitude, lng: stops[stops.length - 1].longitude } : null;
    const waypoints = stops.slice(1, -1).map(stop => ({
        location: { lat: stop.latitude, lng: stop.longitude },
        stopover: true
    }));

    return (
        <div className="map-container">
            <GoogleMap
                className="map-f"
                mapContainerStyle={mapSize}
                center={{ lat: 49.4460, lng: 32.0700 }}
                zoom={13}
            >
                <div className="mapbut-cont">
                    {routes.map((route) => (
                        <button
                            key={route.id}
                            className={`route-num ${selectedRouteId === route.id ? 'active' : ''}`}
                            onClick={() => handleLoadRoute(route.routeNumber)}
                        >
                            {route.routeNumber}
                        </button>
                    ))}
                </div>

                {showRoute && origin && destination && !routeRequested && (
                    <DirectionsService
                        options={{
                            origin,
                            destination,
                            waypoints,
                            travelMode: 'DRIVING'
                        }}
                        callback={directionsCallback}
                    />
                )}

                {directions && (
                    <DirectionsRenderer options={{ directions }} />
                )}
            </GoogleMap>
        </div>
    );
};

export default MapPage;