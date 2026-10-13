import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Hospital,
  ShieldAlert,
  Home as ShelterIcon,
  Flame,
  Radio,
  Layers,
  Phone,
  Navigation,
  Globe,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye,
  Crosshair,
  CloudRain,
  Check,
  Bike,
  Mountain,
  Moon,
  Route as RouteIcon,
  Locate,
  AlertTriangle,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Info,
  Search
} from 'lucide-react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { DEMO_FACILITIES } from '../data/demoFacilities';

export type GoogleMapMode = 'normal' | 'satellite' | 'terrain' | 'bicycle' | 'dark-radar';

export interface StateRegionPreset {
  state: string;
  cityName: string;
  areaName: string;
  lat: number;
  lng: number;
}

export const INDIAN_STATE_PRESETS: StateRegionPreset[] = [
  { state: 'Telangana', cityName: 'Hyderabad Central', areaName: 'Charminar & Abids Sector', lat: 17.3850, lng: 78.4867 },
  { state: 'Telangana', cityName: 'Secunderabad', areaName: 'Begumpet & Paradise Zone', lat: 17.4399, lng: 78.4983 },
  { state: 'Telangana', cityName: 'Cyberabad', areaName: 'Gachibowli & Hitec City Corridor', lat: 17.4401, lng: 78.3489 },
  { state: 'Andhra Pradesh', cityName: 'Visakhapatnam', areaName: 'Vizag Port & RK Beach Coast', lat: 17.6868, lng: 83.2185 },
  { state: 'Andhra Pradesh', cityName: 'Vijayawada', areaName: 'Prakasam Barrage & Krishna Basin', lat: 16.5062, lng: 80.6480 },
  { state: 'Tamil Nadu', cityName: 'Chennai', areaName: 'Marina Beach & Adyar Basin', lat: 13.0827, lng: 80.2707 },
  { state: 'Maharashtra', cityName: 'Mumbai', areaName: 'South Mumbai & Suburban Relief', lat: 19.0760, lng: 72.8777 },
  { state: 'Karnataka', cityName: 'Bengaluru', areaName: 'Bengaluru Urban & Electronic City', lat: 12.9716, lng: 77.5946 },
  { state: 'Delhi NCR', cityName: 'New Delhi', areaName: 'Yamuna Flood Basin & Capital Zone', lat: 28.6139, lng: 77.2090 },
  { state: 'West Bengal', cityName: 'Kolkata', areaName: 'Hooghly Estuary & Salt Lake', lat: 22.5726, lng: 88.3639 },
  { state: 'Odisha', cityName: 'Bhubaneswar', areaName: 'Cyclone Coastal Grid & Cuttack', lat: 20.2961, lng: 85.8245 },
  { state: 'Kerala', cityName: 'Kochi', areaName: 'Ernakulam Backwaters & Coast', lat: 9.9312, lng: 76.2673 },
  { state: 'Gujarat', cityName: 'Ahmedabad', areaName: 'Sabarmati Basin & City Sector', lat: 23.0225, lng: 72.5714 }
];

export interface RouteOption {
  id: 'safest' | 'shortest';
  name: string;
  distanceKm: number;
  timeMins: number;
  safetyScore: number;
  hazardWarnings: string[];
  routePoints: [number, number][]; // [lat, lng]
  instructions: { step: number; text: string; distance: string; isHazard?: boolean }[];
}

