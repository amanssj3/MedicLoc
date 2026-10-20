/* ================================================================
   MEDROUTE — APP.JS
   Medical College Distance Finder
   Uses: OpenStreetMap Nominatim (geocoding) + OSRM (routing)
================================================================ */

'use strict';

// ──────────────────────────────────────────────────
// PRE-LOADED DATA FROM PDF (73 DNB Hospitals with verified coordinates)
// Source: Maharashtra + Rajasthan DNB med Choice List - NEET PG 2023-2024-2025
// ──────────────────────────────────────────────────
const PDF_HOSPITALS = [
  { name: "PD Hinduja National Hospital and Medical Research Centre", city: "Mumbai", state: "Maharashtra", lat: 19.0332, lng: 72.8385 },
  { name: "Kokilaben Dhirubhai Ambani Hospital and Medical Research Institute", city: "Mumbai", state: "Maharashtra", lat: 19.1315, lng: 72.8252 },
  { name: "Lilavati Hospital and Research Centre", city: "Mumbai", state: "Maharashtra", lat: 19.0515, lng: 72.8295 },
  { name: "Deenanath Mangeshkar Hospital and Research Centre", city: "Pune", state: "Maharashtra", lat: 18.4984, lng: 73.8318 },
  { name: "Jaslok Hospital and Research Centre", city: "Mumbai", state: "Maharashtra", lat: 18.9715, lng: 72.8099 },
  { name: "Poona Hospital and Research Centre", city: "Pune", state: "Maharashtra", lat: 18.5108, lng: 73.8436 },
  { name: "Fortis Hospital, Mulund", city: "Mumbai", state: "Maharashtra", lat: 19.1652, lng: 72.9405 },
  { name: "Sir Hurkisondas Nurrotumdas Hospital and Research Centre", city: "Mumbai", state: "Maharashtra", lat: 18.9568, lng: 72.8197 },
  { name: "Santokbha Durlabhji Memorial Hospital Cum Medical Research Institute", city: "Jaipur", state: "Rajasthan", lat: 26.8916, lng: 75.8085 },
  { name: "Holy Spirit Hospital", city: "Mumbai", state: "Maharashtra", lat: 19.1245, lng: 72.8665 },
  { name: "KJ Somaiya Medical College", city: "Mumbai", state: "Maharashtra", lat: 19.0463, lng: 72.8752 },
  { name: "Jagjivan Ram Railway Hospital", city: "Mumbai", state: "Maharashtra", lat: 18.9696, lng: 72.8194 },
  { name: "Holy Family Hospital", city: "Mumbai", state: "Maharashtra", lat: 19.0569, lng: 72.8297 },
  { name: "Ruby Hall Clinic", city: "Pune", state: "Maharashtra", lat: 18.5323, lng: 73.8778 },
  { name: "Jehangir Hospital", city: "Pune", state: "Maharashtra", lat: 18.5302, lng: 73.8768 },
  { name: "Sadhu Vaswani Missions", city: "Pune", state: "Maharashtra", lat: 18.5255, lng: 73.8795 },
  { name: "Dr. B Nanavati Hospital", city: "Mumbai", state: "Maharashtra", lat: 19.0975, lng: 72.8427 },
  { name: "KEM Hospital", city: "Pune", state: "Maharashtra", lat: 18.5235, lng: 73.8690 },
  { name: "Breach Candy Hospital", city: "Mumbai", state: "Maharashtra", lat: 18.9723, lng: 72.8044 },
  { name: "Noble Hospital", city: "Pune", state: "Maharashtra", lat: 18.5029, lng: 73.9295 },
  { name: "Apollo Hospital", city: "Navi Mumbai", state: "Maharashtra", lat: 19.0195, lng: 73.0425 },
  { name: "Bhabha Atomic Research Centre and Hospital", city: "Mumbai", state: "Maharashtra", lat: 19.0436, lng: 72.8943 },
  { name: "Manipal Hospital", city: "Jaipur", state: "Rajasthan", lat: 26.9048, lng: 75.7621 },
  { name: "Jupiter Hospital", city: "Thane", state: "Maharashtra", lat: 19.2066, lng: 72.9722 },
  { name: "Saifee Hospital", city: "Mumbai", state: "Maharashtra", lat: 18.9535, lng: 72.8166 },
  { name: "Sahyadri Super Specialty Hospital, Karve Road", city: "Pune", state: "Maharashtra", lat: 18.5042, lng: 73.8309 },
  { name: "Wockhardt Hospital, Mumbai Central", city: "Mumbai", state: "Maharashtra", lat: 18.9727, lng: 72.8214 },
  { name: "Jupiter Lifeline Hospital", city: "Pune", state: "Maharashtra", lat: 18.5583, lng: 73.7915 },
  { name: "SL Raheja Hospital", city: "Mumbai", state: "Maharashtra", lat: 19.0505, lng: 72.8426 },
  { name: "Dr. LH Hiranandani Hospital", city: "Mumbai", state: "Maharashtra", lat: 19.1197, lng: 72.9094 },
  { name: "Aditya Birla Memorial Hospital", city: "Pune", state: "Maharashtra", lat: 18.6255, lng: 73.7788 },
  { name: "Fortis Escorts Hospital", city: "Jaipur", state: "Rajasthan", lat: 26.8523, lng: 75.8049 },
  { name: "MGM New Bombay Hospital", city: "Navi Mumbai", state: "Maharashtra", lat: 19.0716, lng: 72.9984 },
  { name: "Mumbai Port Trust Hospital", city: "Mumbai", state: "Maharashtra", lat: 19.0185, lng: 72.8595 },
  { name: "Sahyadri Super Speciality Hospital", city: "Pune", state: "Maharashtra", lat: 18.5085, lng: 73.8345 },
  { name: "Rukmani Birla Hospital", city: "Jaipur", state: "Rajasthan", lat: 26.8665, lng: 75.7925 },
  { name: "Apex Hospital", city: "Jaipur", state: "Rajasthan", lat: 26.8525, lng: 75.8235 },
  { name: "Eternal Heart Care Centre and Research Institute", city: "Jaipur", state: "Rajasthan", lat: 26.8536, lng: 75.8055 },
  { name: "Manipal Hospitals, Baner", city: "Pune", state: "Maharashtra", lat: 18.5621, lng: 73.7745 },
  { name: "Bethany Hospital", city: "Thane", state: "Maharashtra", lat: 19.2275, lng: 72.9735 },
  { name: "Kamalnayan Bajaj Hospital", city: "Aurangabad", state: "Maharashtra", lat: 19.8652, lng: 75.3125 },
  { name: "Saideep Healthcare and Research", city: "Ahmednagar", state: "Maharashtra", lat: 19.0965, lng: 74.7425 },
  { name: "Mahavir Jaipuriya Rajasthan Hospital", city: "Jaipur", state: "Rajasthan", lat: 26.8795, lng: 75.8085 },
  { name: "VishwaRaj Hospital", city: "Pune", state: "Maharashtra", lat: 18.4905, lng: 74.0152 },
  { name: "United Ciigma Institute of Medical Sciences", city: "Aurangabad", state: "Maharashtra", lat: 19.8785, lng: 75.3345 },
  { name: "Central Hospital, NW Railway", city: "Jaipur", state: "Rajasthan", lat: 26.9205, lng: 75.7915 },
  { name: "New Thergaon Hospital", city: "Thergaon, Pune", state: "Maharashtra", lat: 18.6186, lng: 73.7744 },
  { name: "Asian Institute of Medical Sciences", city: "Dombivli", state: "Maharashtra", lat: 19.2155, lng: 73.0825 },
  { name: "Criticare Asia Multispeciality Hospital And Research Centre", city: "Kurla, Mumbai", state: "Maharashtra", lat: 19.0685, lng: 72.8795 },
  { name: "Sushrut Hospital And Research Centre", city: "Mumbai", state: "Maharashtra", lat: 19.0605, lng: 72.8985 },
  { name: "Paras Hospital", city: "Udaipur", state: "Rajasthan", lat: 24.5825, lng: 73.7315 },
  { name: "Kingsway Hospitals", city: "Nagpur", state: "Maharashtra", lat: 21.1565, lng: 79.0885 },
  { name: "Cardinal Gracias Memorial Hospital Trust", city: "Thane", state: "Maharashtra", lat: 19.3395, lng: 72.8125 },
  { name: "Ushahkal Abhinav Institute of Medical Sciences", city: "Sangli", state: "Maharashtra", lat: 16.8555, lng: 74.5885 },
  { name: "Alexis Multispecialty Hospital", city: "Nagpur", state: "Maharashtra", lat: 21.1895, lng: 79.0785 },
  { name: "Apple Saraswati Multispecialty Hospital", city: "Kolhapur", state: "Maharashtra", lat: 16.7115, lng: 74.2465 },
  { name: "Goyal Hospital and Research Center Pvt Ltd", city: "Jodhpur", state: "Rajasthan", lat: 26.2695, lng: 73.0155 },
  { name: "Ashwani Sahakari Rugnalaya", city: "Solapur", state: "Maharashtra", lat: 17.6625, lng: 75.9125 },
  { name: "Shree Markendey Solapur Sahakari Rugnalya and Research Centre", city: "Solapur", state: "Maharashtra", lat: 17.6585, lng: 75.9045 },
  { name: "Sevasadan Lifeline Superspeciality Hospital", city: "Miraj", state: "Maharashtra", lat: 16.8315, lng: 74.6485 },
  { name: "CKS Hospital", city: "Jaipur", state: "Rajasthan", lat: 26.9725, lng: 75.7685 },
  { name: "Shree Narayani Healthcare", city: "Nashik", state: "Maharashtra", lat: 19.9925, lng: 73.7855 },
  { name: "Parkar Hospital and Research Institute", city: "Ratnagiri", state: "Maharashtra", lat: 16.9925, lng: 73.3145 },
  { name: "Asha Hospital", city: "Kamptee, Nagpur", state: "Maharashtra", lat: 21.2255, lng: 79.1985 },
  { name: "Kothari Medical and Research Institute", city: "Bikaner", state: "Rajasthan", lat: 28.0245, lng: 73.3155 },
  { name: "Alliance Multispeciality Hospital", city: "Ichalkaranji", state: "Maharashtra", lat: 16.6955, lng: 74.4635 },
  { name: "RP Hospital and Research Institute", city: "Parbhani", state: "Maharashtra", lat: 19.2635, lng: 76.7795 },
  { name: "Medicare Multispeciality Hospital", city: "Yavatmal", state: "Maharashtra", lat: 20.3915, lng: 78.1235 },
  { name: "Gheesibai Memorial Mittal Hospital and Research Centre", city: "Ajmer", state: "Rajasthan", lat: 26.4525, lng: 74.6425 },
  { name: "Sudha Medical College And Hospital", city: "Kota", state: "Rajasthan", lat: 25.2155, lng: 75.8675 },
  { name: "Zen Multispeciality Hospital", city: "Mumbai", state: "Maharashtra", lat: 19.0525, lng: 72.8985 },
  { name: "Mahalaxmi Hrudayalay", city: "Kolhapur", state: "Maharashtra", lat: 16.7025, lng: 74.2385 },
  { name: "Harish Hospital, Telco Circle", city: "Alwar", state: "Rajasthan", lat: 27.5555, lng: 76.6375 }
];

