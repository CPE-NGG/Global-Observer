let scene, camera, renderer, globe, stars, controls, eventMarkers = [];
let allEvents = [];
let categoryMap = {}; 
let isAutoRotating = true;
let selectedEventId = null;
let hoveredEventId = null;
let isPlaying = false;
let playbackInterval = null;

const EARTH_RADIUS = 5;
const API_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';

// Precise centroids for countries
const COUNTRY_COORDINATES = {
    "AFGHANISTAN": [33.9391, 67.7100], "ALBANIA": [41.1533, 20.1683], "ALGERIA": [28.0339, 1.6596],
    "ANDORRA": [42.5462, 1.6016], "ANGOLA": [-11.2027, 17.8739], "ARGENTINA": [-38.4161, -63.6167],
    "ARMENIA": [40.0691, 45.0382], "AUSTRALIA": [-25.2744, 133.7751], "AUSTRIA": [47.5162, 14.5501],
    "AZERBAIJAN": [40.1431, 47.5769], "BAHAMAS": [25.0343, -77.3963], "BAHRAIN": [26.0667, 50.5577],
    "BANGLADESH": [23.6850, 90.3563], "BARBADOS": [13.1939, -59.5432], "BELARUS": [53.7098, 27.9534],
    "BELGIUM": [50.5039, 4.4699], "BELIZE": [17.1899, -88.4976], "BENIN": [9.3077, 2.3158],
    "BHUTAN": [27.5142, 90.4336], "BOLIVIA": [-16.2902, -63.5887], "BOSNIA": [43.9159, 17.6791],
    "BOTSWANA": [-22.3285, 24.6849], "BRAZIL": [-14.2350, -51.9253], "BRUNEI": [4.5353, 114.7277],
    "BULGARIA": [42.7339, 25.4858], "BURKINA FASO": [12.2383, -1.5616], "BURUNDI": [-3.3731, 29.9189],
    "CAMBODIA": [12.5657, 104.9910], "CAMEROON": [7.3697, 12.3547], "CANADA": [56.1304, -106.3468],
    "CHAD": [15.4542, 18.7322], "CHILE": [-35.6751, -71.5430], "CHINA": [35.8617, 104.1954],
    "COLOMBIA": [4.5709, -74.2973], "CONGO": [-0.2280, 15.8277], "COSTA RICA": [9.7489, -83.7534],
    "CROATIA": [45.1000, 15.2000], "CUBA": [21.5218, -77.7812], "CYPRUS": [35.1264, 33.4299],
    "CZECH REPUBLIC": [49.8175, 15.4730], "DENMARK": [56.2639, 9.5018], "DOMINICAN REPUBLIC": [18.7357, -70.1627],
    "ECUADOR": [-1.8312, -78.1834], "EGYPT": [26.8206, 30.8025], "EL SALVADOR": [13.7942, -88.8965],
    "ESTONIA": [58.5953, 25.0136], "ETHIOPIA": [9.1450, 40.4897], "FIJI": [-17.7134, 178.0650],
    "FINLAND": [61.9241, 25.7482], "FRANCE": [46.2276, 2.2137], "GABON": [-0.8037, 11.6094],
    "GAMBIA": [13.4432, -15.3101], "GEORGIA": [42.3154, 43.3569], "GHANA": [7.9465, -1.0232],
    "GREECE": [39.0742, 21.8243], "GUATEMALA": [15.7835, -90.2308], "GUINEA": [9.9456, -9.6966],
    "GUYANA": [4.8604, -58.9302], "HAITI": [18.9712, -72.2852], "HONDURAS": [15.1999, -86.2419],
    "HUNGARY": [47.1625, 19.5033], "ICELAND": [64.9631, -19.0208], "INDIA": [20.5937, 78.9629],
    "INDONESIA": [-0.7893, 113.9213], "IRAN": [32.4279, 53.6880], "IRAQ": [33.2232, 43.6793],
    "IRELAND": [53.4129, -8.2439], "ISRAEL": [31.0461, 34.8516], "ITALY": [41.8719, 12.5674],
    "JAMAICA": [18.1096, -77.2975], "JAPAN": [36.2048, 138.2529], "JORDAN": [30.5852, 36.2384],
    "KAZAKHSTAN": [48.0196, 66.9237], "KENYA": [-0.0236, 37.9062], "KOREA, SOUTH": [35.9078, 127.7669],
    "KUWAIT": [29.3117, 47.4818], "LAOS": [19.8563, 102.4955], "LATVIA": [56.8796, 24.6032],
    "LEBANON": [33.8547, 35.8623], "LIBYA": [26.3351, 17.2283], "LITHUANIA": [55.1694, 23.8813],
    "LUXEMBOURG": [49.8153, 6.1296], "MADAGASCAR": [-18.7669, 46.8691], "MALAYSIA": [4.2105, 101.9758],
    "MALDIVES": [3.2028, 73.2207], "MALI": [17.5707, -3.9962], "MALTA": [35.9375, 14.3754],
    "MAURITIUS": [-20.3484, 57.5522], "MEXICO": [23.6345, -102.5528], "MOLDOVA": [47.4116, 28.3699],
    "MONACO": [43.7384, 7.4246], "MONGOLIA": [46.8625, 103.8467], "MONTENEGRO": [42.7087, 19.3744],
    "MOROCCO": [31.7917, -7.0926], "MOZAMBIQUE": [-18.6657, 35.5296], "MYANMAR": [21.9162, 95.9560],
    "NAMIBIA": [-22.9576, 18.4904], "NEPAL": [28.3949, 84.1240], "NETHERLANDS": [52.1326, 5.2913],
    "NEW ZEALAND": [-40.9006, 174.8860], "NICARAGUA": [12.8654, -85.2072], "NIGER": [17.6078, 8.0817],
    "NIGERIA": [9.0820, 8.6753], "NORWAY": [60.4720, 8.4689], "OMAN": [21.5126, 55.9233],
    "PAKISTAN": [30.3753, 69.3451], "PANAMA": [8.5380, -80.7821], "PAPUA NEW GUINEA": [-6.3150, 143.9555],
    "PARAGUAY": [-23.4425, -58.4438], "PERU": [-9.1900, -75.0152], "PHILIPPINES": [12.8797, 121.7740],
    "POLAND": [51.9194, 19.1451], "PORTUGAL": [39.3999, -8.2245], "QATAR": [25.3548, 51.1839],
    "ROMANIA": [45.9432, 24.9668], "RUSSIA": [61.5240, 105.3188], "RWANDA": [-1.9403, 29.8739],
    "SAUDI ARABIA": [23.8859, 45.0792], "SENEGAL": [14.4974, -14.4524], "SERBIA": [44.0165, 21.0059],
    "SINGAPORE": [1.3521, 103.8198], "SLOVAKIA": [48.6690, 19.6990], "SLOVENIA": [46.1512, 14.9955],
    "SOUTH AFRICA": [-30.5595, 22.9375], "SPAIN": [40.4637, -3.7492], "SRI LANKA": [7.8731, 80.7718],
    "SUDAN": [12.8628, 30.2176], "SWEDEN": [60.1282, 18.6435], "SWITZERLAND": [46.8182, 8.2275],
    "SYRIA": [34.8021, 38.9968], "TAIWAN": [23.6978, 120.9605], "TAJIKISTAN": [38.8610, 71.2761],
    "TANZANIA": [-6.3690, 34.8888], "THAILAND": [15.8700, 100.9925], "TUNISIA": [33.8869, 9.5375],
    "TURKEY": [38.9637, 35.2433], "UGANDA": [1.3733, 32.2903], "UKRAINE": [48.3794, 31.1656],
    "UNITED ARAB EMIRATES": [23.4241, 53.8478], "UNITED KINGDOM": [55.3781, -3.4360],
    "UNITED STATES": [37.0902, -95.7129], "URUGUAY": [-32.5228, -55.7658], "UZBEKISTAN": [41.3775, 64.5853],
    "VENEZUELA": [6.4238, -66.5897], "VIETNAM": [14.0583, 108.2772], "YEMEN": [15.5527, 48.5164],
    "ZAMBIA": [-13.1339, 27.8493], "ZIMBABWE": [-19.0154, 29.1549]
};

