/**
 * Richmond Fall Line Map
 * ---------------------
 * Shows the approximate Atlantic Seaboard Fall Line through the Richmond, VA
 * metro area, dividing the Coastal Plain (Tidewater) to the east from the
 * Piedmont to the west.
 *
 * Security notes:
 *  - No eval(), no dynamic code execution
 *  - No XHR/fetch calls (all data is inlined)
 *  - No cookies, localStorage, or user tracking
 *  - Leaflet loaded via SRI-verified CDN bundle (see index.html)
 *
 * Data accuracy:
 *  - The fall line path is APPROXIMATE, derived from published geological maps.
 *    The true boundary is gradational and varies with the underlying bedrock.
 *  - The James River rapids at Belle Isle mark where the river physically crosses
 *    the fall line; this is the most accurate reference point.
 */

'use strict';

/* ─── Map initialization ────────────────────────────────────── */

const map = L.map('map', {
  center: [37.5407, -77.4360],   // Downtown Richmond, VA
  zoom: 11,
  zoomControl: true,
  attributionControl: false,     // custom attribution in the legend panel
});

/* ─── Base tile layer (CARTO Positron — free, no API key) ─────
   Policy: CARTO tiles are free for low-traffic / personal use.
   Attribution required: OSM contributors + CARTO
   ──────────────────────────────────────────────────────────── */
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_matter_all/{z}/{x}/{y}{r}.png', {
  subdomains: ['a', 'b', 'c', 'd'],
  maxZoom: 19,
  tileSize: 256,
  // tileSize and detectRetina improve rendering on high-DPI mobile screens
  detectRetina: true,
}).addTo(map);


/* ─── Data: Fall Line ───────────────────────────────────────────
   The Atlantic Seaboard Fall Line through the greater Richmond metro area.
   Runs roughly NNE–SSW, passing through the James River rapids.
   Key reference: Belle Isle rapids ≈ 37.527°N, 77.467°W

   Coordinates are [longitude, latitude] (GeoJSON standard).
   ────────────────────────────────────────────────────────────── */
const FALL_LINE_GEOJSON = {
  type: 'Feature',
  properties: {
    name: 'Atlantic Seaboard Fall Line',
    note: 'Approximate — based on published USGS geological surveys',
  },
  geometry: {
    type: 'LineString',
    coordinates: [
      [-77.440, 37.760],   // Northern extent — northern Hanover County
      [-77.442, 37.720],   // Ashland / Hanover area
      [-77.445, 37.680],   // Northern Henrico
      [-77.448, 37.650],   // Chamberlayne corridor
      [-77.455, 37.610],   // Near Laurel / Staples Mill
      [-77.460, 37.575],   // North Richmond
      [-77.462, 37.555],   // Near Lombardy / Brook Road
      [-77.463, 37.540],   // Northern downtown / Jackson Ward
      [-77.464, 37.527],   // James River rapids — Belle Isle (most accurate point)
      [-77.463, 37.512],   // Manchester / south bank
      [-77.460, 37.495],   // Southern Richmond / Chesterfield line
      [-77.455, 37.465],   // Northern Chesterfield
      [-77.450, 37.430],   // Central Chesterfield
      [-77.445, 37.390],   // Southern Chesterfield
      [-77.442, 37.350],   // Southern extent — near Colonial Heights
    ],
  },
};


/* ─── Data: Region polygons ─────────────────────────────────────
   Two polygons that cover the Richmond metro bounding box,
   split at the fall line path defined above.

   Coastal Plain (Tidewater) = east of fall line
   Piedmont                  = west of fall line

   The polygons share the fall line as their common boundary.
   Metro bounding box: ~37.35–37.76°N, ~77.25–77.70°W
   ────────────────────────────────────────────────────────────── */

// Extract fall line coords once for reuse in both polygons
const fallLineCoords = FALL_LINE_GEOJSON.geometry.coordinates;
const fallLineReversed = [...fallLineCoords].reverse();

const COASTAL_PLAIN_GEOJSON = {
  type: 'Feature',
  properties: {
    region: 'coastal',
    name: 'Coastal Plain (Tidewater)',
    description: 'East of the fall line. Flat terrain underlain by soft sedimentary deposits. Rivers are tidal and navigable. Historically settled by Powhatan Confederacy and early English colonists.',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      // Start at NE corner, trace west along north edge to fall line top
      [-77.25, 37.760],
      ...fallLineReversed,          // south → north along fall line (east side)
      [-77.25, 37.350],             // SE corner
      [-77.25, 37.760],             // close polygon back to NE corner
    ]],
  },
};

