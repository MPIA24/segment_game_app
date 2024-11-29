maptilersdk.config.apiKey = 'IOB0c3pObw5n5M6qkQcE';

async function fetchAllPoi() {
    try {
        const response = await fetch('http://localhost:8000/api/batiments', {
            method: 'GET',
            headers: {
                'Origin': 'http://127.0.0.1:5500',
                'Accept': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des POIs:', error);
        throw error;
    }
}

function getGeoJsonFromJson(data) {
    if (!data || !data.batiments || !Array.isArray(data.batiments)) {
        throw new Error("Données invalides : la structure du JSON est incorrecte.");
    }

    const geoJson = {
        type: "FeatureCollection",
        features: data.batiments.map(batiment => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [batiment.longitude, batiment.latitude],
            },
            properties: {
                id: batiment.id,
                name: batiment.name,
                description: batiment.description,
                created_at: batiment.created_at,
                updated_at: batiment.updated_at,
            }
        }))
    };
    return geoJson;
}

async function getPOI() {
    const data = await fetchAllPoi();
    return getGeoJsonFromJson(data);
}

// Fonction pour ajouter des POIs dans les chapitres
async function populateChapters() {
    const geoJson = await getPOI();
    
    let chapters = {};

    geoJson.features.forEach((feature, index) => {
        const { properties } = feature;
        const { id, name } = properties;

        // Créer un chapitre pour chaque POI
        chapters[name] = {
            bearing: 0,  // L'angle de rotation (à ajuster selon le POI)
            center: feature.geometry.coordinates,  // Coordonnées de chaque POI
            zoom: 16,  // Le niveau de zoom (à ajuster en fonction du besoin)
            pitch: 20, // Inclinaison de la caméra (ajuster au besoin)
        };
    });

    return chapters;
}

// Map initialisation
var map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [-0.38, 49.17],
    zoom: 12,
});

// Ajouter la logique d'interaction des chapitres
function createBuildingDescription(batiment) {
    const section = document.createElement('section');
    section.id = batiment.id;

    const h3 = document.createElement('h3');
    h3.textContent = batiment.name;

    const p = document.createElement('p');
    p.textContent = batiment.description;

    // Ajouter les éléments créés dans la section
    section.appendChild(h3);
    section.appendChild(p);

    return section;
}

// Fonction pour peupler la page avec les descriptions des bâtiments
async function populateChapters() {
    const geoJson = await getPOI();
    
    let chapters = {};

    geoJson.features.forEach((feature, index) => {
        const { properties } = feature;
        const { id, name } = properties;

        // Créer un chapitre pour chaque POI, en utilisant l'ID du bâtiment pour la gestion des chapitres
        chapters[id] = {
            bearing: 0,  // L'angle de rotation (à ajuster selon le POI)
            center: feature.geometry.coordinates,  // Coordonnées de chaque POI
            zoom: 16,  // Le niveau de zoom (à ajuster en fonction du besoin)
            pitch: 20, // Inclinaison de la caméra (ajuster au besoin)
        };
    });

    return chapters;
}

// Fonction pour ajouter une description pour chaque bâtiment
function createBuildingDescription(batiment) {
    const section = document.createElement('section');
    const id = batiment.id;  // Utiliser l'ID du bâtiment comme ID de la section
    section.id = id;

    const h3 = document.createElement('h3');
    h3.textContent = batiment.name;

    const p = document.createElement('p');
    p.textContent = batiment.description;

    // Ajouter les éléments créés dans la section
    section.appendChild(h3);
    section.appendChild(p);

    return section;
}

// Fonction pour peupler la page avec les descriptions des bâtiments
async function populateBuildingDescriptions() {
    try {
        // Récupérer les POIs (points d'intérêt)
        const data = await fetchAllPoi();
        const geoJson = getGeoJsonFromJson(data);

        // Sélectionner un conteneur pour ajouter les sections
        const container = document.getElementById("features");

        // Créer les sections pour chaque bâtiment et les ajouter au DOM
        geoJson.features.forEach((feature) => {
            const batiment = feature.properties;
            const descriptionSection = createBuildingDescription(batiment);

            // Ajouter la section au conteneur
            container.appendChild(descriptionSection);
        });
    } catch (error) {
        console.error('Erreur lors de la création des descriptions:', error);
    }
}

// Map initialisation
var map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [-0.38, 49.17],
    zoom: 12,
});

// Initialisation de la map et des interactions
map.on('load', async function () {
    const chapters = await populateChapters();  // Charger dynamiquement les chapitres depuis les POIs
    var activeChapterId = Object.keys(chapters)[0];  // Le premier POI sera le chapitre actif initialement

    // Configurer les 3D buildings
    var layers = map.getStyle().layers;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            map.removeLayer(layers[i].id);
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
        }
    });

    // Logic for changing the map view based on scroll
    window.onscroll = function () {
        var chapterIds = Object.keys(chapters);
        for (var i = 0; i < chapterIds.length; i++) {
            var chapterId = chapterIds[i];
            if (isElementOnScreen(chapterId)) {
                setActiveChapter(chapterId);
                break;
            }
        }
    };

    function setActiveChapter(chapterId) {
        if (chapterId === activeChapterId) return;

        map.flyTo(chapters[chapterId]);

        document.getElementById(chapterId).setAttribute('class', 'active');
        document.getElementById(activeChapterId).setAttribute('class', '');

        activeChapterId = chapterId;
    }

    function isElementOnScreen(id) {
        var element = document.getElementById(id);
        if (!element) return false; // Sécuriser l'accès à l'élément
        var bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
    }
});

// Appeler la fonction pour peupler les descriptions au chargement de la page
window.onload = function() {
    populateBuildingDescriptions();
};