const ALIASES = {
    "USA": "UNITED STATES", "AMERICA": "UNITED STATES", "US": "UNITED STATES",
    "UK": "UNITED KINGDOM", "BRITAIN": "UNITED KINGDOM", "GB": "UNITED KINGDOM",
    "SOUTH KOREA": "KOREA, SOUTH", "KOREA": "KOREA, SOUTH", "UAE": "UNITED ARAB EMIRATES",
    "PHILIPINES": "PHILIPPINES", "VIET NAM": "VIETNAM", "RUSSIA FEDERATION": "RUSSIA",
    "HOLLAND": "NETHERLANDS", "CZECHIA": "CZECH REPUBLIC", "EMIRATES": "UNITED ARAB EMIRATES"
};

const CATEGORY_SPECS = {
    'wildfires': { color: '#ff3c00', label: 'Wildfires' },
    'severeStorms': { color: '#00d0ff', label: 'Severe Storms' },
    'volcanoes': { color: '#ff8c00', label: 'Volcanoes' },
    'floods': { color: '#00ff88', label: 'Floods' },
    'drought': { color: '#e2c500', label: 'Drought' },
    'landslides': { color: '#9e674b', label: 'Landslides' },
    'earthquakes': { color: '#ff0055', label: 'Earthquakes' },
    'icebergs': { color: '#d300ff', label: 'Icebergs' },
    'seaLakeIce': { color: '#ff00ff', label: 'Sea and Lake Ice' }
};