const PIEDMONT_GEOJSON = {
  type: 'Feature',
  properties: {
    region: 'piedmont',
    name: 'Piedmont',
    description: 'West of the fall line. Rolling hills underlain by ancient crystalline bedrock (granite, gneiss, schist). Rivers run fast over rapids. Richmond was founded here at the head of navigation.',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      // Start at NW corner, trace east along north edge to fall line top
      [-77.70, 37.760],
      ...fallLineCoords,            // north → south along fall line (west side)
      [-77.70, 37.350],             // SW corner
      [-77.70, 37.760],             // close polygon back to NW corner
    ]],
  },
};


/* ─── Layer styling ─────────────────────────────────────────── */

const STYLES = {
  coastal: {
    fillColor: '#4682DC',
    fillOpacity: 0.18,
    color: '#4682DC',
    weight: 0,
    interactive: true,
  },
  piedmont: {
    fillColor: '#C88232',
    fillOpacity: 0.18,
    color: '#C88232',
    weight: 0,
    interactive: true,
  },
  fallLine: {
    color: '#e84393',
    weight: 3,
    opacity: 0.9,
    dashArray: null,
    interactive: true,
  },
  regionHover: {
    fillOpacity: 0.32,
  },
};


/* ─── Popup helper ──────────────────────────────────────────── */
function makeRegionPopup(props) {
  const tagClass = props.region;
  return `
    <div class="popup-content">
      <h3>${props.name}</h3>
      <p>${props.description}</p>
      <span class="region-tag ${tagClass}">${props.name}</span>
    </div>
  `;
}

function makeFallLinePopup() {
  return `
    <div class="popup-content">
      <h3>Atlantic Seaboard Fall Line</h3>
      <p>
        The geological boundary between the ancient crystalline rocks of the
        Piedmont and the soft sedimentary deposits of the Coastal Plain.
        Richmond was founded here because it was the furthest inland point
        ships could navigate — the rapids mark where the river drops off the plateau.
      </p>
      <p style="margin-top:6px; color:#888; font-size:0.75rem;">
        This path is approximate. The true boundary is gradational.
      </p>
    </div>
  `;
}


/* ─── Build layers ──────────────────────────────────────────── */

function buildRegionLayer(geojson) {
  const style = STYLES[geojson.properties.region];
  return L.geoJSON(geojson, {
    style,
    onEachFeature(feature, layer) {
      layer.bindPopup(makeRegionPopup(feature.properties), { maxWidth: 260 });
      layer.on('mouseover', function () {
        this.setStyle({ fillOpacity: STYLES.regionHover.fillOpacity });
      });
      layer.on('mouseout', function () {
        this.setStyle({ fillOpacity: style.fillOpacity });
      });
    },
  });
}

const coastalLayer  = buildRegionLayer(COASTAL_PLAIN_GEOJSON);
const piedmontLayer = buildRegionLayer(PIEDMONT_GEOJSON);

const fallLineLayer = L.geoJSON(FALL_LINE_GEOJSON, {
  style: STYLES.fallLine,
  onEachFeature(feature, layer) {
    layer.bindPopup(makeFallLinePopup(), { maxWidth: 260 });
  },
});

// Add to map (regions first so fall line renders on top)
coastalLayer.addTo(map);
piedmontLayer.addTo(map);
fallLineLayer.addTo(map);


/* ─── Layer toggle controls ─────────────────────────────────── */

document.getElementById('toggle-regions').addEventListener('change', function () {
  if (this.checked) {
    map.addLayer(coastalLayer);
    map.addLayer(piedmontLayer);
  } else {
    map.removeLayer(coastalLayer);
    map.removeLayer(piedmontLayer);
  }
});

document.getElementById('toggle-fallline').addEventListener('change', function () {
  if (this.checked) {
    map.addLayer(fallLineLayer);
  } else {
    map.removeLayer(fallLineLayer);
  }
});


/* ─── Fit map to Richmond area on load ──────────────────────── */
map.fitBounds([
  [37.42, -77.60],   // SW — western Henrico / Chesterfield
  [37.65, -77.25],   // NE — eastern Henrico / New Kent border
]);
