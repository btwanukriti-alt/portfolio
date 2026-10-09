# Textured grounds for the hero tiles, in each project's palette (the same families as the
# earlier hero covers: grain gradients, sunburst, paper cut-outs, watercolour sky, space).
#   python3 scripts/mockups/hero/textures.py <out dir>
import sys, math
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

W, H = 1080, 720
OUT = sys.argv[1]
rng = np.random.default_rng(7)
hexrgb = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)

def lowfreq(scale, seed):
    r = np.random.default_rng(seed)
    small = Image.fromarray((r.random((max(2, H // scale), max(2, W // scale))) * 255).astype(np.uint8))
    big = small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(scale / 1.6))
    a = np.asarray(big, float) / 255
    return (a - a.min()) / (a.max() - a.min() + 1e-9)

def grain(img, amt, seed=1):
    r = np.random.default_rng(seed)
    n = r.normal(0, amt, (H, W, 1))
    return np.clip(img + n, 0, 255)

def save(a, name):
    Image.fromarray(a.astype(np.uint8)).save(f'{OUT}/{name}.png')

def mesh(blobs, base, seed):
    yy, xx = np.mgrid[0:H, 0:W] / np.array([H, W]).reshape(2, 1, 1)
    img = np.ones((H, W, 3)) * hexrgb(base)
    warp = lowfreq(160, seed) - 0.5
    for c, x, y, r in blobs:
        d = np.sqrt(((xx - x) * 1.5) ** 2 + (yy - y + warp * 0.35) ** 2) / r
        k = np.clip(1 - d, 0, 1) ** 1.6
        img = img * (1 - k[..., None]) + hexrgb(c) * k[..., None]
    return img

# Grain gradients (risograph-like): heavy grain over a warped multi-stop mesh.
def grainy(name, base, blobs, seed, amt=26):
    save(grain(mesh(blobs, base, seed), amt, seed), name)

# Sunburst rays with grain.
def rays(name, c1, c2, cx, cy, n, seed):
    img = Image.new('RGB', (W, H), c1)
    d = ImageDraw.Draw(img)
    R = 2000
    for i in range(n):
        a0 = 2 * math.pi * i / n
        a1 = a0 + math.pi / n
        d.polygon([(cx, cy), (cx + R * math.cos(a0), cy + R * math.sin(a0)), (cx + R * math.cos(a1), cy + R * math.sin(a1))], fill=c2)
    a = np.asarray(img, float)
    v = lowfreq(300, seed)[..., None]
    a = a * (0.86 + 0.24 * v)
    save(grain(a, 18, seed), name)

# Paper cut-outs: flat shapes with paper fibre and grain.
def paper(name, base, shapes, seed):
    img = Image.new('RGB', (W, H), base)
    d = ImageDraw.Draw(img)
    for kind, col, box in shapes:
        (d.ellipse if kind == 'circle' else d.polygon)(box, fill=col)
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    a = np.asarray(img, float)
    fib = lowfreq(18, seed)[..., None] - 0.5
    a = a * (1 + fib * 0.10)
    save(grain(a, 16, seed), name)

# Watercolour sky: wavy bands, bleeding edges.
def sky(name, bands, seed):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    w1 = lowfreq(90, seed) - 0.5
    w2 = lowfreq(30, seed + 1) - 0.5
    t = (yy / H) + w1 * 0.22 + w2 * 0.05 + np.sin(xx / W * 6 + seed) * 0.03
    img = np.zeros((H, W, 3))
    stops = [(p, hexrgb(c)) for p, c in bands]
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        k = np.clip((t - p0) / (p1 - p0), 0, 1)[..., None]
        m = ((t >= p0) & (t < p1))[..., None] if p1 < stops[-1][0] else (t >= p0)[..., None]
        img = np.where(m, c0 * (1 - k) + c1 * k, img)
    img = np.where((t < stops[0][0])[..., None], stops[0][1], img)
    streak = lowfreq(12, seed + 2)[..., None] - 0.5
    img = img * (1 + streak * 0.12)
    save(grain(img, 12, seed), name)

# Space: nebula clouds and stars.
def space(name, base, c1, c2, seed):
    n1 = lowfreq(220, seed) ** 2.2
    n2 = lowfreq(120, seed + 5) ** 2.6
    img = hexrgb(base) * np.ones((H, W, 3))
    img = img + (hexrgb(c1) - hexrgb(base)) * n1[..., None] * 0.9 + (hexrgb(c2) - hexrgb(base)) * n2[..., None] * 0.7
    r = np.random.default_rng(seed)
    stars = r.random((H, W)) > 0.9985
    img[stars] = 255 * r.uniform(0.5, 1, (stars.sum(), 1))
    a = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    glow = a.filter(ImageFilter.GaussianBlur(1.2))
    a = np.maximum(np.asarray(a, float), np.asarray(glow, float) * 1.4)
    save(grain(a, 10, seed), name)


def supersample(draw_fn, bg, k=2):
    img = Image.new('RGB', (W * k, H * k), bg)
    draw_fn(ImageDraw.Draw(img), k)
    return np.asarray(img.resize((W, H), Image.LANCZOS), float)

def lerpc(a, b, t):
    return tuple(int(x + (y - x) * t) for x, y in zip(hexrgb(a), hexrgb(b)))

# Halftone: a dot grid whose dots grow and change colour across the tile.
def halftone(name, bg, c0, c1, seed):
    def draw(d, k):
        step = 22 * k
        for gy in range(0, H * k + step, step):
            for gx in range(0, W * k + step, step):
                ox = step / 2 if (gy // step) % 2 else 0
                x, y = gx + ox, gy
                t = min(1, max(0, (x / (W * k)) * 0.6 + (1 - y / (H * k)) * 0.4))
                r = step * (0.08 + 0.42 * t)
                d.ellipse((x - r, y - r, x + r, y + r), fill=lerpc(c0, c1, t))
    save(grain(supersample(draw, bg), 10, seed), name)

# Memphis: confetti of squiggles, rings, triangles and plus signs.
def memphis(name, bg, cols, seed):
    r = np.random.default_rng(seed)
    def draw(d, k):
        for i in range(64):
            c = cols[i % len(cols)]
            x, y = r.uniform(0, W * k), r.uniform(0, H * k)
            s = r.uniform(22, 46) * k
            kind = i % 5
            if kind == 0:
                pts = [(x + j * s * 0.35, y + math.sin(j * 1.3) * s * 0.4) for j in range(9)]
                d.line(pts, fill=c, width=int(5 * k), joint='curve')
            elif kind == 1:
                d.ellipse((x - s, y - s, x + s, y + s), outline=c, width=int(5 * k))
            elif kind == 2:
                d.polygon([(x, y - s), (x + s, y + s * 0.8), (x - s, y + s * 0.8)], fill=c)
            elif kind == 3:
                d.line((x - s, y, x + s, y), fill=c, width=int(6 * k)); d.line((x, y - s, x, y + s), fill=c, width=int(6 * k))
            else:
                for a in range(3):
                    for b in range(3):
                        d.ellipse((x + a * 12 * k - 3 * k, y + b * 12 * k - 3 * k, x + a * 12 * k + 3 * k, y + b * 12 * k + 3 * k), fill=c)
    save(grain(supersample(draw, bg), 9, seed), name)

# Topographic contour lines over a glow.
def topo(name, bg, line, glow, seed):
    n = lowfreq(260, seed) * 0.7 + lowfreq(120, seed + 3) * 0.3
    f = (n * 14) % 1
    lines = np.clip(1 - np.abs(f - 0.5) / 0.06, 0, 1)[..., None]
    yy, xx = np.mgrid[0:H, 0:W]
    g = np.clip(1 - np.hypot((xx - W * 0.8) / W, (yy - H * 0.15) / H) / 0.7, 0, 1)[..., None] ** 1.5
    img = hexrgb(bg) * (1 - g) + hexrgb(glow) * g
    img = img * (1 - lines * 0.8) + hexrgb(line) * lines * 0.8
    save(grain(img, 12, seed), name)

# Terrazzo: stone chips on a soft ground.
def terrazzo(name, bg, cols, seed):
    r = np.random.default_rng(seed)
    def draw(d, k):
        for i in range(260):
            x, y = r.uniform(0, W * k), r.uniform(0, H * k)
            s = r.choice([5, 8, 12, 20, 30]) * k
            n = r.integers(4, 7)
            pts = [(x + math.cos(a) * s * r.uniform(0.5, 1.1), y + math.sin(a) * s * r.uniform(0.5, 1.1)) for a in np.sort(r.uniform(0, 2 * math.pi, n))]
            d.polygon(pts, fill=cols[i % len(cols)])
    save(grain(supersample(draw, bg), 8, seed), name)

# Synthwave: striped sun over a perspective grid.
def synthwave(name, sky0, sky1, sun0, sun1, gridc, floor, seed):
    def draw(d, k):
        hz = int(H * k * 0.58)
        for y in range(hz):
            d.line((0, y, W * k, y), fill=lerpc(sky0, sky1, y / hz))
        cx, cy, R = W * k * 0.5, hz, 230 * k
        for y in range(int(cy - R), int(cy)):
            t = (y - (cy - R)) / R
            if t > 0.45 and int((y - cy) / (9 * k)) % 2 == 0:
                continue
            w = math.sqrt(max(0, R * R - (y - cy) ** 2))
            d.line((cx - w, y, cx + w, y), fill=lerpc(sun0, sun1, t))
        d.rectangle((0, hz, W * k, H * k), fill=floor)
        for i in range(-24, 25):
            d.line((cx + i * 40 * k, hz, cx + i * 260 * k, H * k), fill=gridc, width=int(2 * k))
        for j in range(1, 14):
            y = hz + (H * k - hz) * (j / 13) ** 2.2
            d.line((0, y, W * k, y), fill=gridc, width=int(2 * k))
    save(grain(supersample(draw, sky0), 10, seed), name)

# Op-art ripples: rings from two centres.
def ripples(name, c0, c1, c2, seed):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    d1 = np.hypot(xx - W * 0.15, yy - H * 0.9)
    d2 = np.hypot(xx - W * 0.92, yy - H * 0.05)
    v = np.sin(d1 / 16) + np.sin(d2 / 22)
    img = np.where((v > 0)[..., None], hexrgb(c0), hexrgb(c1))
    core = (np.minimum(d1, d2) < 70)[..., None]
    img = np.where(core, hexrgb(c2), img)
    a = Image.fromarray(img.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    save(grain(np.asarray(a, float), 10, seed), name)

# Groovy waves: stacked wavy stripes.
def waves(name, cols, seed):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    t = yy + np.sin(xx / 120 + 1) * 46 + np.sin(xx / 47) * 10 + xx * 0.25
    band = ((t / 62).astype(int)) % len(cols)
    pal = np.array([hexrgb(c) for c in cols])
    a = Image.fromarray(pal[band].astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    save(grain(np.asarray(a, float), 10, seed), name)

# Pixel mosaic: a dithered gradient of square tiles with gaps.
def pixels(name, gap, c0, c1, c2, seed):
    r = np.random.default_rng(seed)
    def draw(d, k):
        s = 36 * k
        for gy in range(0, H * k, s):
            for gx in range(0, W * k, s):
                t = gx / (W * k) * 0.7 + gy / (H * k) * 0.3 + r.normal(0, 0.08)
                t = min(1, max(0, t))
                c = lerpc(c0, c1, t / 0.5) if t < 0.5 else lerpc(c1, c2, (t - 0.5) / 0.5)
                if r.random() < 0.12:
                    c = tuple(int(v * 0.7) for v in c)
                d.rounded_rectangle((gx + 3 * k, gy + 3 * k, gx + s - 3 * k, gy + s - 3 * k), radius=5 * k, fill=c)
    save(grain(supersample(draw, gap), 8, seed), name)

# Layered hills under a sun.
def hills(name, sky0, sky1, sun, layers, seed):
    def draw(d, k):
        for y in range(H * k):
            d.line((0, y, W * k, y), fill=lerpc(sky0, sky1, y / (H * k)))
        d.ellipse((W * k * 0.66, H * k * 0.12, W * k * 0.66 + 150 * k, H * k * 0.12 + 150 * k), fill=sun)
        for i, c in enumerate(layers):
            base = H * k * (0.42 + i * 0.14)
            pts = [(x, base + math.sin(x / (W * k) * (3 + i) + i * 1.7) * 50 * k + math.sin(x / (W * k) * 11 + i) * 12 * k) for x in range(0, W * k + 20, 20)]
            d.polygon([(0, H * k)] + pts + [(W * k, H * k)], fill=c)
    save(grain(supersample(draw, sky0), 12, seed), name)

# Aurora: light curtains over a night sky, with stars.
def aurora(name, sky, c0, c1, seed):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    centre = H * 0.42 + np.sin(xx / 170 + seed) * 80 + np.sin(xx / 60) * 18
    band = np.exp(-((yy - centre) / 120) ** 2)
    streak = lowfreq(10, seed)[..., None]
    rays_ = (0.6 + 0.4 * np.sin(xx / 9 + lowfreq(80, seed + 1) * 20))[..., None]
    mixc = np.clip((xx / W)[..., None], 0, 1)
    col = hexrgb(c0) * (1 - mixc) + hexrgb(c1) * mixc
    img = hexrgb(sky) * np.ones((H, W, 3)) * (0.7 + 0.3 * (1 - yy / H))[..., None]
    k = (band[..., None] * rays_ * (0.7 + 0.3 * streak)) * np.clip((centre[..., None] + 60 - yy[..., None]) / 160 + 0.6, 0, 1)
    img = img * (1 - np.clip(k * 1.25, 0, 1)) + col * np.clip(k * 1.25, 0, 1)
    r = np.random.default_rng(seed)
    stars = (r.random((H, W)) > 0.9988) & (band < 0.3)
    img[stars] = 230
    save(grain(img, 10, seed), name)

# Bauhaus: a grid of bold quarter circles, halves and squares.
def bauhaus(name, bg, cols, seed):
    r = np.random.default_rng(seed)
    def draw(d, k):
        s = 180 * k
        for gy in range(0, H * k, s):
            for gx in range(0, W * k, s):
                c = cols[r.integers(len(cols))]
                c2 = cols[r.integers(len(cols))]
                d.rectangle((gx, gy, gx + s, gy + s), fill=c2 if r.random() < 0.35 else bg)
                kind = r.integers(4)
                cx, cy = gx + s * r.integers(2), gy + s * r.integers(2)
                if kind == 0:
                    d.pieslice((cx - s, cy - s, cx + s, cy + s), 0, 360, fill=c)
                elif kind == 1:
                    d.ellipse((gx + s * 0.18, gy + s * 0.18, gx + s * 0.82, gy + s * 0.82), fill=c)
                elif kind == 2:
                    d.polygon([(gx, gy + s), (gx + s, gy + s), (gx + s * (r.integers(2)), gy)], fill=c)
                else:
                    d.pieslice((gx - s * 0.5 + s * 0.5, gy, gx + s * 1.0, gy + s), 90, 270, fill=c)
    save(grain(supersample(draw, bg), 12, seed), name)

# Blend a finished pattern toward its ground so it reads as texture, not artwork.
def soften(name, base, amt):
    a = np.asarray(Image.open(f'{OUT}/{name}.png').convert('RGB'), float)
    save(a * (1 - amt) + hexrgb(base) * amt, name)

# Blueprint grid: fine lines, a stronger line every fifth, one soft glow.
def grid(name, bg, line, glow, seed):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    fine = ((xx % 30) < 1.2) | ((yy % 30) < 1.2)
    major = ((xx % 150) < 2) | ((yy % 150) < 2)
    g = np.clip(1 - np.hypot((xx - W * 0.75) / W, (yy - H * 0.2) / H) / 0.6, 0, 1)[..., None] ** 1.6
    img = hexrgb(bg) * (1 - g) + hexrgb(glow) * g * 0.6 + hexrgb(bg) * g * 0.4
    img = np.where(fine[..., None], img * 0.55 + hexrgb(line) * 0.45, img)
    img = np.where(major[..., None], img * 0.3 + hexrgb(line) * 0.7, img)
    save(grain(img, 8, seed), name)

# Concentric rounded squares (echoes the app-icon modules), very light.
def squares(name, bg, line, seed):
    def draw(d, k):
        cx, cy = W * k / 2, H * k * 0.44
        for i in range(1, 16):
            r = i * 44 * k
            d.rounded_rectangle((cx - r, cy - r, cx + r, cy + r), radius=int(r * 0.32), outline=line, width=int(2 * k))
    save(grain(supersample(draw, bg), 8, seed), name)

# Diagonal pinstripes with a soft glow.
def pinstripes(name, bg, line, glow, seed):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    st = ((xx + yy) % 26) < 2.2
    g = np.clip(1 - np.hypot((xx - W * 0.5) / W, (yy - H * 0.45) / H) / 0.55, 0, 1)[..., None] ** 1.4
    img = hexrgb(bg) * (1 - g) + hexrgb(glow) * g
    img = np.where(st[..., None], img * 0.7 + hexrgb(line) * 0.3, img)
    save(grain(img, 8, seed), name)

# One pattern per tile, each tuned to its screen.
space('p01', '#060823', '#3B2BA8', '#2D6BFF', 3)                       # Jaadu chart (neon navy)
paper('p02', '#FFF1D6', [('circle', '#FFB800', (700, -240, 1260, 300)), ('poly', '#F28C28', [(0, 470), (430, 330), (720, 720), (0, 720)]), ('circle', '#0063F8', (-150, -190, 250, 210)), ('poly', '#DCCFFF', [(1080, 480), (800, 720), (1080, 720)])], 12)  # Pulsefit website (deep blue)
grainy('p03', '#F5577D', [['#7C5CFF', 0.0, 0.0, 0.9], ['#FF8A3D', 1.0, 0.1, 0.8], ['#FFC371', 1.0, 1.0, 0.6], ['#E0457B', 0.2, 0.9, 0.6]], 5, 28)  # SSH performance (black)
rays('p04', '#7B61FF', '#9479FF', 540, 820, 26, 31)                  # Zync phones (white, violet)
sky('p05', [(0.0, '#2A57C6'), (0.35, '#4F86E8'), (0.62, '#9DBBF3'), (0.82, '#F2C14E'), (1.05, '#F08A3C')], 21)  # College finance
# Subtle ones (the newer tiles): low contrast, close tones, then softened toward the ground.
halftone('p06', '#3046C8', '#4E63E8', '#8B7BFF', 6)                    # Jaadu strategy comparison
memphis('p07', '#EEF3FF', ['#C4D6FF', '#FFE2A0', '#D8CCFF', '#FFD1B0', '#AFC6FF'], 7)  # Pulsefit create lead
topo('p08', '#5A3FC6', '#8468F0', '#F5577D', 8)                        # SSH hosts
waves('p09', ['#EAE4FF', '#DED4FF', '#F4F0FF', '#D3C7FB', '#F6E9F2'], 9)  # Zync trio (sign-up, workout, sleep)
pixels('p10', '#2D45C8', '#3D5DE0', '#5B7CF0', '#5FD3F0', 10)          # Jaadu overnight (bright blue under the navy UI)
ripples('p11', '#FFF1D3', '#FBE3B3', '#FFC94D', 11)                    # Pulsefit pricing (blue page)
terrazzo('p12', '#F7EFF8', ['#D9CCFF', '#FFC7D6', '#C9B8FF', '#FFE0EA', '#B8A6F0', '#E6DEFF'], 12)  # Zync trio (events, profile, log)
aurora('p13', '#2A3AA8', '#3FE0D0', '#B48CFF', 13)                     # Jaadu AI chat
hills('p14', '#BFD3F7', '#F6E2B3', '#F2C14E', ['#6E9BF0', '#2653CF', '#12326E'], 14)  # College drawer
grid('p15', '#4B32B0', '#7258E0', '#C08BFF', 15)                        # SSH sessions
bauhaus('p16', '#E9EEF8', ['#C9D8F7', '#F6E2B3', '#AFC3EE', '#DCE6F7', '#BFD0F2'], 16)  # College drawer (Engineering)
pinstripes('p18', '#E3ECFF', '#C6D6FF', '#FFFFFF', 18)                 # Pulsefit members

for n, base, amt in [('p06', '#3046C8', 0.3), ('p07', '#EEF3FF', 0.35), ('p08', '#5A3FC6', 0.25), ('p10', '#2D45C8', 0.35), ('p11', '#FFF1D3', 0.35), ('p12', '#F7EFF8', 0.3), ('p16', '#E9EEF8', 0.35)]:
    soften(n, base, amt)
