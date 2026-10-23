"""Draw the /hospitality "Where we have worked" plate: coastlines, lakes and a degree grid, like a printed atlas.

Needs no packages. Natural Earth data is public domain; download the 50m files and pass them in:

    python3 script/build_hospitality_atlas.py ne_50m_land.geojson ne_50m_lakes.geojson

Writes client/public/hospitality/atlas-americas.svg. Labels and markers are drawn by the page on top,
so the projection constants below must match ATLAS_* in client/src/pages/AtlaHospitality.tsx.
"""

import json
import math
import sys
from pathlib import Path

# Frame and projection: plate carree with x scaled by cos(32N) so the US and Mexico keep their proportions.
LEFT, RIGHT, TOP, BOTTOM = -124.0, -62.0, 50.0, 14.0
KX = math.cos(math.radians(32))
SCALE = 20.0
WIDTH = (RIGHT - LEFT) * KX * SCALE
HEIGHT = (TOP - BOTTOM) * SCALE
MIN_STEP = 0.9  # drop points closer than this (SVG units) to the previous one

INK = "#1c1f27"
LAND = "#ebe5d8"
PAPER = "#f4f0e8"
OUT = Path(__file__).resolve().parent.parent / "client/public/hospitality/atlas-americas.svg"


def project(lng: float, lat: float) -> tuple[float, float]:
    return (lng - LEFT) * KX * SCALE, (TOP - lat) * SCALE


def rings(path: str):
    for feature in json.loads(Path(path).read_text())["features"]:
        geometry = feature["geometry"]
        polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
        for polygon in polygons:
            yield from polygon


def ring_path(ring, min_area: float = 0.0) -> str:
    lngs = [p[0] for p in ring]
    lats = [p[1] for p in ring]
    if (max(lngs) - min(lngs)) * (max(lats) - min(lats)) < min_area:
        return ""
    margin = 3
    if max(lngs) < LEFT - margin or min(lngs) > RIGHT + margin or max(lats) < BOTTOM - margin or min(lats) > TOP + margin:
        return ""
    points = []
    for lng, lat in ring:
        x, y = project(lng, lat)
        if points and math.hypot(x - points[-1][0], y - points[-1][1]) < MIN_STEP:
            continue
        points.append((x, y))
    if len(points) < 4:
        return ""
    return "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in points) + "Z"


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: build_hospitality_atlas.py <ne_50m_land.geojson> <ne_50m_lakes.geojson>", file=sys.stderr)
        return 2
    land = "".join(ring_path(r) for r in rings(sys.argv[1]))
    # Only the large lakes; small ones read as noise at this scale.
    lakes = "".join(ring_path(r, min_area=1.5) for r in rings(sys.argv[2]))
    if not land:
        print("error: no land inside the frame; check the input file", file=sys.stderr)
        return 1

    grid = []
    for lng in range(-120, -60, 10):
        x, _ = project(lng, 0)
        grid.append(f"M{x:.1f} 0V{HEIGHT:.1f}")
    for lat in range(20, 50, 10):
        _, y = project(0, lat)
        grid.append(f"M0 {y:.1f}H{WIDTH:.1f}")

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH:.0f} {HEIGHT:.0f}">'
        f'<path d="{"".join(grid)}" fill="none" stroke="{INK}" stroke-opacity="0.12" stroke-width="0.6"/>'
        f'<path d="{land}" fill="{LAND}" stroke="{INK}" stroke-opacity="0.55" stroke-width="0.7" stroke-linejoin="round"/>'
        f'<path d="{lakes}" fill="{PAPER}" stroke="{INK}" stroke-opacity="0.4" stroke-width="0.5"/>'
        f'<rect x="0.5" y="0.5" width="{WIDTH - 1:.1f}" height="{HEIGHT - 1:.1f}" fill="none" stroke="{INK}" stroke-opacity="0.6" stroke-width="1"/>'
        "</svg>"
    )
    OUT.write_text(svg)
    print(f"wrote {OUT} ({len(svg) // 1024} KB, {WIDTH:.0f} x {HEIGHT:.0f})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
