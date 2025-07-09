import { useEffect, useRef, useState } from "react";
// import { Loader } from "@googlemaps/js-api-loader";
import markerIcon from "@/assets/images/marker.png";
import * as gmaps from "@googlemaps/js-api-loader";
const { Loader } = gmaps;
interface MarkerData {
    position: google.maps.LatLngLiteral;
    icon: string;
}

const markersData: MarkerData[] = [
    { position: { lat: 40.7128, lng: -74.006 }, icon: markerIcon.src }, // New York
    { position: { lat: 34.0522, lng: -118.2437 }, icon: markerIcon.src }, // Los Angeles
    { position: { lat: 41.8781, lng: -87.6298 }, icon: markerIcon.src }, // Chicago
];

export default function GoogleMap() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({
        lat: 0,
        lng: 0,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCenter(coords);
                initializeGoogleMap(coords);
            });
        }
    }, []);

    const initializeGoogleMap = async (
        centerPosition: google.maps.LatLngLiteral
    ) => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
            version: "weekly",
            libraries: ["drawing", "geometry", "places", "visualization"],
            language: "ar",
            region: "EG",
        });

        loader.load().then(() => {
            if (!mapRef.current) return;

            const mapOptions: google.maps.MapOptions = {
                zoom: 17,
                center: centerPosition,
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                scaleControl: true,
                fullscreenControl: false,
                gestureHandling: "greedy",
            };

            const map = new google.maps.Map(mapRef.current, mapOptions);

            markersData.forEach((data) => {
                const marker = new google.maps.Marker({
                    position: data.position,
                    map,
                    icon: data.icon,
                });

                marker.addListener("click", () => {
                    // Handle marker click if needed
                });
            });
        });
    };

    return (
      <div className="w-[300px] h-[300px]">

        <div id="get-location-map" ref={mapRef} className="w-full h-full"></div>
      </div>
    );
}
