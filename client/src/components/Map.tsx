import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

// ==================== Google Maps 初始化 ====================
function loadGoogleMapsScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve();
      script.remove();
    };
    script.onerror = () => {
      reject(new Error("Failed to load Google Maps script"));
      script.remove();
    };
    document.head.appendChild(script);
  });
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map | L.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 39.9042, lng: 116.4074 },
  initialZoom = 9,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | L.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isDevelopment = import.meta.env.DEV;

  const initGoogleMap = useCallback(async () => {
    try {
      await loadGoogleMapsScript();
      if (!mapContainer.current) return;

      map.current = new window.google!.maps.Map(mapContainer.current, {
        zoom: initialZoom,
        center: initialCenter,
        mapTypeId: window.google!.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
      });

      if (onMapReady && map.current) {
        onMapReady(map.current);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Google Maps initialization failed:", error);
      setMapError("Google Maps 加载失败");
      setIsLoading(false);
    }
  }, [initialZoom, initialCenter, onMapReady]);

  const initLeafletMap = useCallback(() => {
    try {
      if (!mapContainer.current) return;

      // 清除之前的地图实例
      if ((mapContainer.current as any)._leaflet_id) {
        const oldMap = L.DomUtil.get(mapContainer.current) as any;
        if (oldMap && oldMap._leaflet_id) {
          delete (oldMap as any)._leaflet_id;
        }
      }

      const leafletMap = L.map(mapContainer.current).setView(
        [initialCenter.lat, initialCenter.lng],
        initialZoom
      );

      // 添加OpenStreetMap图层
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMap);

      map.current = leafletMap;

      if (onMapReady) {
        onMapReady(leafletMap);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Leaflet initialization failed:", error);
      setMapError("Leaflet 地图加载失败");
      setIsLoading(false);
    }
  }, [initialZoom, initialCenter, onMapReady]);

  useEffect(() => {
    setIsLoading(true);
    setMapError(null);

    if (isDevelopment) {
      initLeafletMap();
    } else {
      initGoogleMap();
    }

    return () => {
      if (map.current instanceof L.Map) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isDevelopment, initGoogleMap, initLeafletMap]);

  return (
    <div className={cn("w-full h-[500px] relative", className)}>
      <div ref={mapContainer} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载地图...</p>
          </div>
        </div>
      )}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700 bg-opacity-90 rounded">
          <div className="text-center space-y-4">
            <p className="text-white text-lg font-semibold">⚠️ {mapError}</p>
            <p className="text-gray-300 text-sm">
              {isDevelopment
                ? "开发环境使用 Leaflet + OpenStreetMap"
                : "生产环境使用 Google Maps"}
            </p>
            <p className="text-gray-300 text-xs">
              您仍可以使用其他功能进行卫星影像查询
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