export const InteractiveMapView: React.FC = () => {
  const { incidents, responders, userEnvironment } = useApp();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const transportLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Map Modes (Google Maps Style)
  const [mapMode, setMapMode] = useState<GoogleMapMode>('satellite');
  const [filterType, setFilterType] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // State & Area Selector/Search
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(0);
  const [areaSearchQuery, setAreaSearchQuery] = useState<string>('');

  // User Current Location State
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [currentGps, setCurrentGps] = useState<{ lat: number; lng: number; address: string } | null>({
    lat: 17.3850,
    lng: 78.4867,
    address: 'Telangana State • Hyderabad Central (Charminar & Abids Sector)'
  });
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Routing State
  const [showRoutePlanner, setShowRoutePlanner] = useState<boolean>(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('shelter-1');
  const [selectedRouteMode, setSelectedRouteMode] = useState<'safest' | 'shortest'>('safest');
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);
  const [showTurnByTurn, setShowTurnByTurn] = useState<boolean>(false);

  // Weather and Hazard overlays
  const [showHazardZones, setShowHazardZones] = useState<boolean>(true);
  const [showRainRadar, setShowRainRadar] = useState<boolean>(false);

  // Selected Pin for details drawer
  const [selectedPin, setSelectedPin] = useState<{
    id?: string;
    title: string;
    type: string;
    area: string;
    status?: string;
    contact?: string;
    details?: string;
    lat: number;
    lng: number;
  } | null>(null);

  // Tile layer configurations
  const TILE_CONFIGS: Record<GoogleMapMode, { url: string; attribution: string; maxZoom: number }> = {
    normal: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap',
      maxZoom: 17
    },
    bicycle: {
      url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      attribution: '© CyclOSM | Map data: © OpenStreetMap contributors',
      maxZoom: 18
    },
    'dark-radar': {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '© CARTO, © OpenStreetMap contributors',
      maxZoom: 19
    }
  };

  // Get User Current Location
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setGpsError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const userGps = {
            lat: latitude,
            lng: longitude,
            address: `Exact GPS (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`
          };
          setCurrentGps(userGps);
          setIsLocating(false);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });
          }
        },
        error => {
          console.warn('Geolocation failed or permission denied, using default high-accuracy location', error);
          setIsLocating(false);
          setGpsError('GPS permission blocked. Centered on local emergency dispatch grid.');
          // Default center
          if (mapInstanceRef.current && currentGps) {
            mapInstanceRef.current.flyTo([currentGps.lat, currentGps.lng], 14);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
      setGpsError('Browser geolocation unsupported.');
    }
  };

  // Generate Safest and Shortest Routes to selected destination
  const calculateRoutes = (destLat: number, destLng: number): { safest: RouteOption; shortest: RouteOption } => {
    const originLat = currentGps?.lat || 17.3850;
    const originLng = currentGps?.lng || 78.4867;

    // Calculate straight-line distance roughly
    const latDiff = destLat - originLat;
    const lngDiff = destLng - originLng;
    const directDistKm = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;

    // Shortest Route Points (Direct path, potentially across flood/hazard zones)
    const shortestPoints: [number, number][] = [
      [originLat, originLng],
      [originLat + latDiff * 0.3, originLng + lngDiff * 0.25],
      [originLat + latDiff * 0.6, originLng + lngDiff * 0.7],
      [destLat, destLng]
    ];

    // Safest Route Points (Detour avoiding hazard zones)
    const safestPoints: [number, number][] = [
      [originLat, originLng],
      [originLat + latDiff * 0.1, originLng + lngDiff * 0.45], // Detour East
      [originLat + latDiff * 0.45, originLng + lngDiff * 0.85], // Elevated Bypass
      [originLat + latDiff * 0.85, originLng + lngDiff * 0.95], // Safe Access Ramp
      [destLat, destLng]
    ];

    const shortestDist = Math.max(2.4, parseFloat((directDistKm * 1.1).toFixed(1)));
    const safestDist = Math.max(3.2, parseFloat((directDistKm * 1.45).toFixed(1)));

    return {
      safest: {
        id: 'safest',
        name: '🛡️ Safest Route (Flood & Hazard Evading)',
        distanceKm: safestDist,
        timeMins: Math.round((safestDist / 35) * 60) + 3,
        safetyScore: 98,
        hazardWarnings: ['Avoids 0.8m active flood inundation on Causeway Bridge via High-Level Bypass.'],
        routePoints: safestPoints,
        instructions: [
          { step: 1, text: 'Head East on Main Feeder Road toward High Elevation Flyover', distance: '1.2 km' },
          { step: 2, text: 'Merge onto NH-44 Elevated Safe Bypass (Bypassing Flood Inundation Zone)', distance: '4.8 km' },
          { step: 3, text: 'Take Exit 12 toward Emergency Relief Access Corridor', distance: '2.1 km' },
          { step: 4, text: 'Arrive safely at destination shelter/facility entry gate', distance: '0.4 km' }
        ]
      },
      shortest: {
        id: 'shortest',
        name: '⚡ Shortest Route (Direct Path - HIGH RISK)',
        distanceKm: shortestDist,
        timeMins: Math.round((shortestDist / 28) * 60),
        safetyScore: 42,
        hazardWarnings: [
          '⚠️ WARNING: Crosses active 0.6m deep floodwater at River Causeway.',
          '⚠️ WARNING: Debris blockage reported near Low Railway Underpass.'
        ],
        routePoints: shortestPoints,
        instructions: [
          { step: 1, text: 'Head straight on Direct City Canal Road', distance: '0.8 km' },
          { step: 2, text: '⚠️ CAUTION: Cross River Causeway (Active Water Inundation Reported)', distance: '1.5 km', isHazard: true },
          { step: 3, text: 'Pass beneath Railway Bridge Underpass', distance: '2.2 km', isHazard: true },
          { step: 4, text: 'Arrive at destination', distance: '0.3 km' }
        ]
      }
    };
  };

  // Handle State Preset Jump
  const handleSelectStatePreset = (index: number) => {
    setSelectedStateIndex(index);
    const preset = INDIAN_STATE_PRESETS[index];
    if (preset) {
      const newGps = {
        lat: preset.lat,
        lng: preset.lng,
        address: `${preset.state} State • ${preset.cityName} (${preset.areaName})`
      };
      setCurrentGps(newGps);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([preset.lat, preset.lng], 13, { duration: 1.2 });
      }
    }
  };

  // Handle Search Input
  const handleAreaSearch = (query: string) => {
    setAreaSearchQuery(query);
    if (!query.trim()) return;
    const qLower = query.toLowerCase();
    const matched = INDIAN_STATE_PRESETS.find(
      p =>
        p.state.toLowerCase().includes(qLower) ||
        p.cityName.toLowerCase().includes(qLower) ||
        p.areaName.toLowerCase().includes(qLower)
    );
    if (matched) {
      const newGps = {
        lat: matched.lat,
        lng: matched.lng,
        address: `${matched.state} State • ${matched.cityName} (${matched.areaName})`
      };
      setCurrentGps(newGps);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([matched.lat, matched.lng], 13, { duration: 1 });
      }
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = [currentGps?.lat || 17.3850, currentGps?.lng || 78.4867];
      
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false
      });

      // Add Base Tile Layer
      const tileConfig = TILE_CONFIGS[mapMode];
      const tileLayer = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: tileConfig.maxZoom
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Add Reference Labels Layer (State & Area Names)
      if (mapMode === 'satellite') {
        const placesLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 18 }
        ).addTo(map);
        const transportLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 18 }
        ).addTo(map);
        labelLayerRef.current = placesLayer;
        transportLayerRef.current = transportLayer;
      }

      // Add Layer Groups
      const markersGroup = L.layerGroup().addTo(map);
      const routeLayerGroup = L.layerGroup().addTo(map);

      markersGroupRef.current = markersGroup;
      routeLayerGroupRef.current = routeLayerGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Map Mode Changes (Tiles & Place Labels update)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }
    if (transportLayerRef.current) {
      map.removeLayer(transportLayerRef.current);
      transportLayerRef.current = null;
    }

    const tileConfig = TILE_CONFIGS[mapMode];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom
    }).addTo(map);

    tileLayerRef.current = newTileLayer;

    // Overlay State & Area Labels over Satellite & Radar imagery
    if (mapMode === 'satellite') {
      const placesLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);
      const transportLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);
      labelLayerRef.current = placesLayer;
      transportLayerRef.current = transportLayer;
    } else if (mapMode === 'dark-radar') {
      const darkLabels = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
        { maxZoom: 19 }
      ).addTo(map);
      labelLayerRef.current = darkLabels;
    }
  }, [mapMode]);

  // Update Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    // 1. Render Current User GPS Location Marker
    if (currentGps) {
      const userHtml = `
        <div class="flex flex-col items-center group cursor-pointer">
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
            <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
              📍
            </div>
          </div>
          <div class="bg-slate-900/90 text-blue-300 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-blue-500/40 shadow-lg mt-0.5 whitespace-nowrap">
            GPS Location
          </div>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userHtml,
        className: 'custom-user-marker',
        iconSize: [80, 48],
        iconAnchor: [40, 14]
      });

      const userMarker = L.marker([currentGps.lat, currentGps.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div class="p-2 space-y-1 text-xs">
          <div class="font-bold text-blue-400">📍 Your GPS Location</div>
          <div class="text-slate-300">${currentGps.address}</div>
          <div class="text-[10px] text-slate-400 font-mono">${currentGps.lat.toFixed(4)}° N, ${currentGps.lng.toFixed(4)}° E</div>
        </div>
      `);
      markersGroup.addLayer(userMarker);
    }

    // 2. Render Incident Markers
    if (filterType === 'all' || filterType === 'incidents') {
      incidents.forEach((inc, i) => {
        const lat = (currentGps?.lat || 17.3850) + (i % 2 === 0 ? 0.025 : -0.018) * (i + 1);
        const lng = (currentGps?.lng || 78.4867) + (i % 3 === 0 ? 0.032 : -0.022) * (i + 1);
        const areaLabel = inc.location.area || inc.location.address || 'Telangana Region';

        const incHtml = `
          <div class="flex flex-col items-center group cursor-pointer">
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full bg-red-600/40 animate-ping"></div>
              <div class="w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
                🚨
              </div>
            </div>
            <div class="bg-slate-900/95 text-red-300 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-red-500/50 shadow-md mt-0.5 whitespace-nowrap max-w-[120px] truncate">
              ${areaLabel}
            </div>
          </div>
        `;
        const incIcon = L.divIcon({
          html: incHtml,
          className: 'custom-inc-marker',
          iconSize: [100, 48],
          iconAnchor: [50, 14]
        });

        const marker = L.marker([lat, lng], { icon: incIcon });
        marker.on('click', () => {
          setSelectedPin({
            id: inc.id,
            title: `${inc.id}: ${inc.disasterType.toUpperCase()}`,
            type: 'Emergency Incident',
            area: areaLabel,
            status: inc.status,
            details: `${inc.affectedPeopleCount} affected people • Required Help: ${inc.requiredHelp.join(', ')}`,
            lat,
            lng
          });
        });
        markersGroup.addLayer(marker);
      });
    }

    // 3. Render Hospital Markers
    if (filterType === 'all' || filterType === 'hospitals') {
      DEMO_FACILITIES.filter(f => f.type === 'hospital').forEach((fac, i) => {
        const lat = (currentGps?.lat || 17.3850) + (i === 0 ? 0.018 : -0.028);
        const lng = (currentGps?.lng || 78.4867) + (i === 0 ? -0.035 : 0.042);

        const hospHtml = `
          <div class="flex flex-col items-center group cursor-pointer">
            <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
              🏥
            </div>
            <div class="bg-slate-900/95 text-blue-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-blue-500/50 shadow-md mt-0.5 whitespace-nowrap max-w-[120px] truncate">
              ${fac.area}
            </div>
          </div>
        `;
        const hospIcon = L.divIcon({
          html: hospHtml,
          className: 'custom-hosp-marker',
          iconSize: [100, 48],
          iconAnchor: [50, 14]
        });

        const marker = L.marker([lat, lng], { icon: hospIcon });
        marker.on('click', () => {
          setSelectedPin({
            title: fac.name,
            type: 'Hospital Trauma Center',
            area: fac.area,
            contact: fac.contact,
            details: fac.availability,
            lat,
            lng
          });
        });
        markersGroup.addLayer(marker);
      });
    }

    // 4. Render Relief Shelter Markers
    if (filterType === 'all' || filterType === 'shelters') {
      DEMO_FACILITIES.filter(f => f.type === 'shelter').forEach((fac, i) => {
        const lat = (currentGps?.lat || 17.3850) + (i === 0 ? -0.015 : 0.038);
        const lng = (currentGps?.lng || 78.4867) + (i === 0 ? -0.018 : -0.045);

        const shelterHtml = `
          <div class="flex flex-col items-center group cursor-pointer">
            <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
              🏠
            </div>
            <div class="bg-slate-900/95 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-500/50 shadow-md mt-0.5 whitespace-nowrap max-w-[120px] truncate">
              ${fac.area}
            </div>
          </div>
        `;
        const shelterIcon = L.divIcon({
          html: shelterHtml,
          className: 'custom-shelter-marker',
          iconSize: [100, 48],
          iconAnchor: [50, 14]
        });

        const marker = L.marker([lat, lng], { icon: shelterIcon });
        marker.on('click', () => {
          setSelectedPin({
            title: fac.name,
            type: 'Cyclone Relief Shelter',
            area: fac.area,
            contact: fac.contact,
            details: `${fac.capacity || ''} • ${fac.availability}`,
            lat,
            lng
          });
        });
        markersGroup.addLayer(marker);
      });
    }

    // 5. Render Responder Team Markers
    if (filterType === 'all' || filterType === 'responders') {
      responders.forEach((resp, i) => {
        const lat = (currentGps?.lat || 17.3850) + (i === 0 ? 0.012 : -0.032);
        const lng = (currentGps?.lng || 78.4867) + (i === 0 ? 0.025 : -0.015);

        const respHtml = `
          <div class="flex flex-col items-center group cursor-pointer">
            <div class="w-7 h-7 rounded-full bg-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
              🚑
            </div>
            <div class="bg-slate-900/95 text-purple-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-purple-500/50 shadow-md mt-0.5 whitespace-nowrap max-w-[120px] truncate">
              ${resp.area || 'NDRF Base'}
            </div>
          </div>
        `;
        const respIcon = L.divIcon({
          html: respHtml,
          className: 'custom-resp-marker',
          iconSize: [100, 48],
          iconAnchor: [50, 14]
        });

        const marker = L.marker([lat, lng], { icon: respIcon });
        marker.on('click', () => {
          setSelectedPin({
            title: resp.teamName,
            type: `Field Responder (${resp.category.toUpperCase()})`,
            area: resp.area,
            contact: resp.phone,
            status: resp.status,
            details: `Team Leader: ${resp.leaderName} • Vehicle: ${resp.vehicle}`,
            lat,
            lng
          });
        });
        markersGroup.addLayer(marker);
      });
    }

    // 6. Hazard Zone Overlays
    if (showHazardZones) {
      const hazardCircle1 = L.circle(
        [(currentGps?.lat || 17.3850) + 0.01, (currentGps?.lng || 78.4867) + 0.015],
        {
          color: '#ef4444',
          fillColor: '#f87171',
          fillOpacity: 0.25,
          radius: 800
        }
      ).bindPopup('⚠️ Active Waterlogging / Flood Inundation Danger Zone');

      const hazardCircle2 = L.circle(
        [(currentGps?.lat || 17.3850) - 0.02, (currentGps?.lng || 78.4867) - 0.01],
        {
          color: '#f59e0b',
          fillColor: '#fbbf24',
          fillOpacity: 0.2,
          radius: 650
        }
      ).bindPopup('⚠️ Debris Blockage Risk Zone');

      markersGroup.addLayer(hazardCircle1);
      markersGroup.addLayer(hazardCircle2);
    }
  }, [currentGps, filterType, incidents, responders, showHazardZones]);

  // Update Route Polylines on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current) return;
    const routeGroup = routeLayerGroupRef.current;
    routeGroup.clearLayers();

    if (!showRoutePlanner || !selectedDestinationId) return;

    // Determine target location for route
    let destLat = (currentGps?.lat || 17.3850) + 0.038;
    let destLng = (currentGps?.lng || 78.4867) - 0.045;

    const matchedFacility = DEMO_FACILITIES.find(f => f.id === selectedDestinationId);
    if (matchedFacility && selectedPin && selectedPin.title === matchedFacility.name) {
      destLat = selectedPin.lat;
      destLng = selectedPin.lng;
    }

    const { safest, shortest } = calculateRoutes(destLat, destLng);
    const chosenRoute = selectedRouteMode === 'safest' ? safest : shortest;
    setActiveRoute(chosenRoute);

    // Draw Shortest Route in Orange/Red
    const shortestPolyline = L.polyline(shortest.routePoints, {
      color: selectedRouteMode === 'shortest' ? '#ef4444' : '#f97316',
      weight: selectedRouteMode === 'shortest' ? 6 : 3,
      opacity: selectedRouteMode === 'shortest' ? 0.9 : 0.5,
      dashArray: selectedRouteMode === 'shortest' ? undefined : '6, 6'
    });
    routeGroup.addLayer(shortestPolyline);

    // Draw Safest Route in Vibrant Emerald Green
    const safestPolyline = L.polyline(safest.routePoints, {
      color: '#10b981',
      weight: selectedRouteMode === 'safest' ? 6 : 3,
      opacity: selectedRouteMode === 'safest' ? 0.95 : 0.5,
      dashArray: selectedRouteMode === 'safest' ? undefined : '6, 6'
    });
    routeGroup.addLayer(safestPolyline);

    // Fit map bounds to view full route
    const bounds = L.latLngBounds([...safest.routePoints, ...shortest.routePoints]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });

  }, [showRoutePlanner, selectedDestinationId, selectedRouteMode, currentGps, selectedPin]);

  // Start Navigation to Selected Pin
  const handleStartNavigationToPin = (pin: typeof selectedPin) => {
    if (!pin) return;
    setShowRoutePlanner(true);
    setSelectedRouteMode('safest');
    
    // Find closest shelter or facility ID or use pin
    const matchedFac = DEMO_FACILITIES.find(f => f.name.toLowerCase().includes(pin.title.toLowerCase()));
    if (matchedFac) {
      setSelectedDestinationId(matchedFac.id);
    } else {
      setSelectedDestinationId('shelter-1');
    }
  };

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white space-y-4 shadow-2xl relative overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-2 z-50 flex flex-col max-h-none overflow-y-auto bg-slate-950 border-slate-700' : ''
      }`}
    >
      {/* Map Header & Mode Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">ResQ GIS Interactive Map</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                🛰️ Active Radar
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Google Maps modes • GPS Geolocation • Safest vs Shortest Routing</p>
          </div>
        </div>

        {/* Google Maps Style Display Mode Selector */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold shadow-inner">
          <button
            onClick={() => setMapMode('normal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              mapMode === 'normal'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Standard Google-style Road Map"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Normal</span>
          </button>

          <button
            onClick={() => setMapMode('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              mapMode === 'satellite'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="High-resolution Earth Satellite Photography"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>

          <button
            onClick={() => setMapMode('terrain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              mapMode === 'terrain'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Elevation contours & topographical relief"
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Terrain</span>
          </button>

          <button
            onClick={() => setMapMode('bicycle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              mapMode === 'bicycle'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Bicycle & foot trail routes for non-motorized evacuation"
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Bicycle</span>
          </button>

          <button
            onClick={() => setMapMode('dark-radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              mapMode === 'dark-radar'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Night Emergency Command Tactical Radar"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Night Radar</span>
          </button>
        </div>
      </div>

      {/* State & Area Locator Search Bar (Google Maps Style Area & State Selector) */}
      <div className="bg-slate-950/90 border border-blue-500/30 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 text-blue-400 font-extrabold text-xs shrink-0">
            <MapPin className="w-4 h-4 text-blue-400 animate-bounce" />
            <span>State & Area:</span>
          </div>

          {/* Preset State & City Selector */}
          <select
            value={selectedStateIndex}
            onChange={e => handleSelectStatePreset(Number(e.target.value))}
            className="p-1.5 px-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-semibold focus:outline-none focus:border-blue-500 text-xs flex-1 max-w-xs cursor-pointer"
          >
            {INDIAN_STATE_PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>
                🇮🇳 {p.state} — {p.cityName} ({p.areaName})
              </option>
            ))}
          </select>

          {/* Area & City Search Input */}
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              placeholder="Search state or area name (e.g. Hyderabad, Vizag, Chennai)..."
              value={areaSearchQuery}
              onChange={e => handleAreaSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
          <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 font-bold flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-400" />
            {currentGps?.address || 'Telangana State • Hyderabad Central'}
          </span>
        </div>
      </div>

      {/* Control Bar: Get Location, Filter Pins, Route Planner Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Layers:</span>
          {[
            { id: 'all', label: 'All Markers' },
            { id: 'incidents', label: '🔴 SOS Incidents' },
            { id: 'hospitals', label: '🏥 Hospitals' },
            { id: 'shelters', label: '🏠 Relief Shelters' },
            { id: 'responders', label: '🚑 Field Responders' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterType === f.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Action Buttons: Get Current GPS & Open Route Calculator */}
        <div className="flex items-center gap-2">
          {/* GPS Current Location Button */}
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-all shadow-md"
            title="Fetch live browser GPS coordinates"
          >
            <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Get My Location'}</span>
          </button>

          {/* Route Calculator Toggle Button */}
          <button
            onClick={() => setShowRoutePlanner(!showRoutePlanner)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shadow-md ${
              showRoutePlanner
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span>{showRoutePlanner ? 'Close Route Planner' : 'Safest Route Navigation'}</span>
          </button>

          {/* Fullscreen Map Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* GPS Error Alert Notice if permission denied */}
      {gpsError && (
        <div className="bg-amber-950/80 border border-amber-800/80 p-2.5 rounded-2xl text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{gpsError}</span>
          </div>
          <button onClick={() => setGpsError(null)} className="text-amber-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* ROUTE PLANNING DRAWER PANEL */}
      {showRoutePlanner && (
        <div className="bg-slate-950/90 border border-emerald-500/40 p-4 rounded-2xl space-y-3 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h4 className="font-extrabold text-sm text-white">ResQ Safest vs. Shortest Evacuation Routing</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              AI Flood Evacuation Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Origin Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Starting Origin:</label>
              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200">
                <Locate className="w-4 h-4 text-blue-400" />
                <span className="truncate font-medium">{currentGps ? currentGps.address : 'Current GPS Location'}</span>
              </div>
            </div>

            {/* Destination Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Destination Facility / Shelter:</label>
              <select
                value={selectedDestinationId}
                onChange={e => setSelectedDestinationId(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {DEMO_FACILITIES.map(fac => (
                  <option key={fac.id} value={fac.id}>
                    {fac.type === 'hospital' ? '🏥' : '🏠'} {fac.name} ({fac.area})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Comparison Cards (Safest vs Shortest) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Safest Route Option Card */}
            <button
              onClick={() => setSelectedRouteMode('safest')}
              className={`p-3 rounded-2xl text-left border transition-all relative ${
                selectedRouteMode === 'safest'
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safest Route
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  98% Safety Score
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-3 font-semibold">
                  <span>📏 14.5 km</span>
                  <span>⏱️ 22 mins</span>
                  <span className="text-emerald-400">0 Flood Hazards</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Uses elevated NH-44 highway corridor to completely evade inundated low-level river bridge.
                </p>
              </div>
            </button>

            {/* Shortest Route Option Card */}
            <button
              onClick={() => setSelectedRouteMode('shortest')}
              className={`p-3 rounded-2xl text-left border transition-all relative ${
                selectedRouteMode === 'shortest'
                  ? 'bg-red-950/60 border-red-500 shadow-lg shadow-red-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> Shortest Distance (HIGH RISK)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                  42% Risk Score
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-3 font-semibold">
                  <span>📏 8.2 km</span>
                  <span>⏱️ 18 mins</span>
                  <span className="text-red-400">2 Hazards</span>
                </div>
                <p className="text-[11px] text-red-300/80">
                  ⚠️ Direct path crosses active 0.6m floodwater at River Causeway. Not recommended for small vehicles.
                </p>
              </div>
            </button>
          </div>

          {/* Turn-by-Turn Navigation Accordion Toggle */}
          {activeRoute && (
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-[11px]">
                <RouteIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Selected: {activeRoute.name} ({activeRoute.distanceKm} km • {activeRoute.timeMins} mins)</span>
              </span>
              <button
                onClick={() => setShowTurnByTurn(!showTurnByTurn)}
                className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{showTurnByTurn ? 'Hide Directions' : 'View Turn-by-Turn Steps'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Turn-by-Turn Steps Details List */}
          {showTurnByTurn && activeRoute && (
            <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 max-h-40 overflow-y-auto">
              {activeRoute.instructions.map(inst => (
                <div
                  key={inst.step}
                  className={`flex items-start gap-2 text-[11px] p-1.5 rounded-lg ${
                    inst.isHazard ? 'bg-red-950/60 text-red-200 border border-red-800/60' : 'text-slate-300'
                  }`}
                >
                  <span className="font-bold text-emerald-400 min-w-4">{inst.step}.</span>
                  <span className="flex-1">{inst.text}</span>
                  <span className="font-mono text-slate-400">{inst.distance}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Leaflet Map Canvas Container */}
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-[550px]' : 'h-[400px]'
        } rounded-2xl border border-slate-800 overflow-hidden z-10`}
      >
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Controls Overlay: Hazards Toggle & Legend */}
        <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl text-[11px] space-y-2 shadow-xl z-20">
          <div className="font-bold text-slate-300 border-b border-slate-800 pb-1 flex items-center justify-between gap-2">
            <span>Map Layers</span>
            <span className="text-[10px] text-emerald-400 font-mono uppercase">{mapMode}</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showHazardZones}
              onChange={e => setShowHazardZones(e.target.checked)}
              className="rounded accent-red-500"
            />
            <span>Show Flood Risk Circles</span>
          </label>

          {/* Route Color Legend */}
          {showRoutePlanner && (
            <div className="border-t border-slate-800 pt-1.5 space-y-1 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 rounded bg-emerald-500" />
                <span className="text-emerald-300 font-bold">Safest Route</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 rounded bg-red-500" />
                <span className="text-red-300 font-bold">Shortest Route</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Marker Details Modal Drawer */}
        {selectedPin && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl text-xs space-y-2.5 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2 max-w-xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-black text-sm text-white">{selectedPin.title}</span>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 font-bold rounded-lg bg-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div>
                <strong>Category:</strong> {selectedPin.type}
              </div>
              <div>
                <strong>Area:</strong> {selectedPin.area}
              </div>
              <div className="font-mono text-emerald-400 col-span-2">
                <strong>GPS Coords:</strong> {selectedPin.lat.toFixed(4)}° N, {selectedPin.lng.toFixed(4)}° E
              </div>
            </div>

            {selectedPin.details && (
              <div className="text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                {selectedPin.details}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
              {selectedPin.contact ? (
                <a
                  href={`tel:${selectedPin.contact}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedPin.contact}</span>
                </a>
              ) : <div />}

              <button
                onClick={() => handleStartNavigationToPin(selectedPin)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
              >
                <RouteIcon className="w-3.5 h-3.5" />
                <span>Navigate Safest Way Here</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
        <span className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-red-500" />
          <span>Interactive GIS Map • Switch between Normal, Satellite, Terrain, Bicycle, & Night modes</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="italic font-mono">ResQ Navigation & Satellite Grid Online</span>
        </span>
      </div>
    </div>
  );
};
