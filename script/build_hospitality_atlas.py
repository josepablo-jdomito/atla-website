"""Draw the /hospitality "Where we have worked" plates: coastlines, lakes and a degree grid, like a printed atlas.

Needs no packages. Natural Earth data is public domain; download the 50m files and pass them in:

    python3 script/build_hospitality_atlas.py ne_50m_land.geojson ne_50m_lakes.geojson

Writes one SVG per plate in client/public/hospitality/ (atlas-americas.svg, atlas-gulf.svg, atlas-bali.svg).
Labels and markers are drawn by the page on top, so PLATES below must match ATLAS_PLATES in
client/src/pages/AtlaHospitality.tsx.
"""

import json
import math
import sys
from pathlib import Path

# Each plate is plate carree with x scaled by cos(reference latitude) so the land keeps its proportions.
PLATES = {
    "americas": {"left": -124.0, "right": -62.0, "top": 50.0, "bottom": 14.0, "ref_lat": 32.0, "scale": 20.0, "grid": 10},
    "gulf": {"left": 47.0, "right": 61.0, "top": 28.0, "bottom": 21.0, "ref_lat": 25.0, "scale": 40.0, "grid": 5},
    "bali": {"left": 111.0, "right": 120.0, "top": -5.5, "bottom": -10.5, "ref_lat": -8.0, "scale": 44.0, "grid": 5},
}
MIN_STEP = 0.9  # drop points closer than this (SVG units) to the previous one

INK = "#111111"
LAND = "#ebe5d8"
PAPER = "#f4f0e8"
OUT_DIR = Path(__file__).resolve().parent.parent / "client/public/hospitality"


def rings(path: str):
    for feature in json.loads(Path(path).read_text())["features"]:
        geometry = feature["geometry"]
        polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
        for polygon in polygons:
            yield from polygon


def draw_plate(plate: dict, land_rings: list, lake_rings: list) -> tuple[str, float, float]:
    kx = math.cos(math.radians(plate["ref_lat"]))
    scale = plate["scale"]
    width = (plate["right"] - plate["left"]) * kx * scale
    height = (plate["top"] - plate["bottom"]) * scale

    def project(lng: float, lat: float) -> tuple[float, float]:
        return (lng - plate["left"]) * kx * scale, (plate["top"] - lat) * scale

    def ring_path(ring, min_area: float = 0.0) -> str:
        lngs = [p[0] for p in ring]
        lats = [p[1] for p in ring]
        if (max(lngs) - min(lngs)) * (max(lats) - min(lats)) < min_area:
            return ""
        margin = 3
        if (
            max(lngs) < plate["left"] - margin
            or min(lngs) > plate["right"] + margin
            or max(lats) < plate["bottom"] - margin
            or min(lats) > plate["top"] + margin
        ):
            return ""
        points = []
        for lng, lat in ring:
            # Clamp to just outside the frame: the visible coastline is unchanged and far-off
            # continents collapse onto the edge, which keeps the file small.
            lng = min(max(lng, plate["left"] - 0.5), plate["right"] + 0.5)
            lat = min(max(lat, plate["bottom"] - 0.5), plate["top"] + 0.5)
            x, y = project(lng, lat)
            if points and math.hypot(x - points[-1][0], y - points[-1][1]) < MIN_STEP:
                continue
            points.append((x, y))
        if len(points) < 4:
            return ""
        return "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in points) + "Z"

    land = "".join(ring_path(r) for r in land_rings)
    # Only the large lakes; small ones read as noise at this scale.
    lakes = "".join(ring_path(r, min_area=1.5) for r in lake_rings)

    step = plate["grid"]
    grid = []
    for lng in range(math.ceil(plate["left"] / step) * step, int(plate["right"]) + 1, step):
        x, _ = project(lng, 0)
        if 0 < x < width:
            grid.append(f"M{x:.1f} 0V{height:.1f}")
    for lat in range(math.ceil(plate["bottom"] / step) * step, int(plate["top"]) + 1, step):
        _, y = project(0, lat)
        if 0 < y < height:
            grid.append(f"M0 {y:.1f}H{width:.1f}")

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height:.0f}">'
        f'<path d="{"".join(grid)}" fill="none" stroke="{INK}" stroke-opacity="0.12" stroke-width="0.6"/>'
        f'<path d="{land}" fill="{LAND}" stroke="{INK}" stroke-opacity="0.55" stroke-width="0.7" stroke-linejoin="round"/>'
        f'<path d="{lakes}" fill="{PAPER}" stroke="{INK}" stroke-opacity="0.4" stroke-width="0.5"/>'
        f'<rect x="0.5" y="0.5" width="{width - 1:.1f}" height="{height - 1:.1f}" fill="none" stroke="{INK}" stroke-opacity="0.6" stroke-width="1"/>'
        "</svg>"
    )
    return svg, width, height


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: build_hospitality_atlas.py <ne_50m_land.geojson> <ne_50m_lakes.geojson>", file=sys.stderr)
        return 2
    land_rings = list(rings(sys.argv[1]))
    lake_rings = list(rings(sys.argv[2]))
    for name, plate in PLATES.items():
        svg, width, height = draw_plate(plate, land_rings, lake_rings)
        if "<path d=\"\"" in svg.split("fill=\"#ebe5d8\"")[0][-40:]:
            print(f"error: no land inside the {name} plate; check the input file", file=sys.stderr)
            return 1
        out = OUT_DIR / f"atlas-{name}.svg"
        out.write_text(svg)
        print(f"wrote {out.name} ({len(svg) // 1024} KB, {width:.0f} x {height:.0f})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
