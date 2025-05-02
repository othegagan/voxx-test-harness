'use client';

import { Locate } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    tripPoints: any;
}

export default function MapBox({ tripPoints }: Props) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    // Sort points by timeOfFix to get chronological order
    //@ts-ignore
    const sortedPoints = [...tripPoints].sort((a, b) => new Date(a.timeOfFix) - new Date(b.timeOfFix));

    // Initialize the map when component mounts
    useEffect(() => {
        // Define a function to load the Leaflet map
        const loadMap = () => {
            try {
                // Make sure Leaflet is available
                //@ts-ignore
                if (!window.L) {
                    throw new Error('Leaflet library not loaded');
                }

                // Create a map centered on the first point
                //@ts-ignore
                const map = window.L.map('map').setView([sortedPoints[0].latitude, sortedPoints[0].longitude], 13);

                // Add OpenStreetMap tiles
                //@ts-ignore
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Create a polyline for the route
                const routePoints = sortedPoints.map((point) => [point.latitude, point.longitude]);
                //@ts-ignore
                const polyline = window.L.polyline(routePoints, {
                    color: 'blue',
                    weight: 4,
                    opacity: 0.7
                }).addTo(map);

                // Add markers for start and end points

                // Add small markers for each data point
                sortedPoints.forEach((point, index) => {
                    if (index !== 0 && index !== sortedPoints.length - 1) {
                        //@ts-ignore
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
                //@ts-ignore
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
    // const maxSpeed = Math.max(...tripPoints.map((point) => Number.parseInt(point.speed) || 0));
    return (
        <div className=' overflow-hidden rounded-lg shadow'>
            <h4 className='font-bold text-lg'>Route Map</h4>

            {mapError && <div className='border-b p-4 text-red-600'>Error loading map: {mapError}</div>}

            {!mapLoaded && !mapError && (
                <div className='flex h-64 items-center justify-center '>
                    <div className='flex animate-pulse flex-col items-center text-gray-500'>
                        <Locate className='mb-2 animate-spin' size={24} />
                        <p>Loading map...</p>
                    </div>
                </div>
            )}

            <div id='map' className='h-[90dvh] w-full' />
        </div>
    );
}
