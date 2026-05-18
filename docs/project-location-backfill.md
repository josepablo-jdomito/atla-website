# Project Location Backfill

Temporary location overrides are active in [projectService.ts](/Users/josepablo/Documents/Local%20Dev%20Projects/Atla/server/sanity/projectService.ts) so the `Map` view can work before Sanity is fully backfilled.

These exact values should be copied into Sanity for each project:

| Project | Region | Country | Location Name | Latitude | Longitude |
| --- | --- | --- | --- | ---: | ---: |
| The Curated Outfit | Asia | Indonesia | Denpasar, Indonesia | -8.6705 | 115.2126 |
| Casa Colora | America | Mexico | Monterrey, Mexico | 25.6866 | -100.3161 |
| Vyv | America | United States | Miami, United States | 25.7617 | -80.1918 |
| Arc Studio | Middle East | United Arab Emirates | Abu Dhabi, United Arab Emirates | 24.4539 | 54.3773 |
| Tequila Unido | America | United States | Houston, United States | 29.7604 | -95.3698 |
| Rústico | America | Mexico | Cabo San Lucas, Mexico | 22.8905 | -109.9167 |
| Angeles Wellness | America | United States | Los Angeles, United States | 34.0522 | -118.2437 |
| Anything AI | America | United States | New York City, United States | 40.7128 | -74.0060 |
| Atla | America | United States | Austin, United States | 30.2672 | -97.7431 |
| Pax & Beneficia | America | United States | Dallas, United States | 32.7767 | -96.7970 |
| Reggie | America | United States | San Diego, United States | 32.7157 | -117.1611 |
| TigreTigre | America | Mexico | San Luis Potosi, Mexico | 22.1565 | -100.9855 |
| Alma Brava | America | Mexico | Oaxaca, Mexico | 17.0732 | -96.7266 |
| Hanks Leather | America | United States | Albany, United States | 42.6526 | -73.7562 |
| Bovi Health | America | United States | Charlotte, United States | 35.2271 | -80.8431 |
| The Bridge | Asia | Indonesia | Denpasar, Indonesia | -8.6705 | 115.2126 |
| Shop Latinx | America | United States | Santa Monica, United States | 34.0195 | -118.4912 |
| Conscious Care Co | America | Canada | Toronto, Canada | 43.6532 | -79.3832 |
| Oxylife | Middle East | United Arab Emirates | Dubai, United Arab Emirates | 25.2048 | 55.2708 |
| Pathize Health | America | United States | Los Angeles, United States | 34.0522 | -118.2437 |
| Ando | America | United States | New York City, United States | 40.7128 | -74.0060 |
| PuppyPy | America | United States | Los Angeles, United States | 34.0522 | -118.2437 |
| Peachy Patients | America | United States | Los Angeles, United States | 34.0522 | -118.2437 |
| Huémac | America | Mexico | Queretaro, Mexico | 20.5888 | -100.3899 |
| Castro Capital | America | Mexico | San Luis Potosi, Mexico | 22.1565 | -100.9855 |

## Assumptions Used

- `Bali` was normalized to `Denpasar, Indonesia`
- `Los Cabos` was normalized to `Cabo San Lucas, Mexico`
- `New York` was normalized to `New York City, United States`
- `Upstate New York` was normalized to `Albany, United States`

Once Sanity is backfilled, the temporary overrides in `projectService.ts` should be removed.