// ──────────────────────────────────────────────────
// CONSTANTS & CONFIG
// ──────────────────────────────────────────────────
const NOMINATIM_URL   = 'https://nominatim.openstreetmap.org/search';
const OSRM_BASE       = 'https://router.project-osrm.org/route/v1';
const LS_KEY_COLLEGES = 'medroute_colleges';
const LS_KEY_HOMES    = 'medroute_homes';
const LS_KEY_ACTIVE   = 'medroute_active_home';
const GEOCODE_DELAY   = 1100; // Nominatim rate limit: 1 req/s

// Default home location (Kaziwad, Bhavnagar) requested by user
const DEFAULT_HOME = {
  id: 'home_kaziwad_bhavnagar',
  name: 'kaziwad bhavnagar',
  address: 'Kaziwad, Bhavnagar, Gujarat 364001, India',
  lat: 21.780502120571906,
  lng: 72.14943519040729,
};

// ──────────────────────────────────────────────────
// VERIFIED HOSPITAL & MEDICAL CAMPUS IMAGERY
// ──────────────────────────────────────────────────
const COLLEGE_IMAGES = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
];

const DEFAULT_FALLBACK_IMG = COLLEGE_IMAGES[0];

function getCollegeImage(college) {
  if (!college) return DEFAULT_FALLBACK_IMG;
  if (college.imageUrl && college.imageUrl.trim()) {
    return college.imageUrl.trim();
  }
  // Deterministic hash based on hospital name and city
  const key = (college.name || '') + (college.city || '');
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % COLLEGE_IMAGES.length;
  return COLLEGE_IMAGES[index];
}

// ──────────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────────
let state = {
  colleges:           [],   // [{ id, name, address, city, phone, website, lat, lng }]
  homeLocations:      [],   // [{ id, name, address, lat, lng }]
  activeHomeId:       null, // id of selected home location
  distances:          {},   // { [collegeId + '_' + homeId]: { driveDist, driveTime, walkTime } }
  map:                null,
  markers:            {},   // leaflet markers keyed by college id
  homeMarker:         null,
  polylines:          {},   // { [collegeId]: { line, college, dist } }
  lineFilter:         'all', // 'all' | 'nearest10' | 'nearest25' | 'none'
  showLabels:         true,
  selectedCollegeId:  null,
  parsedImport:       [],   // pending import items
};

// ──────────────────────────────────────────────────
// PERSISTENCE
// ──────────────────────────────────────────────────
function saveState() {
  localStorage.setItem(LS_KEY_COLLEGES, JSON.stringify(state.colleges));
  localStorage.setItem(LS_KEY_HOMES,    JSON.stringify(state.homeLocations));
  if (state.activeHomeId) {
    localStorage.setItem(LS_KEY_ACTIVE, state.activeHomeId);
  }
}

function loadState() {
  try {
    const colleges = localStorage.getItem(LS_KEY_COLLEGES);
    const homes    = localStorage.getItem(LS_KEY_HOMES);
    const active   = localStorage.getItem(LS_KEY_ACTIVE);
    if (colleges) state.colleges      = JSON.parse(colleges);
    if (homes)    state.homeLocations = JSON.parse(homes);
    if (active)   state.activeHomeId  = active;
  } catch (e) { console.warn('Failed to load state', e); }

  // Guarantee default home location (Kaziwad Bhavnagar) exists
  if (!Array.isArray(state.homeLocations) || state.homeLocations.length === 0) {
    state.homeLocations = [DEFAULT_HOME];
    state.activeHomeId = DEFAULT_HOME.id;
  } else if (!state.homeLocations.some(h => h.name && h.name.toLowerCase().includes('kaziwad'))) {
    state.homeLocations.unshift(DEFAULT_HOME);
    if (!state.activeHomeId) state.activeHomeId = DEFAULT_HOME.id;
  }

  // Ensure activeHomeId is valid
  if (!state.activeHomeId || !state.homeLocations.some(h => h.id === state.activeHomeId)) {
    const kaziwad = state.homeLocations.find(h => h.name && h.name.toLowerCase().includes('kaziwad'));
    state.activeHomeId = kaziwad ? kaziwad.id : (state.homeLocations[0]?.id || DEFAULT_HOME.id);
  }

  // Ensure colleges list is never empty; auto-seed PDF hospitals
  if (!Array.isArray(state.colleges) || state.colleges.length < 50) {
    loadPDFHospitals();
  } else {
    // Ensure all known colleges have coordinates filled in
    state.colleges.forEach(c => {
      if (!c.lat || !c.lng) {
        const match = PDF_HOSPITALS.find(p => p.name.toLowerCase() === c.name.toLowerCase());
        if (match && match.lat && match.lng) {
          c.lat = match.lat;
          c.lng = match.lng;
        }
      }
    });
  }
}

// ──────────────────────────────────────────────────
// UTILITY & DISTANCE FORMULAS
// ──────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Great-circle Haversine formula (returns distance in km)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(meters) {
  if (!meters && meters !== 0) return '—';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m === 0) return `< 1 min`;
  return `${m} min`;
}

function getDistKey(collegeId, homeId) {
  return `${collegeId}_${homeId}`;
}

function getActiveHome() {
  return state.homeLocations.find(h => h.id === state.activeHomeId) || null;
}

