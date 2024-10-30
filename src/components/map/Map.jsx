import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import './map.scss';
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';
import { useEffect, useCallback } from 'react';

const DEFAULT_CENTER = [-22.907104, -47.063240];
const DEFAULT_ZOOM = 14;
const SINGLE_POST_ZOOM = 16;

const MapController = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [map, center, zoom]);

    return null;
};

const MapComponent = ({ items = [], isSinglePost = false }) => {
    const parseCoordinates = useCallback((item) => {
        try {
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);

            if (isValidCoordinate(lat, lng)) {
                return [lat, lng];
            }
        } catch (error) {
            console.warn('Error parsing coordinates:', error);
        }
        return null;
    }, []);

    const isValidCoordinate = (lat, lng) => {
        return !isNaN(lat) &&
            !isNaN(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180;
    };

    const getMapConfig = useCallback(() => {
        if (items.length === 0) {
            return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
        }

        if (isSinglePost && items[0]) {
            const coords = parseCoordinates(items[0]);
            if (coords) {
                return { center: coords, zoom: SINGLE_POST_ZOOM };
            }
        }

        for (const item of items) {
            const coords = parseCoordinates(item);
            if (coords) {
                return { center: coords, zoom: DEFAULT_ZOOM };
            }
        }

        return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
    }, [items, isSinglePost, parseCoordinates]);

    const { center, zoom } = getMapConfig();

    return (
        <div className="map-wrapper">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="map"
            >
                <MapController center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {items.map(item => {
                    const coords = parseCoordinates(item);
                    if (coords) {
                        return <Pin item={item} key={item.id} />;
                    }
                    return null;
                })}
            </MapContainer>
            {isSinglePost && !parseCoordinates(items[0]) && (
                <div className="map-warning">
                    Localização aproximada - usando coordenadas padrão de Campinas
                </div>
            )}
        </div>
    );
};

export default MapComponent;