function init() {
    setupScene();
    createGlobe();
    createStars();
    animate();
    setupTimeline();
    updateUTCClock();
    fetchEvents();
    setupEventListeners();
    setInterval(updateUTCClock, 1000);
}

function updateUTCClock() {
    const now = new Date();
    const timeStr = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
    document.getElementById('utcClock').innerText = timeStr;
}

function setupScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.6;
    controls.minDistance = 6.0;
    controls.maxDistance = 25;
    controls.enablePan = false;
    
    controls.addEventListener('start', () => { 
        isAutoRotating = false; 
        gsap.killTweensOf(camera.position); 
    });
    
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(10, 10, 10);
    scene.add(sun);
}

function createGlobe() {
    const geometry = new THREE.SphereGeometry(EARTH_RADIUS, 128, 128);
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
        map: loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
        bumpMap: loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png'),
        bumpScale: 0.05, 
        shininess: 10
    });
    globe = new THREE.Mesh(geometry, material);
    // Default Three.js texture starts at Lon 180 on +X. Lon 0 is on -X.
    // We rotate by -Math.PI / 2 to face Lon 0.
    globe.rotation.set(0, -Math.PI / 2, 0); 
    scene.add(globe);

    const atmosGeom = new THREE.SphereGeometry(EARTH_RADIUS * 1.02, 128, 128);
    const atmosMat = new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1, side: THREE.BackSide });
    scene.add(new THREE.Mesh(atmosGeom, atmosMat));
}

function createStars() {
    const starGeom = new THREE.BufferGeometry();
    const verts = [];
    for (let i = 0; i < 5000; i++) { 
        verts.push((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000); 
    }
    starGeom.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    stars = new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8 }));
    scene.add(stars);
}

/**
    * Converts Lat/Lon to a local Vector3 relative to the Globe's unrotated coordinate system.
    */
function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

/**
    * Converts a local Vector3 back to Lat/Lon.
    */
function vector3ToLatLon(vector) {
    const pos = vector.clone().normalize();
    const lat = Math.asin(pos.y) * (180 / Math.PI);
    // Lon is calculated using atan2(z, -x) based on the mapping above
    let lon = Math.atan2(pos.z, -pos.x) * (180 / Math.PI) - 180;
    while (lon <= -180) lon += 360;
    while (lon > 180) lon -= 360;
    return { lat, lon };
}

/**
    * Animates camera focus to a specific lat/lon coordinate.
    * Accounts for current globe rotation.
    */