// Returns distance info (drive if available, direct straight-line as fallback)
function getCollegeDistance(college, home) {
  if (!college.lat || !college.lng || !home || !home.lat || !home.lng) return null;
  const key = getDistKey(college.id, home.id);
  const cached = state.distances[key];
  const directKm = Math.round(haversineDistance(home.lat, home.lng, college.lat, college.lng));

  if (cached && cached.driveDist != null) {
    return {
      km: Math.round(cached.driveDist / 1000),
      exactKm: (cached.driveDist / 1000).toFixed(1),
      isDrive: true,
      duration: cached.driveTime,
      driveText: formatDuration(cached.driveTime),
      walkText: cached.walkTime != null ? formatDuration(cached.walkTime) : null,
      directKm,
    };
  }

  return {
    km: directKm,
    exactKm: directKm.toString(),
    isDrive: false,
    duration: null,
    driveText: null,
    walkText: null,
    directKm,
  };
}

// ──────────────────────────────────────────────────
// GEOCODING (Nominatim)
// ──────────────────────────────────────────────────
async function geocodeAddress(address) {
  const url = `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  if (!data.length) throw new Error('Address not found');
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

// ──────────────────────────────────────────────────
// ROUTING (OSRM)
// ──────────────────────────────────────────────────
async function getRoute(fromLat, fromLng, toLat, toLng, profile = 'driving') {
  const url = `${OSRM_BASE}/${profile}/${fromLng},${fromLat};${toLng},${toLat}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Route fetch failed: ${res.status}`);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes.length) throw new Error('No route found');
  const route = data.routes[0];
  return { distance: route.distance, duration: route.duration };
}

async function calculateDistances(college, home) {
  const key = getDistKey(college.id, home.id);
  if (!college.lat || !college.lng) throw new Error('College not geocoded');
  if (!home.lat || !home.lng) throw new Error('Home not geocoded');

  const [drive, walk] = await Promise.allSettled([
    getRoute(home.lat, home.lng, college.lat, college.lng, 'driving'),
    getRoute(home.lat, home.lng, college.lat, college.lng, 'walking'),
  ]);

  const dist = {
    driveDist:  drive.status === 'fulfilled' ? drive.value.distance  : null,
    driveTime:  drive.status === 'fulfilled' ? drive.value.duration  : null,
    walkTime:   walk.status  === 'fulfilled' ? walk.value.duration   : null,
    error:      drive.status !== 'fulfilled' ? drive.reason?.message : null,
  };
  state.distances[key] = dist;
  return dist;
}

// ──────────────────────────────────────────────────
// MAP & MARKERS
// ──────────────────────────────────────────────────
function initMap() {
  if (state.map) return;
  state.map = L.map('map', { zoomControl: true, preferCanvas: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(state.map);
  state.map.setView([21.78, 73.5], 6);
}

function createCollegeIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:26px;height:26px;
      background:linear-gradient(135deg,#0d9488,#6366f1);
      border:2px solid rgba(255,255,255,0.7);
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 10px rgba(20,184,166,0.6);
    "></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
  });
}

function createHomeIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      border:2.5px solid #ffffff;
      border-radius:50%;
      box-shadow:0 0 16px rgba(99,102,241,0.8);
      display:flex;align-items:center;justify-content:center;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function addCollegeMarker(college) {
  if (!state.map || !college.lat || !college.lng) return;
  if (state.markers[college.id]) {
    state.map.removeLayer(state.markers[college.id]);
  }
  const home = getActiveHome();
  const dist = home ? getCollegeDistance(college, home) : null;
  const distInfo = dist ? `<div class="popup-dist-badge">📏 ${dist.km} km from ${escHtml(home.name)}</div>` : '';
  const imgUrl = getCollegeImage(college);
  const routeUrl = home?.lat && college?.lat
    ? `https://www.google.com/maps/dir/${home.lat},${home.lng}/${college.lat},${college.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(college.name + ' ' + (college.city || college.address))}`;

  const popupHtml = `
    <div class="map-popup-card">
      <div class="popup-img-wrap" onclick="openCollegeDetailModal('${college.id}')" title="Click to view full photos &amp; details">
        <img src="${imgUrl}" class="popup-thumb" alt="${escHtml(college.name)}" onerror="this.src='${DEFAULT_FALLBACK_IMG}'" />
        <span class="popup-photo-badge">📸 Photos</span>
      </div>
      <div class="popup-body">
        <div class="popup-title" onclick="openCollegeDetailModal('${college.id}')" style="cursor:pointer;" title="View college photos">${escHtml(college.name)}</div>
        <div class="popup-sub">${escHtml(college.city || college.address)}</div>
        ${distInfo}
        <div class="popup-btns">
          <button class="popup-btn-detail" onclick="openCollegeDetailModal('${college.id}')">📸 Photos &amp; Details</button>
          <button class="popup-btn-dir" onclick="window.open('${routeUrl}','_blank')">🚗 Route</button>
        </div>
      </div>
    </div>
  `;

  const marker = L.marker([college.lat, college.lng], { icon: createCollegeIcon() })
    .bindPopup(popupHtml, { maxWidth: 260 })
    .addTo(state.map);
  
  marker.on('click', () => {
    highlightPolyline(college.id, true);
    highlightCard(college.id);
  });

  state.markers[college.id] = marker;
}

function updateHomeMarker(home) {
  if (!state.map || !home?.lat || !home?.lng) return;
  if (state.homeMarker) state.map.removeLayer(state.homeMarker);
  state.homeMarker = L.marker([home.lat, home.lng], { icon: createHomeIcon() })
    .bindPopup(`<strong>📍 Home: ${escHtml(home.name)}</strong><br/><span style="font-size:0.78rem;color:#94a3b8">${escHtml(home.address)}</span>`)
    .addTo(state.map);
}

// ──────────────────────────────────────────────────
// DISTANCE LINES FROM HOME TO LOCATIONS
// ──────────────────────────────────────────────────
function clearDistanceLines() {
  if (!state.map) return;
  Object.values(state.polylines).forEach(item => {
    if (item.line) state.map.removeLayer(item.line);
  });
  state.polylines = {};
}

function drawDistanceLines() {
  if (!state.map) return;
  clearDistanceLines();

  const home = getActiveHome();
  if (!home || !home.lat || !home.lng) return;
  if (state.lineFilter === 'none') {
    const badge = document.getElementById('mapLineCountBadge');
    if (badge) badge.textContent = 'Lines Hidden';
    return;
  }

  // Get colleges with valid coordinates
  let items = state.colleges
    .filter(c => c.lat && c.lng)
    .map(c => ({
      college: c,
      dist: getCollegeDistance(c, home)
    }))
    .filter(item => item.dist !== null);

  // Sort by distance (nearest first)
  items.sort((a, b) => a.dist.km - b.dist.km);

  const totalCount = items.length;

  if (state.lineFilter === 'nearest10') {
    items = items.slice(0, 10);
  } else if (state.lineFilter === 'nearest25') {
    items = items.slice(0, 25);
  }

  // Update badge in map header
  const badge = document.getElementById('mapLineCountBadge');
  if (badge) {
    badge.textContent = `${items.length} Lines (${items.length === totalCount ? 'All' : 'Top ' + items.length})`;
  }

  items.forEach(({ college, dist }) => {
    const latlngs = [
      [home.lat, home.lng],
      [college.lat, college.lng]
    ];

    const polyline = L.polyline(latlngs, {
      color: '#06b6d4',
      weight: 2.2,
      opacity: 0.68,
      dashArray: '5, 5',
      className: 'dist-polyline',
    }).addTo(state.map);

    // Distance label badge in km
    const labelText = `${dist.km} km`;
    if (state.showLabels) {
      polyline.bindTooltip(
        `<span class="dist-badge-content">${labelText}</span>`,
        {
          permanent: true,
          direction: 'center',
          className: 'dist-polyline-label',
          interactive: true,
        }
      );
    }

    const routeUrl = `https://www.google.com/maps/dir/${home.lat},${home.lng}/${college.lat},${college.lng}`;
    const descText = dist.isDrive
      ? `🚗 <b>${dist.exactKm} km drive</b> (${dist.driveText})<br/><span style="color:#94a3b8;font-size:0.75rem;">📏 ${dist.directKm} km direct</span>`
      : `📏 <b>${dist.km} km direct distance</b>`;

    const imgUrl = getCollegeImage(college);
    const popupHtml = `
      <div class="map-popup-card">
        <div class="popup-img-wrap" onclick="openCollegeDetailModal('${college.id}')" title="Click to view full photos &amp; details">
          <img src="${imgUrl}" class="popup-thumb" alt="${escHtml(college.name)}" onerror="this.src='${DEFAULT_FALLBACK_IMG}'" />
          <span class="popup-photo-badge">📸 View Campus</span>
        </div>
        <div class="popup-body">
          <div class="popup-title" onclick="openCollegeDetailModal('${college.id}')" style="cursor:pointer;" title="View college photos">${escHtml(college.name)}</div>
          <div class="popup-sub">📍 ${escHtml(college.city || college.address)}</div>
          <div class="popup-dist-badge">${descText}</div>
          <div class="popup-btns">
            <button class="popup-btn-detail" onclick="openCollegeDetailModal('${college.id}')">📸 Photos &amp; Details</button>
            <a href="${routeUrl}" target="_blank" class="popup-btn-dir" style="text-decoration:none;display:inline-flex;align-items:center;">Route ↗</a>
          </div>
        </div>
      </div>
    `;
    polyline.bindPopup(popupHtml, { maxWidth: 260 });

    // Hover & Click interactions
    polyline.on('mouseover', () => highlightPolyline(college.id, true));
    polyline.on('mouseout', () => {
      if (state.selectedCollegeId !== college.id) {
        highlightPolyline(college.id, false);
      }
    });
    polyline.on('click', () => {
      highlightCard(college.id);
      focusCollegeOnMap(college.id);
    });

    state.polylines[college.id] = {
      line: polyline,
      college,
      dist,
    };
  });
}

