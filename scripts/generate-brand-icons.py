from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / 'brand/AIxDesign-Brand-Kit/exports/logos/aixdesign-profile-1024.png'
image = Image.open(source).convert('RGBA')
image.resize((512, 512), Image.Resampling.LANCZOS).save(root / 'app/icon.png')
image.resize((180, 180), Image.Resampling.LANCZOS).save(root / 'app/apple-icon.png')
image.save(root / 'app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

for relative in ('app/icon.png', 'app/apple-icon.png', 'app/favicon.ico'):
    output = Image.open(root / relative)
    print(relative, output.size, output.format)