function focusOnCoordinates(lat, lon) {
    // Get local position on the globe
    const localPos = latLongToVector3(lat, lon, 1);
    // Convert to current world position based on globe's active rotation
    const worldDir = localPos.clone().applyMatrix4(globe.matrixWorld).normalize();
    const targetCamPos = worldDir.multiplyScalar(12);

    isAutoRotating = false;
    gsap.to(camera.position, { 
        x: targetCamPos.x,
        y: targetCamPos.y,
        z: targetCamPos.z,
        duration: 2, 
        ease: "power3.inOut", 
        onUpdate: () => controls.update() 
    });
}

function focusOnEvent(event) {
    const marker = eventMarkers.find(m => m.id === event.id);
    if (!marker) return;
    const worldPos = new THREE.Vector3();
    marker.group.getWorldPosition(worldPos);
    const targetCamPos = worldPos.clone().normalize().multiplyScalar(11);
    isAutoRotating = false;
    gsap.to(camera.position, { 
        x: targetCamPos.x,
        y: targetCamPos.y,
        z: targetCamPos.z,
        duration: 1.5, 
        ease: "power3.inOut", 
        onUpdate: () => controls.update() 
    });
}

function setupTimeline() {
    const slider = document.getElementById('timelineSlider');
    const dateDisplay = document.getElementById('timelineDate');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');

    const updateDisplay = () => {
        const daysAgo = 365 - parseInt(slider.value);
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        dateDisplay.innerText = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    };

    slider.oninput = updateDisplay;
    slider.onchange = () => {
        isPlaying = false;
        stopPlayback();
        updatePlayIcon();
        fetchEvents();
    };

    playBtn.onclick = () => {
        isPlaying = !isPlaying;
        updatePlayIcon();
        if (isPlaying) {
            if (slider.value >= 365) slider.value = 0;
            startPlayback();
        } else {
            stopPlayback();
        }
    };

    function updatePlayIcon() {
        playIcon.innerHTML = isPlaying ? 
            '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' : 
            '<path d="M8 5v14l11-7z"/>';
    }
    updateDisplay();
}

function startPlayback() {
    const slider = document.getElementById('timelineSlider');
    playbackInterval = setInterval(() => {
        let val = parseInt(slider.value);
        if (val < 365) {
            slider.value = val + 1;
            const daysAgo = 365 - parseInt(slider.value);
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            document.getElementById('timelineDate').innerText = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
            if (val % 4 === 0) fetchEvents(true);
        } else {
            isPlaying = false;
            clearInterval(playbackInterval);
            document.getElementById('playIcon').innerHTML = '<path d="M8 5v14l11-7z"/>';
        }
    }, 600);
}

function stopPlayback() {
    clearInterval(playbackInterval);
}

async function fetchEvents(silent = false) {
    const loading = document.getElementById('loading');
    const slider = document.getElementById('timelineSlider');
    const daysAgoEnd = 365 - parseInt(slider.value);
    const daysAgoStart = daysAgoEnd + 30;

    if (!silent) {
        loading.style.display = 'flex';
        loading.style.opacity = '1';
        document.getElementById('loading-text').innerText = "Accessing NASA Archives...";
    }

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() - daysAgoEnd);
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - daysAgoStart);

    const startStr = dateStart.toISOString().split('T')[0];
    const endStr = dateEnd.toISOString().split('T')[0];

    try {
        const response = await fetch(`${API_URL}?status=open&limit=250&start=${startStr}&end=${endStr}`);
        const data = await response.json();
        allEvents = data.events;
        processCategories(allEvents);
        renderCategoryFilters();
        updateUI(allEvents);
        plotMarkers(allEvents);
        
        if (!silent) {
            loading.style.opacity = '0';
            setTimeout(() => loading.style.display = 'none', 400);
        }
    } catch (error) { 
        console.error(error); 
        if (!silent) loading.innerHTML = '<h2 class="text-red-500 uppercase tracking-widest">Archive Error</h2>';
    }
}

function processCategories(events) {
    categoryMap = {};
    events.forEach(event => {
        event.categories.forEach(cat => {
            if (!categoryMap[cat.id]) {
                const spec = CATEGORY_SPECS[cat.id] || { color: '#ffffff', label: cat.title };
                categoryMap[cat.id] = { id: cat.id, title: spec.label, color: new THREE.Color(spec.color), hex: spec.color };
            }
        });
    });
}