function highlightPolyline(collegeId, active) {
  const item = state.polylines[collegeId];
  if (!item || !item.line) return;
  if (active) {
    item.line.setStyle({
      color: '#f43f5e', // glowing rose/pink
      weight: 4.5,
      opacity: 1.0,
      dashArray: null,
    });
    item.line.bringToFront();
    if (state.markers[collegeId]) {
      state.markers[collegeId].setZIndexOffset(1000);
    }
  } else {
    item.line.setStyle({
      color: '#06b6d4',
      weight: 2.2,
      opacity: 0.68,
      dashArray: '5, 5',
    });
    if (state.markers[collegeId]) {
      state.markers[collegeId].setZIndexOffset(0);
    }
  }
}

function highlightCard(collegeId) {
  const card = document.getElementById(`card-${collegeId}`);
  if (card) {
    document.querySelectorAll('.college-card.card-highlight').forEach(el => el.classList.remove('card-highlight'));
    card.classList.add('card-highlight');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function focusCollegeOnMap(collegeId) {
  state.selectedCollegeId = collegeId;
  // Automatically switch to map view on mobile/tablet
  if (window.innerWidth <= 960) {
    setMobileView('map');
  }
  const college = state.colleges.find(c => c.id === collegeId);
  const home = getActiveHome();
  if (!college || !home || !college.lat) return;

  const mapPanel = document.getElementById('mapPanel');
  if (mapPanel && mapPanel.classList.contains('collapsed')) {
    mapPanel.classList.remove('collapsed');
    state.map?.invalidateSize();
  }

  // Ensure line is drawn
  if (!state.polylines[collegeId]) {
    state.lineFilter = 'all';
    const select = document.getElementById('lineFilterSelect');
    if (select) select.value = 'all';
    drawDistanceLines();
  }

  highlightPolyline(collegeId, true);
  const item = state.polylines[collegeId];
  if (item && item.line) {
    item.line.openPopup();
    const bounds = L.latLngBounds([
      [home.lat, home.lng],
      [college.lat, college.lng]
    ]);
    state.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }
}

function fitMapToAll() {
  if (!state.map) return;
  const bounds = [];
  const home = getActiveHome();
  if (home?.lat) bounds.push([home.lat, home.lng]);
  state.colleges.forEach(c => { if (c.lat && c.lng) bounds.push([c.lat, c.lng]); });
  if (bounds.length > 0) {
    state.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }
}

// ──────────────────────────────────────────────────
// RENDER
// ──────────────────────────────────────────────────
function renderHomeLocations() {
  const list = document.getElementById('homeLocationsList');
  list.innerHTML = '';

  if (state.homeLocations.length === 0) {
    list.innerHTML = `<div style="padding:10px 20px;font-size:0.78rem;color:var(--text-muted)">No locations added</div>`;
    return;
  }

  state.homeLocations.forEach(h => {
    const item = document.createElement('div');
    item.className = 'location-item' + (h.id === state.activeHomeId ? ' active' : '');
    item.dataset.id = h.id;
    item.innerHTML = `
      <div class="loc-dot"></div>
      <div class="loc-info">
        <div class="loc-name">${escHtml(h.name)}</div>
        <div class="loc-addr">${escHtml(h.address)}</div>
      </div>
      <button class="loc-delete" title="Delete location" data-id="${h.id}" onclick="deleteHomeLocation(event, '${h.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    item.addEventListener('click', (e) => {
      if (e.target.closest('.loc-delete')) return;
      selectHomeLocation(h.id);
    });
    list.appendChild(item);
  });
}

function renderStats() {
  document.getElementById('statColleges').textContent  = state.colleges.length;
  document.getElementById('statLocations').textContent = state.homeLocations.length;

  const home = getActiveHome();
  if (!home) { document.getElementById('statNearest').textContent = '—'; return; }

  let nearest = Infinity;
  state.colleges.forEach(c => {
    const d = getCollegeDistance(c, home);
    if (d && d.km < nearest) {
      nearest = d.km;
    }
  });
  document.getElementById('statNearest').textContent =
    nearest === Infinity ? '—' : `${nearest} km`;
}

function renderColleges(filter = '') {
  const grid       = document.getElementById('collegesGrid');
  const emptyState = document.getElementById('emptyState');
  const home       = getActiveHome();
  const sort       = document.getElementById('sortSelect').value;

  let colleges = [...state.colleges];

  // Filter
  if (filter) {
    const q = filter.toLowerCase();
    colleges = colleges.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.city    || '').toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'distance' && home) {
    colleges.sort((a, b) => {
      const distA = getCollegeDistance(a, home);
      const distB = getCollegeDistance(b, home);
      const valA = distA ? distA.km : Infinity;
      const valB = distB ? distB.km : Infinity;
      return valA - valB;
    });
  } else if (sort === 'time' && home) {
    colleges.sort((a, b) => {
      const tA = state.distances[getDistKey(a.id, home.id)]?.driveTime ?? Infinity;
      const tB = state.distances[getDistKey(b.id, home.id)]?.driveTime ?? Infinity;
      return tA - tB;
    });
  } else if (sort === 'name') {
    colleges.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Clear existing cards (keep emptyState node)
  Array.from(grid.children).forEach(child => {
    if (child !== emptyState) child.remove();
  });

  if (colleges.length === 0) {
    emptyState.style.display = 'flex';
    return;
  }
  emptyState.style.display = 'none';

  colleges.forEach((college, i) => {
    const card = buildCollegeCard(college, home);
    card.style.animationDelay = `${i * 35}ms`;
    grid.appendChild(card);
  });

  renderStats();
  const mobileCount = document.getElementById('mobileCountColleges');
  if (mobileCount) mobileCount.textContent = colleges.length;
}

function buildCollegeCard(college, home) {
  const card = document.createElement('div');
  card.className = 'college-card card-enter';
  card.id = `card-${college.id}`;

  const distHtml = buildDistanceHtml(college, home);
  const collegeImg = getCollegeImage(college);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(college.name + ' ' + (college.city || college.address))}`;
  const routeUrl = home?.lat && college?.lat
    ? `https://www.google.com/maps/dir/${home.lat},${home.lng}/${college.lat},${college.lng}`
    : '';

  card.innerHTML = `
    <div class="card-top" onclick="openCollegeDetailModal('${college.id}')" title="Click to view campus photos &amp; details">
      <div class="card-photo-thumb" title="Campus Photo — Click to enlarge">
        <img src="${collegeImg}" alt="${escHtml(college.name)}" loading="lazy" onerror="this.src='${DEFAULT_FALLBACK_IMG}'" />
        <span class="thumb-photo-icon">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </span>
      </div>
      <div class="card-info">
        <div class="card-name" title="Click to view photos &amp; details">${escHtml(college.name)}</div>
        <div class="card-city">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escHtml(college.city || college.address || '—')}
        </div>
      </div>
      <button class="card-delete" title="Remove college" onclick="event.stopPropagation(); deleteCollege('${college.id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="distance-section" id="dist-${college.id}" onclick="openCollegeDetailModal('${college.id}')" style="cursor:pointer;" title="Click to view distance breakdown">
      ${distHtml}
    </div>

    <div class="card-actions">
      <button class="btn-card-action btn-card-photo" title="View Campus Photos &amp; Details" onclick="event.stopPropagation(); openCollegeDetailModal('${college.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        Photos
      </button>
      <button class="btn-card-action btn-card-viewmap" title="Focus distance line on map" onclick="event.stopPropagation(); focusCollegeOnMap('${college.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
        Line
      </button>
      <button class="btn-card-action btn-card-maps" onclick="event.stopPropagation(); window.open('${mapsUrl}','_blank')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
        Maps
      </button>
      ${routeUrl ? `<button class="btn-card-action btn-card-route" onclick="event.stopPropagation(); window.open('${routeUrl}','_blank')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        Directions
      </button>` : ''}
      <button class="btn-card-action btn-card-refresh" title="Recalculate road distance" onclick="event.stopPropagation(); recalcCollege('${college.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      </button>
    </div>
  `;

  // Hover highlighting
  card.addEventListener('mouseenter', () => highlightPolyline(college.id, true));
  card.addEventListener('mouseleave', () => {
    if (state.selectedCollegeId !== college.id) {
      highlightPolyline(college.id, false);
    }
  });

  return card;
}

function buildDistanceHtml(college, home) {
  if (!home) {
    return `<div class="distance-error">⬅ Select a home location to see distances</div>`;
  }
  if (!college.lat || !college.lng) {
    return `<div class="distance-error">⚠ Geocoding pending…</div>`;
  }

  const dist = getCollegeDistance(college, home);
  if (!dist) {
    return `<div class="distance-loading"><div class="status-spinner"></div> Calculating…</div>`;
  }

  // If driving route is available
  if (dist.isDrive) {
    return `
      <div class="distance-pill" title="Road driving distance">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${dist.exactKm} km drive
        <span style="font-size:0.73rem;opacity:0.75;margin-left:4px;">(${dist.directKm} km direct)</span>
      </div>
      <div class="travel-times">
        <div class="travel-time-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <span class="time-val">${dist.driveText}</span> drive
        </div>
        ${dist.walkText ? `
        <div class="travel-time-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><path d="M9 20l3-8 2 5 2-3h2"/><path d="M8 11l1-4 2.5 2.5"/></svg>
          <span class="time-val">${dist.walkText}</span> walk
        </div>` : ''}
      </div>
    `;
  }

  // Fallback / Initial direct straight-line distance
  return `
    <div class="distance-pill" title="Straight-line distance (road route calculating…)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      ${dist.km} km direct
    </div>
    <div class="travel-times">
      <div class="travel-time-item" style="color:var(--text-muted);font-size:0.73rem;">
        <span>Calculating driving route…</span>
      </div>
    </div>
  `;
}

function updateCardDistance(collegeId) {
  const el   = document.getElementById(`dist-${collegeId}`);
  const col  = state.colleges.find(c => c.id === collegeId);
  const home = getActiveHome();
  if (el && col) {
    el.innerHTML = buildDistanceHtml(col, home);
  }
}

// ──────────────────────────────────────────────────
// ACTIONS — HOME LOCATIONS
// ──────────────────────────────────────────────────
function selectHomeLocation(id) {
  state.activeHomeId = id;
  saveState();
  const home = getActiveHome();
  document.getElementById('activeLocationName').textContent = home ? home.name : 'Select a location';
  renderHomeLocations();
  updateHomeMarker(home);
  drawDistanceLines();
  renderColleges(document.getElementById('searchInput').value);
  fitMapToAll();
  closeMobileSidebar();
  recalcAllDistances();
}

async function saveHomeLocation() {
  const name    = document.getElementById('homeLocName').value.trim();
  const address = document.getElementById('homeLocAddress').value.trim();
  const latVal  = document.getElementById('homeLocLat').value;
  const lngVal  = document.getElementById('homeLocLng').value;

  if (!name || !address) { showToast('Please fill in name and address', 'error'); return; }

  setBtnLoading('btnSaveHomeLocation', true);

  try {
    let lat, lng;
    if (latVal && lngVal) {
      lat = parseFloat(latVal); lng = parseFloat(lngVal);
    } else {
      showStatusBar('Geocoding home address…');
      const geo = await geocodeAddress(address);
      lat = geo.lat; lng = geo.lng;
      hideStatusBar();
    }

    const home = { id: uid(), name, address, lat, lng };
    state.homeLocations.push(home);
    saveState();
    renderHomeLocations();
    selectHomeLocation(home.id);
    closeModal('modalHomeLocation');
    clearForm(['homeLocName','homeLocAddress','homeLocLat','homeLocLng']);
    showToast(`Location "${name}" added!`, 'success');
    fitMapToAll();
  } catch (e) {
    showToast(`Error: ${e.message}`, 'error');
  } finally {
    setBtnLoading('btnSaveHomeLocation', false);
    hideStatusBar();
  }
}

function deleteHomeLocation(e, id) {
  e.stopPropagation();
  state.homeLocations = state.homeLocations.filter(h => h.id !== id);
  if (state.activeHomeId === id) {
    state.activeHomeId = state.homeLocations[0]?.id || null;
    const home = getActiveHome();
    document.getElementById('activeLocationName').textContent = home ? home.name : 'Select a home location';
    if (home) {
      updateHomeMarker(home);
      drawDistanceLines();
      recalcAllDistances();
    } else if (state.homeMarker) {
      state.map?.removeLayer(state.homeMarker);
      state.homeMarker = null;
      clearDistanceLines();
    }
  }
  saveState();
  renderHomeLocations();
  renderStats();
  showToast('Location removed', 'info');
}

// ──────────────────────────────────────────────────
// ACTIONS — COLLEGES
// ──────────────────────────────────────────────────
async function saveCollege() {
  const name     = document.getElementById('collegeName').value.trim();
  const address  = document.getElementById('collegeAddress').value.trim();
  const city     = document.getElementById('collegeCity').value.trim();
  const phone    = document.getElementById('collegePhone').value.trim();
  const website  = document.getElementById('collegeWebsite').value.trim();
  const imageUrl = document.getElementById('collegeImageUrl')?.value.trim() || '';

  if (!name || !address) { showToast('College name and address are required', 'error'); return; }

  setBtnLoading('btnSaveCollege', true);
  showStatusBar(`Geocoding ${name}…`);

  try {
    const geo = await geocodeAddress(city ? `${address}, ${city}` : address);
    const college = { id: uid(), name, address, city, phone, website, imageUrl, lat: geo.lat, lng: geo.lng };
    state.colleges.push(college);
    saveState();
    addCollegeMarker(college);
    renderColleges(document.getElementById('searchInput').value);
    closeModal('modalAddCollege');
    clearForm(['collegeName','collegeAddress','collegeCity','collegePhone','collegeWebsite','collegeImageUrl']);
    showToast(`"${name}" added!`, 'success');

    const home = getActiveHome();
    if (home) {
      drawDistanceLines();
      hideStatusBar();
      showStatusBar(`Calculating distance to ${name}…`);
      await calcCollegeDist(college, home);
      updateCardDistance(college.id);
      drawDistanceLines();
      renderStats();
    }
    fitMapToAll();
  } catch (e) {
    showToast(`Error: ${e.message}`, 'error');
  } finally {
    setBtnLoading('btnSaveCollege', false);
    hideStatusBar();
  }
}

async function calcCollegeDist(college, home) {
  try {
    await calculateDistances(college, home);
  } catch (e) {
    const key = getDistKey(college.id, home.id);
    state.distances[key] = { error: e.message, driveDist: null, driveTime: null, walkTime: null };
  }
}

async function recalcAllDistances() {
  const home = getActiveHome();
  if (!home) { renderColleges(document.getElementById('searchInput').value); return; }

  renderColleges(document.getElementById('searchInput').value);
  drawDistanceLines();

  // Split into: needs geocoding, needs distance only
  const needsGeocode = state.colleges.filter(c => !c.lat || !c.lng);
  const needsDist    = state.colleges.filter(c => {
    const key = getDistKey(c.id, home.id);
    return c.lat && c.lng && !state.distances[key];
  });

  const totalWork = needsGeocode.length + needsDist.length;
  if (totalWork === 0) { renderStats(); return; }

  let step = 0;
  showStatusBar(`Calculating road routes (${totalWork})…`);

  // PHASE 1: Geocode any custom hospitals without coordinates
  for (let i = 0; i < needsGeocode.length; i++) {
    const c = needsGeocode[i];
    step++;
    updateStatusBar(`[${step}/${totalWork}] Locating: ${c.name}…`);
    try {
      const geo = await geocodeAddress(`${c.name}, ${c.city}, India`);
      c.lat = geo.lat; c.lng = geo.lng;
      addCollegeMarker(c);
      saveState();
    } catch {
      try {
        const geo2 = await geocodeAddress(`${c.city}, India`);
        c.lat = geo2.lat; c.lng = geo2.lng;
        addCollegeMarker(c);
        saveState();
      } catch { c.lat = null; c.lng = null; }
    }
    if (c.lat && c.lng) {
      await calcCollegeDist(c, home);
    } else {
      const key = getDistKey(c.id, home.id);
      state.distances[key] = { error: 'Location not found', driveDist: null, driveTime: null, walkTime: null };
    }
    updateCardDistance(c.id);
    renderStats();
    await sleep(GEOCODE_DELAY);
  }

  // PHASE 2: Calc driving distance for colleges with coordinates
  for (let i = 0; i < needsDist.length; i++) {
    const c = needsDist[i];
    step++;
    updateStatusBar(`[${step}/${totalWork}] Road route: ${c.name}…`);
    await calcCollegeDist(c, home);
    updateCardDistance(c.id);
    renderStats();
    if (i % 3 === 0 || i === needsDist.length - 1) {
      drawDistanceLines();
    }
    if (i < needsDist.length - 1) await sleep(600);
  }

  hideStatusBar();
  renderColleges(document.getElementById('searchInput').value);
  renderStats();
  drawDistanceLines();
  showToast(`All ${totalWork} route distances updated!`, 'success');
}

async function recalcCollege(id) {
  const college = state.colleges.find(c => c.id === id);
  const home    = getActiveHome();
  if (!college || !home) { showToast('Select a home location first', 'error'); return; }

  delete state.distances[getDistKey(id, home.id)];
  updateCardDistance(id);
  showStatusBar(`Recalculating distance to ${college.name}…`);

  await calcCollegeDist(college, home);
  updateCardDistance(id);
  drawDistanceLines();
  renderStats();
  hideStatusBar();
  showToast('Distance updated', 'success');
}

function deleteCollege(id) {
  const col = state.colleges.find(c => c.id === id);
  state.colleges = state.colleges.filter(c => c.id !== id);
  Object.keys(state.distances).forEach(k => { if (k.startsWith(id + '_')) delete state.distances[k]; });
  if (state.markers[id]) { state.map?.removeLayer(state.markers[id]); delete state.markers[id]; }
  if (state.polylines[id]) {
    if (state.polylines[id].line) state.map?.removeLayer(state.polylines[id].line);
    delete state.polylines[id];
  }
  saveState();
  renderColleges(document.getElementById('searchInput').value);
  drawDistanceLines();
  showToast(`"${col?.name || 'College'}" removed`, 'info');
}

// ──────────────────────────────────────────────────
// PDF / BULK IMPORT
// ──────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

async function extractTextFromPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf    = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}

function parseImportText(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('//')) continue;
    if (line.includes('|')) {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        items.push({ name: parts[0], address: parts[1], city: parts[2] || '' });
        continue;
      }
    }
    if (line.includes(' - ')) {
      const idx  = line.indexOf(' - ');
      const name = line.slice(0, idx).trim();
      const addr = line.slice(idx + 3).trim();
      if (name && addr) { items.push({ name, address: addr, city: '' }); continue; }
    }
    if (/college|medical|institute|university|hospital|mbbs/i.test(line)) {
      const commaIdx = line.indexOf(',');
      if (commaIdx > 5) {
        const name = line.slice(0, commaIdx).trim();
        const addr = line.slice(commaIdx + 1).trim();
        if (name && addr) { items.push({ name, address: addr, city: '' }); continue; }
      }
      items.push({ name: line, address: line, city: '' });
    }
  }
  return items;
}

