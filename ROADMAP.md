# Ridge to Coast — Roadmap

## Phase 1 — Complete ✅
> 6 regions · 21+ cities · 22 states · 280 unit tests · 85 E2E tests

---

## Phase 2 — Living Data
*Free public APIs and OpenStreetMap. No backend required.*

| Issue | Feature |
|---|---|
| [#11](../../issues/11) | "Plant now?" frost advisory via NWS API |
| [#12](../../issues/12) | Location report page (`#detail/location/lat/lon`) |
| [#13](../../issues/13) | USGS streamflow on river detail pages |
| [#14](../../issues/14) | Community gardens layer (OpenStreetMap) |
| [#15](../../issues/15) | iNaturalist observation badge per region |
| [#16](../../issues/16) | Watershed delineation on map click |
| [#17](../../issues/17) | PWA service worker (offline access) |

---

## Phase 3 — REST API
*Cloudflare Workers. Start with the spec (#18) before any endpoint work.*

| Issue | Feature |
|---|---|
| [#18](../../issues/18) | OpenAPI spec (`api/openapi.yaml`) |
| [#19](../../issues/19) | `GET /api/v1/ecoregion?lat=&lon=` |
| [#20](../../issues/20) | `GET /api/v1/calendar?zone=&month=` |
| [#21](../../issues/21) | `GET /api/v1/plants?region=&type=` |
| [#22](../../issues/22) | Embeddable region widget (`widget.html`) |

---

## Phase 4 — Platform

| Issue | Feature |
|---|---|
| [#23](../../issues/23) | PWA install + GPS field mode |
| [#24](../../issues/24) | Watershed steward education module |
| [#25](../../issues/25) | Custom org layer (`?layer=` GeoJSON param) |
| [#26](../../issues/26) | Grant targets (USDA · EPA · NSF) |

---

## Dev reference
```bash
node --test tests/geo.test.js
python3 -m http.server 8765 &
python3 -m pytest tests/e2e/ --base-url http://localhost:8765
```