function renderCategoryFilters() {
    const container = document.getElementById('filterContainer');
    const activeFilter = container.querySelector('.filter-btn.active')?.dataset.category || 'all';
    container.innerHTML = '';
    
    const allBtn = document.createElement('button');
    allBtn.className = `filter-btn ${activeFilter === 'all' ? 'active' : ''} px-3 py-1.5 bg-white/5 rounded-full`;
    allBtn.innerText = 'ALL';
    allBtn.dataset.category = 'all';
    allBtn.onclick = () => toggleFilter('all');
    container.appendChild(allBtn);
    
    Object.values(categoryMap).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${activeFilter === cat.id ? 'active' : ''} px-3 py-1 rounded-full border border-white/10 text-[12px] uppercase whitespace-nowrap`;
        btn.dataset.category = cat.id;
        btn.innerText = cat.title;
        btn.onclick = () => toggleFilter(cat.id);
        container.appendChild(btn);
    });
}

function toggleFilter(catId) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.category === catId));
    const filtered = catId === 'all' ? allEvents : allEvents.filter(e => e.categories.some(c => c.id === catId));
    updateUI(filtered);
    plotMarkers(filtered);
    if (selectedEventId && !filtered.some(e => e.id === selectedEventId)) {
        document.getElementById('closeDetail').click();
    }
}

function getPointFromGeometry(geometry) {
    if (!geometry || !Array.isArray(geometry)) return null;
    for (let g of geometry) {
        if (g.type === 'Point') return g.coordinates;
        if (g.type === 'MultiPoint' && g.coordinates[0]) return g.coordinates[0];
    }
    return null;
}

function plotMarkers(events) {
    eventMarkers.forEach(m => globe.remove(m.group));
    eventMarkers = [];
    
    events.forEach(event => {
        const coords = getPointFromGeometry(event.geometry);
        if (!coords) return;
        
        const [lon, lat] = coords;
        const spec = CATEGORY_SPECS[event.categories[0].id] || { color: '#ffffff' };
        const color = new THREE.Color(spec.color);
        
        const pos = latLongToVector3(lat, lon, EARTH_RADIUS + 0.05);
        const group = new THREE.Group();
        group.position.copy(pos);
        group.lookAt(pos.clone().multiplyScalar(2));

        const core = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 16, 16), 
            new THREE.MeshStandardMaterial({ 
                color: color, emissive: color, emissiveIntensity: 3 
            })
        );

        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.14, 0.22, 32),
            new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
        );
        
        const beaconGroup = new THREE.Group();
        const beamCore = new THREE.Mesh(
            new THREE.CylinderGeometry(0.005, 0.005, 1.5, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
        );
        beamCore.rotateX(Math.PI / 2);
        beamCore.position.z = 0.75;
        
        const beamShroud = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.005, 1.5, 16),
            new THREE.MeshBasicMaterial({ 
                color: color, // Dynamically uses the event's category color
                transparent: true, 
                opacity: 0 
            })
        );
        beamShroud.rotateX(Math.PI / 2);
        beamShroud.position.z = 0.75;

        beaconGroup.add(beamCore, beamShroud);
        group.add(core, ring, beaconGroup);
        globe.add(group);
        
        eventMarkers.push({ 
            id: event.id, group, core, ring, 
            beacon: beaconGroup, beaconParts: [beamCore, beamShroud],
            eventData: event, lat, lon, baseColor: color.clone()
        });
    });
}

function updateUI(events) {
    const list = document.getElementById('eventList');
    document.getElementById('eventCount').innerText = events.length.toString().padStart(3, '0');
    list.innerHTML = '';
    events.slice(0, 150).forEach(event => {
        const spec = CATEGORY_SPECS[event.categories[0].id] || { color: '#fff' };
        const card = document.createElement('div');
        card.className = 'event-card p-2 rounded-lg glass-panel text-[9px] border-l-2 mb-1';
        card.style.borderLeftColor = spec.color;
        card.innerHTML = `<h3 class="font-bold truncate uppercase">${event.title}</h3><p class="opacity-40 uppercase">${event.categories[0].title}</p>`;
        if (selectedEventId === event.id) card.classList.add('active-item');
        card.onclick = () => showEventDetails(event);
        card.onmouseenter = () => { hoveredEventId = event.id; };
        card.onmouseleave = () => { hoveredEventId = null; };
        list.appendChild(card);
    });
}

function showEventDetails(event) {
    selectedEventId = event.id;
    isAutoRotating = false;
    
    const panel = document.getElementById('detailPanel');
    const sidebar = document.getElementById('sidebar');
    const spec = CATEGORY_SPECS[event.categories[0].id] || { color: '#fff' };

    // Update active state in the event list
    document.querySelectorAll('.event-card').forEach(c => {
        c.classList.toggle('active-item', c.querySelector('h3').innerText === event.title.toUpperCase());
    });

    // MOBILE FIX: Hide the sidebar to make room for the detail panel
    if (window.innerWidth < 768) {
        sidebar.classList.add('hidden');
    }

    // Show the panel and trigger the slide-in animation
    panel.classList.remove('hidden');
    // Small delay to ensure the browser registers the removal of 'hidden' before animating
    requestAnimationFrame(() => {
        panel.classList.remove('translate-x-full');
    });

    // Populate Details content
    document.getElementById('detailCat').innerText = event.categories[0].title;
    document.getElementById('detailCat').style.color = spec.color;
    document.getElementById('detailCat').style.borderColor = spec.color;
    document.getElementById('detailTitle').innerText = event.title;
    
    const coords = getPointFromGeometry(event.geometry);
    if (coords) {
        document.getElementById('detailCoords').innerText = `LAT: ${coords[1].toFixed(4)} | LON: ${coords[0].toFixed(4)}`;
    }

    const sourceList = document.getElementById('detailSources');
    sourceList.innerHTML = '';
    event.sources.forEach(src => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${src.url}" target="_blank" class="text-cyan-400 hover:underline break-all uppercase text-[12px] flex justify-between items-center bg-white/5 p-1 rounded">${src.id} <span class="text-[12px]">↗</span></a>`;
        sourceList.appendChild(li);
    });

    focusOnEvent(event);
}

