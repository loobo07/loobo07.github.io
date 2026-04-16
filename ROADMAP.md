# Ridge to Coast — Roadmap

## Phase 1 — Complete ✅

All merged to `master`. 280 unit tests · 85 E2E tests.

- 6 region polygons: Coastal Plain, Piedmont, Blue Ridge, Valley & Ridge, NE Upland, NE Coastal, Gulf Coastal Plain
- 21+ city markers · native plants + soil + invasive species per region · planting calendar per zone
- Rivers interactive layer · hardiness zones 22 states · hash routing detail pages
- `data/regions.geojson` async fetch architecture (EPA-ready)

---

## Phase 2 — Living Data

Free public APIs + OpenStreetMap. No backend required.

| # | Title | Labels |
|---|---|---|
| [#11](https://github.com/loobo07/loobo07.github.io/issues/11) | NWS frost advisory — "Plant now?" in zone detail pages | `phase-2` `api-integration` |
| [#12](https://github.com/loobo07/loobo07.github.io/issues/12) | Location report page (`#detail/location/lat/lon`) | `phase-2` |
| [#13](https://github.com/loobo07/loobo07.github.io/issues/13) | USGS streamflow status on river detail pages | `phase-2` `api-integration` |
| [#14](https://github.com/loobo07/loobo07.github.io/issues/14) | Community gardens + native plant nurseries layer (OpenStreetMap) | `phase-2` `data` |
| [#15](https://github.com/loobo07/loobo07.github.io/issues/15) | iNaturalist recent observations badge per region | `phase-2` `api-integration` |
| [#16](https://github.com/loobo07/loobo07.github.io/issues/16) | Watershed delineation — click map to see contributing watershed | `phase-2` `api-integration` |
| [#17](https://github.com/loobo07/loobo07.github.io/issues/17) | PWA service worker — offline map access | `phase-2` `pwa` |

---

## Phase 3 — REST API

Serverless (Cloudflare Workers). Spec-first: write #18 before implementing #19–#22.

| # | Title | Labels |
|---|---|---|
| [#18](https://github.com/loobo07/loobo07.github.io/issues/18) | OpenAPI spec for Ridge to Coast REST API v1 | `phase-3` `spec` |
| [#19](https://github.com/loobo07/loobo07.github.io/issues/19) | `/api/v1/ecoregion` — point-in-polygon lookup endpoint | `phase-3` `api` |
| [#20](https://github.com/loobo07/loobo07.github.io/issues/20) | `/api/v1/calendar` — planting calendar by zone and month | `phase-3` `api` |
| [#21](https://github.com/loobo07/loobo07.github.io/issues/21) | `/api/v1/plants` — native plants by region and type | `phase-3` `api` |
| [#22](https://github.com/loobo07/loobo07.github.io/issues/22) | Embeddable ecoregion widget (iframe snippet) | `phase-3` `enhancement` |

---

## Phase 4 — Platform

| # | Title | Labels |
|---|---|---|
| [#23](https://github.com/loobo07/loobo07.github.io/issues/23) | PWA install prompt + GPS field mode | `phase-4` `pwa` |
| [#24](https://github.com/loobo07/loobo07.github.io/issues/24) | Watershed steward education module | `phase-4` `education` |
| [#25](https://github.com/loobo07/loobo07.github.io/issues/25) | Institutional organization accounts (custom `?layer=` GeoJSON) | `phase-4` `enhancement` |
| [#26](https://github.com/loobo07/loobo07.github.io/issues/26) | Grant targets and funding strategy | `phase-4` `funding` |

---

## Architecture reference

```
lib/geo-data.js          all data constants + HTML builders (no Leaflet/DOM)
map.js                   Leaflet init; fetches data/regions.geojson + data/hardiness.geojson
data/regions.geojson     7-feature FeatureCollection (async-loaded region polygons)
data/hardiness.geojson   22-state hardiness zones

Test commands:
  node --test tests/geo.test.js
  python3 -m http.server 8765 &
  python3 -m pytest tests/e2e/ --base-url http://localhost:8765
```
