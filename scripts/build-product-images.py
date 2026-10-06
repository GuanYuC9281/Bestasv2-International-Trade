"""Refresh recommendation thumbnails from the two company websites.

Requires Pillow. Each image remains at or below its source resolution and is
stored locally so recommendation cards do not depend on third-party hotlinks.
"""

import io
import json
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "product-images"
SOURCES = {
    "bag": "https://bestasv.com/images/products/equipment/bag-filter-collector.png",
    "cartridge": "https://bestasv.com/images/products/equipment/cartridge-collector.png",
    "cyclone": "https://bestasv.com/images/products/equipment/cyclone-collector.png",
    "esp": "https://bestasv.com/images/products/building/electrostatic-main.png",
    "scrubber": "https://bestasv.com/images/products/air-pollution/pp-spray-tower.png",
    "chemical-wash": "https://bestasv.com/images/products/air-pollution/chemical-gas-main.png",
    "carbon": "https://bestasv.com/images/products/equipment/activated-carbon-filter.png",
    "oil-wash": "https://bestasv.com/images/products/air-pollution/oil-smoke-main.png",
    "fan": "https://bestasv.com/images/products/fans/high-pressure-backward-curved.png",
    "hp-forward": "https://bestasv.com/images/products/fans/high-pressure-forward-curved.png",
    "medium-backward": "https://bestasv.com/images/products/fans/medium-pressure-backward-curved-1.png",
    "axial": "https://bestasv.com/images/products/fans/fan_product_05.png",
    "duct": "https://bestasv.com/images/products/ventilation-parts/rectangular-duct.png",
    "paint": "https://bestasv.com/images/products/air-pollution/paint-dust-main.png",
    "multi-cyclone": "https://www.codanh.com/products/dry_air_filtration/multi-cyclone.webp",
    "wet-dust": "https://www.codanh.com/products/wet_air_filtration/metal-grinding.webp",
    "wet-cyclone": "https://www.codanh.com/products/wet_air_filtration/wet-cyclone.webp",
    "rto": "https://www.codanh.com/products/dry_air_filtration/RTO.webp",
    "radial": "https://www.codanh.com/products/fans/quat-ly-tam-canh-cong-huong-kinh.webp",
    "frp": "https://www.codanh.com/products/anti-corrosion/FRP_Fan.webp",
    "oil-esp": "https://www.codanh.com/products/dry_air_filtration/may-loc-tinh-dien.webp",
}


def main():
    OUTPUT.mkdir(exist_ok=True)
    manifest = {}
    for name, url in SOURCES.items():
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=30) as response:
            source = response.read()
        image = ImageOps.exif_transpose(Image.open(io.BytesIO(source)))
        original = image.size
        image.thumbnail((960, 720), Image.Resampling.LANCZOS)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        destination = OUTPUT / f"{name}.webp"
        image.save(destination, "WEBP", quality=83, method=6)
        manifest[name] = {
            "source": url,
            "sourcePixels": list(original),
            "savedPixels": list(image.size),
        }
        print(f"{name}: {original} -> {image.size}, {destination.stat().st_size:,} bytes")
    (OUTPUT / "sources.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
