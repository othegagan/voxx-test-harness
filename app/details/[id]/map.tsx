'use client';

import { Locate } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    tripPoints: any;
}

export default function MapBox({ tripPoints }: Props) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(null);

    // Sort points by timeOfFix to get chronological order
    const sortedPoints = [...tripPoints].sort((a, b) => new Date(a.timeOfFix) - new Date(b.timeOfFix));

    // Initialize the map when component mounts
    useEffect(() => {
        // Define a function to load the Leaflet map
        const loadMap = () => {
            try {
                // Make sure Leaflet is available
                if (!window.L) {
                    throw new Error('Leaflet library not loaded');
                }

                // Create a map centered on the first point
                const map = window.L.map('map').setView([sortedPoints[0].latitude, sortedPoints[0].longitude], 13);

                // Add OpenStreetMap tiles
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Create a polyline for the route
                const routePoints = sortedPoints.map((point) => [point.latitude, point.longitude]);
                const polyline = window.L.polyline(routePoints, {
                    color: 'blue',
                    weight: 4,
                    opacity: 0.7
                }).addTo(map);

                // Add markers for start and end points
                const startMarker = window.L.marker([sortedPoints[0].latitude, sortedPoints[0].longitude], {
                    icon: window.L.divIcon({
                        html: '<div style="background-color: green; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                        className: 'custom-marker'
                    })
                }).addTo(map);

                const endMarker = window.L.marker(
                    [sortedPoints[sortedPoints.length - 1].latitude, sortedPoints[sortedPoints.length - 1].longitude],
                    {
                        icon: window.L.divIcon({
                            html: '<div style="background-color: red; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                            className: 'custom-marker'
                        })
                    }
                ).addTo(map);
                // Add small markers for each data point
                sortedPoints.forEach((point, index) => {
                    if (index !== 0 && index !== sortedPoints.length - 1) {
                        const marker = window.L.circleMarker([point.latitude, point.longitude], {
                            radius: 3,
                            fillColor: '#3388ff',
                            color: '#fff',
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        }).addTo(map);

                        const time = new Date(point.timeOfFix).toLocaleTimeString();
                        marker.bindPopup(`Time: ${time}<br>Speed: ${point.speed} mph`);
                    }
                });

                // Fit the map to show all points
                map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

                setMapLoaded(true);
            } catch (error) {
                console.error('Error loading map:', error);
                setMapError(error.message);
            }
        };

        // Load Leaflet CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.css';
        document.head.appendChild(linkElement);

        // Load Leaflet JavaScript
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.js';
        scriptElement.onload = loadMap;
        scriptElement.onerror = () => setMapError('Failed to load Leaflet library');
        document.body.appendChild(scriptElement);

        // Cleanup function to remove the script and link elements
        return () => {
            document.head.removeChild(linkElement);
            document.body.removeChild(scriptElement);
        };
    }, []);

    // Find max speed
    const maxSpeed = Math.max(...tripPoints.map((point) => Number.parseInt(point.speed) || 0));
    return (
        <div className=' rounded-lg shadow overflow-hidden'>
            <h4 className='text-lg font-bold'>Route Map</h4>

            {mapError && <div className='p-4  text-red-600 border-b'>Error loading map: {mapError}</div>}

            {!mapLoaded && !mapError && (
                <div className='flex justify-center items-center h-64 '>
                    <div className='animate-pulse text-gray-500 flex flex-col items-center'>
                        <Locate className='animate-spin mb-2' size={24} />
                        <p>Loading map...</p>
                    </div>
                </div>
            )}

            <div id='map' className='h-[90dvh] w-full' />
        </div>
    );
}