function renderParsedPreview(items) {
  state.parsedImport = items;
  const preview = document.getElementById('parsedPreview');
  const list    = document.getElementById('parsedList');
  const count   = document.getElementById('parsedCount');

  if (items.length === 0) { preview.style.display = 'none'; return; }

  count.textContent = `${items.length} college${items.length === 1 ? '' : 's'} detected`;
  list.innerHTML = items.map((item, i) => `
    <div class="parsed-item">
      <span class="parsed-item-num">${i + 1}.</span>
      <div>
        <div class="parsed-item-name">${escHtml(item.name)}</div>
        <div class="parsed-item-addr">${escHtml(item.address)}</div>
      </div>
    </div>
  `).join('');
  preview.style.display = 'block';
}

async function importColleges() {
  const items = state.parsedImport;
  if (items.length === 0) { showToast('No colleges to import', 'error'); return; }

  setBtnLoading('btnImportConfirm', true);
  closeModal('modalImportPDF');

  let added = 0, failed = 0;
  showStatusBar(`Importing and geocoding 0/${items.length}…`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    updateStatusBar(`Geocoding ${i + 1}/${items.length}: ${item.name}…`);
    try {
      const query = item.city ? `${item.address}, ${item.city}` : item.address;
      const geo   = await geocodeAddress(query);
      const col   = { id: uid(), name: item.name, address: item.address, city: item.city, phone: '', website: '', lat: geo.lat, lng: geo.lng };
      state.colleges.push(col);
      addCollegeMarker(col);
      added++;
    } catch {
      const col = { id: uid(), name: item.name, address: item.address, city: item.city, phone: '', website: '', lat: null, lng: null };
      state.colleges.push(col);
      failed++;
    }
    if (i < items.length - 1) await sleep(GEOCODE_DELAY);
  }

  saveState();
  renderColleges(document.getElementById('searchInput').value);
  drawDistanceLines();
  hideStatusBar();
  setBtnLoading('btnImportConfirm', false);
  showToast(`✅ Imported ${added} college(s)${failed ? `, ${failed} geocoding failed` : ''}`, added > 0 ? 'success' : 'error');

  const home = getActiveHome();
  if (home) recalcAllDistances();
  else fitMapToAll();
}

