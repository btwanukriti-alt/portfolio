import {
  BufferAttribute,
  BufferGeometry,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'
import { mulberry32, type Formation } from './formations'

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

const VERTEX = /* glsl */ `
uniform float uMix;
uniform float uTime;
uniform float uDpr;
uniform float uCamZ;
uniform vec3 uA; // turb, mouse, vary of formation A
uniform vec3 uB;
uniform vec2 uMouse;
uniform float uMotion;

attribute vec4 aPosA;
attribute vec4 aPosB;
attribute vec4 aColA;
attribute vec4 aColB;
attribute vec4 aFlowA;
attribute vec4 aFlowB;
attribute vec4 aRand; // delay, swirl, phase, size jitter

varying vec4 vCol;

${NOISE}

vec3 stream(vec4 f, float phase, out float fade) {
  fade = 1.0;
  if (f.z <= 0.0) return vec3(0.0);
  float k = fract(phase + uTime * f.w * uMotion);
  fade = sin(3.14159 * k);
  return vec3(f.xy * f.z * (k - 0.5), 0.0);
}

void main() {
  // Each dot leaves on its own beat, so a morph ripples instead of snapping.
  float local = clamp((uMix - aRand.x * 0.4) / 0.6, 0.0, 1.0);
  float e = local < 0.5 ? 4.0 * local * local * local : 1.0 - pow(-2.0 * local + 2.0, 3.0) / 2.0;

  float fadeA, fadeB;
  vec3 pa = aPosA.xyz + stream(aFlowA, aRand.z, fadeA);
  vec3 pb = aPosB.xyz + stream(aFlowB, aRand.z, fadeB);
  vec3 p = mix(pa, pb, e);
  vec3 prm = mix(uA, uB, e);

  // Ambient drift through a slow noise field.
  vec3 q = p * 0.0022 + vec3(0.0, 0.0, uTime * 0.05 * uMotion);
  p += vec3(snoise(q), snoise(q + vec3(17.1, 3.2, 9.7)), snoise(q + vec3(-8.3, 21.4, 4.1))) * prm.x;

  // In flight, dots swirl along a curl of noise.
  float flight = sin(3.14159 * e) * uMotion;
  vec3 q2 = p * 0.0016 + vec3(aRand.y * 4.0, 0.0, uTime * 0.08);
  p += vec3(snoise(q2), snoise(q2 + vec3(9.0)), snoise(q2 + vec3(19.0))) * flight * 260.0 * aRand.y;

  // The cursor parts the dots like a hand through sand.
  vec2 d = p.xy - uMouse;
  float dl = length(d) + 0.0001;
  p.xy += (d / dl) * max(0.0, 150.0 - dl) * 0.55 * prm.y;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = mix(aPosA.w, aPosB.w, e) * mix(1.0, 0.6 + aRand.w * 0.8, prm.z);
  gl_PointSize = max(1.0, size * uDpr * (uCamZ / -mv.z));

  vec4 c = mix(aColA, aColB, e);
  float twinkle = 1.0 - prm.z * 0.25 * (0.5 + 0.5 * sin(uTime * (0.8 + aRand.w * 2.2) + aRand.z * 6.2831));
  c.a *= twinkle * mix(fadeA, fadeB, e);
  vCol = c;
}
`

const FRAGMENT = /* glsl */ `
varying vec4 vCol;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.36, d) * vCol.a;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vCol.rgb * a, a);
}
`

const FOV = 35

export class DotField {
  readonly count: number
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera = new PerspectiveCamera(FOV, 1, 1, 10000)
  private geometry = new BufferGeometry()
  private material: ShaderMaterial
  private points: Points
  private formations: Formation[] = []
  private pair: [number, number] = [-1, -1]
  private mouse = new Vector2(1e5, 1e5)
  private mouseTarget = new Vector2(1e5, 1e5)

  constructor(canvas: HTMLCanvasElement, count: number, reducedMotion: boolean) {
    this.count = count
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x000000, 0)

    const rand = mulberry32(99)
    const seeds = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      seeds[i * 4] = rand()
      seeds[i * 4 + 1] = (rand() - 0.5) * 2
      seeds[i * 4 + 2] = rand()
      seeds[i * 4 + 3] = rand()
    }
    this.geometry.setAttribute('aRand', new BufferAttribute(seeds, 4))
    for (const name of ['aPosA', 'aPosB', 'aColA', 'aColB', 'aFlowA', 'aFlowB']) {
      this.geometry.setAttribute(name, new BufferAttribute(new Float32Array(count * 4), 4))
    }
    // three needs a position attribute to know how many points to draw.
    this.geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))

    this.material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: NormalBlending,
      premultipliedAlpha: true,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uDpr: { value: 1 },
        uCamZ: { value: 1000 },
        uA: { value: [0, 0, 0] },
        uB: { value: [0, 0, 0] },
        uMouse: { value: this.mouse },
        uMotion: { value: reducedMotion ? 0 : 1 },
      },
    })
    this.points = new Points(this.geometry, this.material)
    this.points.frustumCulled = false
    this.scene.add(this.points)
  }

  resize(w: number, h: number, dpr: number, formations: Formation[]) {
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
    // Place the camera so the z = 0 plane maps 1 unit to 1 CSS pixel.
    const camZ = h / 2 / Math.tan((FOV * Math.PI) / 360)
    this.camera.aspect = w / h
    this.camera.position.set(0, 0, camZ)
    this.camera.near = 1
    this.camera.far = camZ * 4
    this.camera.updateProjectionMatrix()
    this.material.uniforms.uDpr.value = dpr
    this.material.uniforms.uCamZ.value = camZ
    this.formations = formations
    this.pair = [-1, -1]
  }

  /** Cursor position in CSS px relative to the viewport centre, y up. */
  pointer(x: number, y: number) {
    this.mouseTarget.set(x, y)
  }

  private load(slot: 'A' | 'B', f: Formation) {
    const g = this.geometry
    ;(g.getAttribute(`aPos${slot}`) as BufferAttribute).copyArray(f.pos).needsUpdate = true
    ;(g.getAttribute(`aCol${slot}`) as BufferAttribute).copyArray(f.col).needsUpdate = true
    ;(g.getAttribute(`aFlow${slot}`) as BufferAttribute).copyArray(f.flow).needsUpdate = true
    this.material.uniforms[`u${slot}`].value = [f.turb, f.mouse, f.vary]
  }

  /** q: 0 = first formation, 1.5 = halfway between the second and third. */
  render(q: number, t: number, dt: number) {
    if (!this.formations.length) return
    const last = this.formations.length - 1
    const a = Math.max(0, Math.min(last - 1, Math.floor(q)))
    const b = a + 1
    if (this.pair[0] !== a) this.load('A', this.formations[a])
    if (this.pair[1] !== b) this.load('B', this.formations[b])
    this.pair = [a, b]

    const k = 1 - Math.exp(-dt * 6)
    this.mouse.lerp(this.mouseTarget, k)
    const u = this.material.uniforms
    u.uMix.value = Math.max(0, Math.min(1, q - a))
    u.uTime.value = t
    // A slow sway of the whole field, which settles while the screen is in focus.
    const calm = Math.max(u.uA.value[0], u.uB.value[0]) / 70
    this.points.rotation.y = Math.sin(t * 0.08) * 0.12 * calm
    this.points.rotation.x = Math.cos(t * 0.06) * 0.06 * calm
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }
}