function setupEventListeners() {
    window.addEventListener('resize', () => { 
        camera.aspect = window.innerWidth / window.innerHeight; 
        camera.updateProjectionMatrix(); 
        renderer.setSize(window.innerWidth, window.innerHeight); 
    });

    const searchInput = document.getElementById('countrySearch');
    const dropdown = document.getElementById('searchDropdown');

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toUpperCase();
        dropdown.innerHTML = '';
        if (val.length < 1) { dropdown.style.display = 'none'; return; }

        const matches = [];
        Object.keys(COUNTRY_COORDINATES).forEach(name => {
            if (name.includes(val)) matches.push({ display: name, key: name });
        });
        Object.entries(ALIASES).forEach(([alias, target]) => {
            if (alias.includes(val)) matches.push({ display: `${alias} (${target})`, key: target });
        });

        const uniqueMatches = Array.from(new Map(matches.map(m => [m.key, m])).values());

        if (uniqueMatches.length > 0) {
            dropdown.style.display = 'block';
            uniqueMatches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'search-item';
                div.innerText = match.display;
                div.onmousedown = (e) => {
                    e.preventDefault();
                    const coords = COUNTRY_COORDINATES[match.key];
                    focusOnCoordinates(coords[0], coords[1]);
                    searchInput.value = match.display;
                    dropdown.style.display = 'none';
                };
                dropdown.appendChild(div);
            });
        } else {
            dropdown.style.display = 'none';
        }
    });

    searchInput.addEventListener('blur', () => { dropdown.style.display = 'none'; });
    searchInput.addEventListener('focus', () => { if (dropdown.children.length > 0) dropdown.style.display = 'block'; });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = searchInput.value.trim().toUpperCase();
            let target = (COUNTRY_COORDINATES[val]) ? COUNTRY_COORDINATES[val] : (ALIASES[val] ? COUNTRY_COORDINATES[ALIASES[val]] : null);
            if (target) {
                focusOnCoordinates(target[0], target[1]);
                dropdown.style.display = 'none';
                searchInput.blur();
            }
        }
    });

    // BACK BUTTON / ESC LOGIC
    document.getElementById('closeDetail').onclick = () => { 
        const panel = document.getElementById('detailPanel');
        const sidebar = document.getElementById('sidebar');

        // Start the slide-out animation
        panel.classList.add('translate-x-full'); 
        
        // Wait for the 500ms CSS transition to finish before hiding from layout
        setTimeout(() => {
            panel.classList.add('hidden');
            // Bring the sidebar back on mobile
            sidebar.classList.remove('hidden');
        }, 500);

        isAutoRotating = true; 
        selectedEventId = null; 
        document.querySelectorAll('.active-item').forEach(el => el.classList.remove('active-item'));
    };

    document.getElementById('focusBtn').onclick = () => {
        const ev = allEvents.find(e => e.id === selectedEventId);
        if (ev) focusOnEvent(ev);
    };

    document.getElementById('refreshBtn').onclick = () => fetchEvents();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersectsGlobe = raycaster.intersectObject(globe);
        if (intersectsGlobe.length > 0) {
            const localPoint = globe.worldToLocal(intersectsGlobe[0].point.clone());
            const coords = vector3ToLatLon(localPoint);
            document.getElementById('liveCoords').innerText = `LAT: ${coords.lat.toFixed(2)} | LON: ${coords.lon.toFixed(2)}`;
        } else {
            document.getElementById('liveCoords').innerText = `LAT: -- | LON: --`;
        }

        const visibleMarkers = eventMarkers.filter(m => m.group.visible);
        const intersects = raycaster.intersectObjects(visibleMarkers.map(m => m.core));
        const tooltip = document.getElementById('tooltip');
        
        if (intersects.length > 0) {
            const marker = eventMarkers.find(m => m.core === intersects[0].object);
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
            tooltip.innerHTML = `<b>${marker.eventData.title}</b>`;
            document.body.style.cursor = 'pointer';
        } else {
            tooltip.style.display = 'none';
            document.body.style.cursor = 'default';
        }
    });

    window.addEventListener('click', (e) => {
        raycaster.setFromCamera(mouse, camera);
        const visibleMarkers = eventMarkers.filter(m => m.group.visible);
        const intersects = raycaster.intersectObjects(visibleMarkers.map(m => m.core));
        if (intersects.length > 0) {
            const marker = eventMarkers.find(m => m.core === intersects[0].object);
            showEventDetails(marker.eventData);
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') document.getElementById('closeDetail').click();
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (isAutoRotating && !isPlaying) {
        globe.rotation.y += 0.0012;
    }

    const time = Date.now() * 0.005;
    eventMarkers.forEach(m => {
        const isSelected = m.id === selectedEventId;
        const isHovered = m.id === hoveredEventId;
        
        if (selectedEventId && !isSelected) {
            m.group.visible = false;
            return;
        }
        m.group.visible = true;

        const freq = (isSelected || isHovered) ? 8 : 3;
        const pulseScale = 1 + Math.sin(time * freq) * 0.35;
        
        if (isSelected || isHovered) {
            m.group.scale.set(pulseScale, pulseScale, pulseScale);
            m.core.material.color.set(isSelected ? 0xffffff : 0x00f2ff);
            m.core.material.emissive.set(0xff8c00);
            m.core.material.emissiveIntensity = 8 + Math.sin(time * 12) * 4;
            if (isSelected) {
                m.beaconParts[0].material.opacity = 0.85 + Math.sin(time * 20) * 0.15; 
                m.beaconParts[1].material.opacity = 0.4 + Math.sin(time * 8) * 0.2;
                m.beacon.scale.y = 1.0 + Math.sin(time * 4) * 0.05;
            }
        } else {
            m.group.scale.set(1, 1, 1);
            m.ring.scale.set(pulseScale, pulseScale, pulseScale);
            m.core.material.color.copy(m.baseColor);
            m.core.material.emissive.copy(m.baseColor);
            m.core.material.emissiveIntensity = 3;
            m.beaconParts.forEach(p => p.material.opacity = 0);
        }
    });

    stars.rotation.y += 0.00005;
    renderer.render(scene, camera);
}

window.onload = init;