// ──────────────────────────────────────────────────
// UI HELPERS
// ──────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) {
  const el = document.getElementById(id);
  el.classList.remove('open');
}

function setBtnLoading(btnId, loading) {
  const btn  = document.getElementById(btnId);
  const text = document.getElementById(btnId + 'Text');
  const spin = document.getElementById(btnId + 'Spinner');
  if (!btn) return;
  btn.disabled = loading;
  if (text) text.style.display = loading ? 'none' : 'inline';
  if (spin) spin.style.display = loading ? 'inline-block' : 'none';
}

function showStatusBar(msg) {
  const bar = document.getElementById('statusBar');
  document.getElementById('statusText').textContent = msg;
  bar.style.display = 'flex';
}
function updateStatusBar(msg) { document.getElementById('statusText').textContent = msg; }
function hideStatusBar() { document.getElementById('statusBar').style.display = 'none'; }

let toastTimer = {};
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const id  = uid();
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id = id;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${escHtml(msg)}</span>`;
  container.appendChild(toast);
  toastTimer[id] = setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function clearForm(ids) { ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); }

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ──────────────────────────────────────────────────
// EVENT WIRING
// ──────────────────────────────────────────────────
// ──────────────────────────────────────────────────
// MOBILE RESPONSIVE HELPERS
// ──────────────────────────────────────────────────
let currentMobileView = 'list';

function setMobileView(view) {
  currentMobileView = view;
  const main = document.querySelector('.main-content');
  if (!main) return;
  main.classList.remove('view-list', 'view-map');
  main.classList.add('view-' + view);

  const btnList = document.getElementById('btnShowList');
  const btnMap  = document.getElementById('btnShowMap');
  if (btnList && btnMap) {
    btnList.classList.toggle('active', view === 'list');
    btnMap.classList.toggle('active', view === 'map');
  }

  if (view === 'map') {
    setTimeout(() => {
      state.map?.invalidateSize();
      if (!state.selectedCollegeId) fitMapToAll();
    }, 120);
  }
}

function toggleSidebar(open) {
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  if (window.innerWidth <= 960) {
    const shouldOpen = open !== undefined ? open : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', shouldOpen);
    backdrop?.classList.toggle('active', shouldOpen);
  } else {
    sidebar.classList.toggle('collapsed');
    setTimeout(() => state.map?.invalidateSize(), 310);
  }
}

function closeMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  sidebar?.classList.remove('open');
  backdrop?.classList.remove('active');
}

function wireEvents() {
  // Sidebar toggle & mobile drawer
  document.getElementById('btnMenuToggle')?.addEventListener('click', () => toggleSidebar());
  
  const btnCloseSidebar = document.getElementById('btnCloseSidebar');
  if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', closeMobileSidebar);

  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  const activeLocationBadge = document.getElementById('activeLocationBadge');
  if (activeLocationBadge) {
    activeLocationBadge.addEventListener('click', () => {
      if (window.innerWidth <= 960) toggleSidebar(true);
    });
  }

  // Mobile View Switcher (List vs Map)
  const btnShowList = document.getElementById('btnShowList');
  const btnShowMap  = document.getElementById('btnShowMap');
  if (btnShowList) btnShowList.addEventListener('click', () => setMobileView('list'));
  if (btnShowMap)  btnShowMap.addEventListener('click',  () => setMobileView('map'));

  // Window resize handler
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeMobileSidebar();
    }
    state.map?.invalidateSize();
  });

  // Map toggle
  document.getElementById('btnToggleMap')?.addEventListener('click', () => {
    document.getElementById('mapPanel')?.classList.toggle('collapsed');
    setTimeout(() => state.map?.invalidateSize(), 310);
  });

  // Line filter selector (All / Nearest 10 / Nearest 25 / Hide)
  const lineFilterSelect = document.getElementById('lineFilterSelect');
  if (lineFilterSelect) {
    lineFilterSelect.addEventListener('change', e => {
      state.lineFilter = e.target.value;
      drawDistanceLines();
    });
  }

  // Toggle km distance labels on lines
  const btnToggleLabels = document.getElementById('btnToggleLabels');
  if (btnToggleLabels) {
    btnToggleLabels.addEventListener('click', () => {
      state.showLabels = !state.showLabels;
      btnToggleLabels.classList.toggle('active', state.showLabels);
      drawDistanceLines();
      showToast(state.showLabels ? 'Distance km labels visible' : 'Distance km labels hidden', 'info');
    });
  }

  // Add home location
  document.getElementById('btnAddHomeLocation')?.addEventListener('click', () => openModal('modalHomeLocation'));
  document.getElementById('btnSaveHomeLocation')?.addEventListener('click', saveHomeLocation);

  // Add college
  document.getElementById('btnAddCollege')?.addEventListener('click', () => openModal('modalAddCollege'));
  document.getElementById('btnSaveCollege')?.addEventListener('click', saveCollege);

  // Enter key in forms
  ['homeLocName','homeLocAddress','homeLocLat','homeLocLng'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') saveHomeLocation(); });
  });
  ['collegeName','collegeAddress','collegeCity','collegePhone','collegeWebsite'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') saveCollege(); });
  });

  // Search
  let searchTimeout;
  document.getElementById('searchInput')?.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => renderColleges(e.target.value), 200);
  });

  // Sort
  document.getElementById('sortSelect')?.addEventListener('change', () => {
    const val = document.getElementById('searchInput')?.value || '';
    renderColleges(val);
  });

  // Close modals on backdrop click
  ['modalHomeLocation','modalAddCollege','modalImportPDF','modalCollegeDetail'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', e => {
        if (e.target === el) closeModal(id);
      });
    }
  });

  // Import PDF button
  document.getElementById('btnImportPDF')?.addEventListener('click', () => {
    state.parsedImport = [];
    const preview = document.getElementById('parsedPreview');
    if (preview) preview.style.display = 'none';
    const list = document.getElementById('parsedList');
    if (list) list.innerHTML = '';
    const input = document.getElementById('bulkTextInput');
    if (input) input.value = '';
    const fileLabel = document.getElementById('pdfFileName');
    if (fileLabel) fileLabel.textContent = 'No file selected';
    openModal('modalImportPDF');
  });

  // PDF file input
  const pdfInput = document.getElementById('pdfFileInput');
  const pdfDrop  = document.getElementById('fileDropZone') || document.getElementById('pdfDropZone');

  if (pdfDrop && pdfInput) {
    pdfDrop.addEventListener('click', () => pdfInput.click());
    pdfDrop.addEventListener('dragover', e => { e.preventDefault(); pdfDrop.classList.add('dragover'); });
    pdfDrop.addEventListener('dragleave', () => pdfDrop.classList.remove('dragover'));
    pdfDrop.addEventListener('drop', async e => {
      e.preventDefault();
      pdfDrop.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handlePDFFile(file);
    });
    pdfInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handlePDFFile(file);
    });
  }

  async function handlePDFFile(file) {
    if (!file.name.endsWith('.pdf') && file.type !== 'application/pdf') {
      showToast('Please select a valid PDF file', 'error');
      return;
    }
    const fileNameEl = document.getElementById('pdfFileName');
    if (fileNameEl) fileNameEl.textContent = file.name;
    showStatusBar('Extracting text from PDF…');
    try {
      const text = await extractTextFromPDF(file);
      hideStatusBar();
      const items = parseImportText(text);
      if (items.length === 0) {
        showToast('No college records could be parsed automatically. Try pasting text below.', 'error');
        const bulk = document.getElementById('bulkTextInput');
        if (bulk) bulk.value = text.slice(0, 3000);
      } else {
        renderParsedPreview(items);
        showToast(`Parsed ${items.length} colleges from PDF!`, 'success');
      }
    } catch (e) {
      hideStatusBar();
      showToast(`PDF read error: ${e.message}`, 'error');
    }
  }

  // Bulk text parse button
  const btnParse = document.getElementById('btnParseText');
  if (btnParse) {
    btnParse.addEventListener('click', parseManualTextInput);
  }

  // Auto-parse on typing or pasting into textarea
  const bulkInput = document.getElementById('bulkTextInput');
  if (bulkInput) {
    bulkInput.addEventListener('input', () => {
      const raw = bulkInput.value.trim();
      if (raw.length > 10) {
        const items = parseImportText(raw);
        if (items.length > 0) renderParsedPreview(items);
      }
    });
  }

  function parseManualTextInput() {
    const raw = (document.getElementById('bulkTextInput')?.value || '').trim();
    if (!raw) { showToast('Paste some text first', 'error'); return; }
    const items = parseImportText(raw);
    if (items.length === 0) {
      showToast('Could not detect college names. Format each line as "Name | Address"', 'error');
    } else {
      renderParsedPreview(items);
      showToast(`Detected ${items.length} colleges`, 'success');
    }
  }

  // Clear preview
  const btnClearParsed = document.getElementById('btnClearParsed') || document.getElementById('btnClearPreview');
  if (btnClearParsed) {
    btnClearParsed.addEventListener('click', () => {
      state.parsedImport = [];
      const preview = document.getElementById('parsedPreview');
      if (preview) preview.style.display = 'none';
      const input = document.getElementById('bulkTextInput');
      if (input) input.value = '';
    });
  }

  // Import confirm
  const btnImportConfirm = document.getElementById('btnImportConfirm');
  if (btnImportConfirm) {
    btnImportConfirm.addEventListener('click', importColleges);
  }

  // Clear / Reset all
  const btnClearAll = document.getElementById('btnClearAll');
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      if (!confirm('Reset all data back to the default 73 medical colleges and Kaziwad Bhavnagar?')) return;
      localStorage.clear();
      state.colleges = [];
      state.homeLocations = [];
      state.activeHomeId = null;
      state.distances = {};
      Object.values(state.markers).forEach(m => state.map?.removeLayer(m));
      state.markers = {};
      clearDistanceLines();
      if (state.homeMarker) { state.map?.removeLayer(state.homeMarker); state.homeMarker = null; }
      loadState();
      renderHomeLocations();
      renderColleges();
      renderStats();
      const home = getActiveHome();
      if (home) {
        const nameEl = document.getElementById('activeLocationName');
        if (nameEl) nameEl.textContent = home.name;
        updateHomeMarker(home);
        drawDistanceLines();
      }
      showToast('Reset to default 73 colleges & Kaziwad Bhavnagar!', 'success');
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['modalHomeLocation','modalAddCollege','modalImportPDF','modalCollegeDetail'].forEach(id => closeModal(id));
    }
  });
}

// ──────────────────────────────────────────────────
// COLLEGE DETAIL & PHOTOS MODAL
// ──────────────────────────────────────────────────
let currentDetailCollege = null;
let satelliteMap = null;
let satelliteMarker = null;

function openCollegeDetailModal(collegeId) {
  const college = state.colleges.find(c => c.id === collegeId);
  if (!college) return;
  currentDetailCollege = college;

  const home = getActiveHome();
  const dist = home ? getCollegeDistance(college, home) : null;
  const collegeImg = getCollegeImage(college);

  // Set Titles & Badges
  document.getElementById('modalCollegeTitle').textContent = college.name;
  document.getElementById('modalCollegeCity').textContent = college.city 
    ? `${college.city}${college.state ? ', ' + college.state : ''}` 
    : (college.address || '—');
  document.getElementById('modalCollegeTag').textContent = college.speciality || 'DNB Medical Institute / Hospital';

  // Hero Image
  const heroImg = document.getElementById('modalCollegeHeroImg');
  heroImg.src = collegeImg;
  heroImg.onerror = () => { heroImg.src = DEFAULT_FALLBACK_IMG; };
  document.getElementById('modalCollegeImgCity').textContent = college.city || 'Hospital Campus';
  document.getElementById('modalCollegeImgFullLink').href = collegeImg;

  // Google Maps Photos search link
  const queryStr = `${college.name} photos ${college.city || ''}`;
  document.getElementById('modalCollegeGooglePhotosLink').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr)}`;

  // Distance Section
  document.getElementById('modalCollegeOriginHome').textContent = home ? home.name : 'No home selected';
  const distKmEl = document.getElementById('modalCollegeDistKm');
  const distStatsEl = document.getElementById('modalCollegeDistStats');

  if (dist) {
    distKmEl.textContent = `${dist.km} km`;
    distStatsEl.innerHTML = `
      <div class="detail-stat-card">
        <span class="stat-num">${dist.isDrive ? dist.exactKm + ' km' : dist.km + ' km'}</span>
        <span class="stat-lbl">${dist.isDrive ? 'Road Distance' : 'Direct Line'}</span>
      </div>
      <div class="detail-stat-card">
        <span class="stat-num">${dist.driveText || 'Calculating…'}</span>
        <span class="stat-lbl">Drive Time</span>
      </div>
      <div class="detail-stat-card">
        <span class="stat-num">${dist.walkText || (dist.directKm ? dist.directKm + ' km' : '—')}</span>
        <span class="stat-lbl">${dist.walkText ? 'Walk Time' : 'Direct Dist'}</span>
      </div>
    `;
  } else {
    distKmEl.textContent = '—';
    distStatsEl.innerHTML = `<div style="grid-column:1/-1;font-size:0.75rem;color:var(--text-muted)">Select a home location to calculate distance</div>`;
  }

  // Address & Metadata
  document.getElementById('modalCollegeAddress').textContent = college.address || college.city || '—';
  document.getElementById('modalCollegeCoords').textContent = (college.lat && college.lng)
    ? `${college.lat.toFixed(4)}° N, ${college.lng.toFixed(4)}° E`
    : 'Pending geocoding';

  const phoneBox = document.getElementById('modalCollegePhoneBox');
  if (college.phone) {
    phoneBox.style.display = 'block';
    document.getElementById('modalCollegePhone').innerHTML = `<a href="tel:${escHtml(college.phone)}" style="color:#38bdf8;text-decoration:none;">${escHtml(college.phone)}</a>`;
  } else {
    phoneBox.style.display = 'none';
  }

  const webBox = document.getElementById('modalCollegeWebsiteBox');
  if (college.website) {
    webBox.style.display = 'block';
    document.getElementById('modalCollegeWebsite').innerHTML = `<a href="${escHtml(college.website)}" target="_blank" style="color:#38bdf8;text-decoration:none;">Visit Official Website ↗</a>`;
  } else {
    webBox.style.display = 'none';
  }

  // Footer Actions
  const btnFocus = document.getElementById('btnDetailFocusMap');
  btnFocus.onclick = () => {
    closeModal('modalCollegeDetail');
    focusCollegeOnMap(college.id);
  };

  const btnDir = document.getElementById('btnDetailDirections');
  if (home?.lat && college?.lat) {
    btnDir.href = `https://www.google.com/maps/dir/${home.lat},${home.lng}/${college.lat},${college.lng}`;
    btnDir.style.display = 'inline-flex';
  } else {
    btnDir.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(college.name + ' ' + (college.city || college.address))}`;
    btnDir.style.display = 'inline-flex';
  }

  // Default to photo view
  switchDetailMediaTab('photo');

  openModal('modalCollegeDetail');
}

function switchDetailMediaTab(tab) {
  const photoPane = document.getElementById('detailPhotoPane');
  const satPane = document.getElementById('detailSatellitePane');
  const btnPhoto = document.getElementById('tabBtnPhoto');
  const btnSat = document.getElementById('tabBtnSatellite');

  if (tab === 'satellite') {
    if (photoPane) photoPane.style.display = 'none';
    if (satPane) satPane.style.display = 'block';
    if (btnPhoto) btnPhoto.classList.remove('active');
    if (btnSat) btnSat.classList.add('active');

    initSatelliteMap(currentDetailCollege);
  } else {
    if (satPane) satPane.style.display = 'none';
    if (photoPane) photoPane.style.display = 'block';
    if (btnSat) btnSat.classList.remove('active');
    if (btnPhoto) btnPhoto.classList.add('active');
  }
}

function initSatelliteMap(college) {
  if (!college || !college.lat || !college.lng) return;
  const container = document.getElementById('collegeSatelliteMap');
  if (!container) return;

  if (!satelliteMap) {
    satelliteMap = L.map('collegeSatelliteMap', {
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: 'Esri World Imagery'
    }).addTo(satelliteMap);
  }

  satelliteMap.setView([college.lat, college.lng], 16);

  if (satelliteMarker) {
    satelliteMap.removeLayer(satelliteMarker);
  }

  satelliteMarker = L.marker([college.lat, college.lng], {
    icon: createCollegeIcon()
  }).addTo(satelliteMap);

  setTimeout(() => {
    if (satelliteMap) satelliteMap.invalidateSize();
  }, 120);
}

// ──────────────────────────────────────────────────
// LOAD PDF HOSPITALS INTO STATE
// ──────────────────────────────────────────────────
function loadPDFHospitals() {
  const existingNames = new Set(state.colleges.map(c => c.name.toLowerCase()));
  let added = 0;
  PDF_HOSPITALS.forEach(h => {
    if (existingNames.has(h.name.toLowerCase())) return;
    state.colleges.push({
      id: uid(),
      name: h.name,
      address: `${h.name}, ${h.city}, ${h.state}, India`,
      city: `${h.city}, ${h.state}`,
      phone: '',
      website: '',
      lat: h.lat,
      lng: h.lng,
    });
    added++;
  });
  saveState();
  return added;
}

// ──────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────
function init() {
  try {
    loadState();
  } catch (e) {
    console.error('loadState error:', e);
  }

  try {
    initMap();
  } catch (e) {
    console.error('initMap error:', e);
  }

  try {
    wireEvents();
  } catch (e) {
    console.error('wireEvents error:', e);
  }

  // Auto-load PDF hospitals if list empty
  try {
    if (!state.colleges || state.colleges.length === 0) {
      const added = loadPDFHospitals();
      if (added > 0) {
        showToast(`📋 Loaded ${added} hospitals from your PDF list!`, 'success');
      }
    }
  } catch (e) {
    console.error('loadPDFHospitals error:', e);
  }

  // Restore active home marker + name
  try {
    const home = getActiveHome();
    if (home) {
      const activeName = document.getElementById('activeLocationName');
      if (activeName) activeName.textContent = home.name;
      updateHomeMarker(home);
    }
  } catch (e) {
    console.error('active home marker error:', e);
  }

  // Render home locations sidebar
  try {
    renderHomeLocations();
  } catch (e) {
    console.error('renderHomeLocations error:', e);
  }

  // Add all college markers
  try {
    if (state.map && Array.isArray(state.colleges)) {
      state.colleges.forEach(c => addCollegeMarker(c));
    }
  } catch (e) {
    console.error('addCollegeMarker error:', e);
  }

  // Mobile view initialization
  try {
    setMobileView('list');
  } catch (e) {
    console.error('setMobileView error:', e);
  }

  // Render college grid & stats
  try {
    renderColleges();
    renderStats();
  } catch (e) {
    console.error('renderColleges/renderStats error:', e);
  }

  // Draw distance lines from home to all locations
  try {
    const home = getActiveHome();
    if (home) {
      drawDistanceLines();
    }
  } catch (e) {
    console.error('drawDistanceLines error:', e);
  }

  try {
    fitMapToAll();
  } catch (e) {
    console.error('fitMapToAll error:', e);
  }

  // Compute road distances in background
  try {
    const home = getActiveHome();
    if (home && state.colleges && state.colleges.length > 0) {
      recalcAllDistances();
    }
  } catch (e) {
    console.error('recalcAllDistances error:', e);
  }
}

document.addEventListener('DOMContentLoaded', init);
