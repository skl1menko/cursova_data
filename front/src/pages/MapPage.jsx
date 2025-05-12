import React, { useState } from 'react';
import {
    GoogleMap,
    LoadScript,
    DirectionsService,
    DirectionsRenderer
} from '@react-google-maps/api';
import './MapPage.css';

import { fetchRouteById } from '../api/route-api';

const MapPage = () => {
    const [directions, setDirections] = useState(null);
    const [stops, setStops] = useState([]);
    const [showRoute, setShowRoute] = useState(false);
    const [routeRequested, setRouteRequested] = useState(false);

    const handleLoadRoute = async () => {
        if (showRoute) {
            setDirections(null);
            setStops([]);
            setShowRoute(false);
            setRouteRequested(false);
            return;
        }

        try {
            const data = await fetchRouteById(1); // можно позже заменить на динамический ID
            const sortedStops = data.stops.sort((a, b) => a.stopOrder - b.stopOrder);
            setStops(sortedStops);
            setShowRoute(true);
            setRouteRequested(false);
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
                mapContainerStyle={{ marginRight: "-200px", width: '1550px', height: '100vh' }}
                center={{ lat: 49.4460, lng: 32.0700 }}
                zoom={13}
            >
                <div className="mapbut-cont">
                    <button className="route-num" onClick={handleLoadRoute}>21</button>
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