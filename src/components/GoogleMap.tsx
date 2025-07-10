import { useEffect, useRef, useState } from "react";
// import { Loader } from "@googlemaps/js-api-loader";
import markerIcon from "@/assets/images/marker.png";
import * as gmaps from "@googlemaps/js-api-loader";
import { collectorsHomeService } from "@/services/sharedService";
import { Collector } from "@/types/collectors.interface";
import gmapStyle from '@/assets/gmap-style/gmapStyle.json'
import { title } from "process";
const { Loader } = gmaps;
interface MarkerData {
    //@ts-ignore
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
//@ts-ignore
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({
        lat: 0,
        lng: 0,
    });

    useEffect(() => {


        collectorsHomeService().then((response) => {
            // setCollectors(response.data.collectors)
            const collector = response.data.collectors
            if (navigator.geolocation && collector.length) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCenter(coords);
                    initializeGoogleMap(coords, collector);
                });
            }

        })





    }, []);





    const initializeGoogleMap = async (
        //@ts-ignore
        centerPosition: google.maps.LatLngLiteral,
        collectors: Collector[]
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
//@ts-ignore
            const mapOptions: google.maps.MapOptions = {
                zoom: 14,
                center: centerPosition,
                //@ts-ignore
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                scaleControl: true,
                fullscreenControl: false,
                gestureHandling: "greedy",
                styles: gmapStyle
            };
            console.log('options', mapOptions)
//@ts-ignore
            const map = new google.maps.Map(mapRef.current, mapOptions);

            console.log('collector issssssssssss', collectors)
            collectors.forEach((data) => {
                //@ts-ignore
                const marker = new google.maps.Marker({
                    position: { lat: Number(data.current_lat), lng: Number(data.current_lng) },
                    map,
                    icon: markerIcon.src,
                    title: data.name,

                });

                // Create a single InfoWindow instance (recommended for reuse)
                // const infoWindow = new google.maps.InfoWindow();

                // // Show title in InfoWindow when marker is clicked
                // marker.addListener('click', () => {

                // });



                marker.addListener("click", () => {
                    //@ts-ignore
                    const infoWindow = new google.maps.InfoWindow();
                    // infoWindow.setContent(marker.getTitle()); // getTitle() retrieves the 'title' you set
                    // infoWindow.open(map, marker);
                    // Handle marker click if needed
                    console.log(marker.position.lat())
                    const selectedCollector = collectors.find((item) => {
                        return marker.position.lat() == item.current_lat && marker.position.lng() == item.current_lng
                    })
                    if (selectedCollector) {
                        infoWindow.setContent(`
                            
                            <div class="text-white w-full h-full px-3 bg-[#009414]">
                             ${selectedCollector.name}
                            </div>

                            `)
                        // infoWindow.classList.add('text-red-600' ,'font-bold')
                        infoWindow.open(map, marker);
                    }
                    console.log('find it', selectedCollector)
                });
            });
        });
    };

    return (
        <div className="w-full h-full rounded-3xl overflow-hidden">
            <div id="get-location-map" ref={mapRef} className="w-full h-full"></div>
        </div>
    );
}


