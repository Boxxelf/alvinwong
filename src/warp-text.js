import * as THREE from 'three';

// Text is rasterised to a canvas texture, mapped onto a dense plane, then bent,
// twisted and liquefied in shaders. Scroll progress (0..1) drives the keyframes.

const vertex = /* glsl */ `
  uniform float uBend;
  uniform float uTwist;
  uniform float uWave;
  uniform float uTime;
  uniform vec2 uSize;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    float nx = p.x / (uSize.x * 0.5);
    float ny = p.y / (uSize.y * 0.5);

    // curved sheet: edges fall away from the viewer
    p.z -= uBend * nx * nx * uSize.x * 0.32;

    // twist around the vertical axis, stronger towards the bottom lines
    float a = uTwist * (ny - 1.0) * 0.5;
    float c = cos(a), s = sin(a);
    p.xz = vec2(c * p.x - s * p.z, s * p.x + c * p.z);

    // slow liquid swell
    p.z += uWave * sin(nx * 2.6 + ny * 1.8 + uTime * 0.7) * uSize.x * 0.10;
    p.y += uWave * sin(nx * 3.4 - uTime * 0.5) * uSize.y * 0.10;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uWave;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float w = uWave;
    // horizontal smearing bands — letters stretch and pinch like the reference
    uv.x += w * 0.050 * sin(uv.y * 8.0 + uv.x * 3.0 + uTime * 0.9);
    uv.x += w * 0.030 * sin(uv.x * 13.0 - uTime * 0.6);
    uv.y += w * 0.045 * sin(uv.x * 6.0 + uTime * 0.7);
    float a = smoothstep(0.04, 0.55, texture2D(uTex, uv).a);
    if (a < 0.02) discard;
    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`;

// ---------- text rasterising ----------

function makeTexture(layout, maxTex) {
  const W = Math.min(4096, maxTex);
  const unit = 400; // reference font size in canvas px before fitting
  const pad = 0.14;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');

  const lines = layout.lines.map((l) => {
    const size = unit * (l.size ?? 1);
    ctx.font = `400 ${size}px "Inter Tight"`;
    ctx.letterSpacing = `${(l.tracking ?? -0.035) * size}px`;
    return { ...l, px: size, w: ctx.measureText(l.text).width };
  });
  const blockW = Math.max(...lines.map((l) => l.w));
  const blockH = lines.reduce((h, l) => h + l.px * (l.lh ?? 0.98), 0);
  const fit = (W * (1 - pad * 2)) / blockW;
  const H = Math.ceil(blockH * fit + W * pad * 2);

  c.width = W;
  c.height = H;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';

  let y = W * pad;
  const x0 = W * pad;
  for (const l of lines) {
    const size = l.px * fit;
    ctx.font = `400 ${size}px "Inter Tight"`;
    ctx.letterSpacing = `${(l.tracking ?? -0.035) * size}px`;
    const w = l.w * fit;
    const align = l.align ?? layout.align ?? 'center';
    const x = align === 'left' ? x0 : align === 'right' ? W - x0 - w : (W - w) / 2;
    y += size * (l.lh ?? 0.98);
    ctx.fillText(l.text, x, y - size * 0.2);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = 4;
  return { tex, aspect: H / W, padFrac: pad };
}

// ---------- keyframes ----------

const ease = (t) => t * t * (3 - 2 * t);
function sample(frames, p) {
  if (p <= frames[0].t) return frames[0];
  for (let i = 1; i < frames.length; i++) {
    const b = frames[i];
    if (p <= b.t) {
      const a = frames[i - 1];
      const k = ease((p - a.t) / (b.t - a.t));
      const out = {};
      for (const key in b) out[key] = a[key] + (b[key] - a[key]) * k;
      return out;
    }
  }
  return frames[frames.length - 1];
}

const F = (t, scale, bend, twist, wave, rotX, rotY, rotZ, opacity) =>
  ({ t, scale, bend, twist, wave, rotX, rotY, rotZ, opacity });

// small, curved sheet -> grows -> blows past the camera
export const HERO_FRAMES = [
  F(0.00, 0.62, 1.15, 0.55, 0.22, 0.18, -0.42, -0.05, 1),
  F(0.30, 1.00, 0.55, 0.25, 0.18, 0.06, -0.18, -0.02, 1),
  F(0.62, 2.60, 0.10, 0.05, 0.85, 0.00, 0.10, 0.03, 1),
  F(1.00, 7.50, -0.35, -0.20, 1.60, -0.05, 0.25, 0.06, 0),
];

// arrives warped and small, settles flat, then explodes
export const THROUGH_FRAMES = [
  F(0.00, 0.45, 0.80, 0.40, 0.90, 0.10, -0.30, -0.06, 0),
  F(0.12, 0.62, 0.55, 0.28, 0.60, 0.06, -0.20, -0.04, 1),
  F(0.36, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, -0.03, 1),
  F(0.58, 1.06, 0.00, 0.00, 0.04, 0.00, 0.00, -0.03, 1),
  F(0.85, 3.40, -0.20, -0.10, 1.10, -0.04, 0.18, 0.02, 1),
  F(1.00, 6.00, -0.35, -0.18, 1.60, -0.06, 0.25, 0.04, 0),
];

// ---------- renderer ----------

export class WarpText {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 1, 20000);
    this.blocks = [];
    this.clock = new THREE.Clock();
    this.maxTex = this.renderer.capabilities.maxTextureSize;
    this.resize();
  }

  add({ layout, frames, widthDesktop, widthMobile, color }) {
    const { tex, aspect, padFrac } = makeTexture(layout, this.maxTex);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTex: { value: tex },
        uBend: { value: 0 },
        uTwist: { value: 0 },
        uWave: { value: 0 },
        uTime: { value: 0 },
        uOpacity: { value: 1 },
        uSize: { value: new THREE.Vector2(1, 1) },
        uColor: { value: new THREE.Color(color) },
      },
    });
    const geo = new THREE.PlaneGeometry(1, aspect, 160, Math.max(24, Math.round(160 * aspect)));
    const mesh = new THREE.Mesh(geo, material);
    mesh.visible = false;
    this.scene.add(mesh);
    const block = { mesh, material, aspect, padFrac, frames, widthDesktop, widthMobile, progress: 0, active: false };
    this.blocks.push(block);
    this.layoutBlock(block);
    return block;
  }

  layoutBlock(b) {
    const mobile = this.w < 760;
    // width of the visible text block in px; the plane is wider by its padding
    const textW = this.w * (mobile ? b.widthMobile : b.widthDesktop);
    const planeW = textW / (1 - b.padFrac * 2);
    b.mesh.geometry.dispose();
    b.mesh.geometry = new THREE.PlaneGeometry(planeW, planeW * b.aspect, 160, Math.max(24, Math.round(160 * b.aspect)));
    b.material.uniforms.uSize.value.set(planeW, planeW * b.aspect);
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.renderer.setSize(this.w, this.h, false);
    this.camera.aspect = this.w / this.h;
    // 1 world unit == 1 css pixel at z = 0
    this.camera.position.z = this.h / 2 / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    this.camera.updateProjectionMatrix();
    this.blocks.forEach((b) => this.layoutBlock(b));
  }

  render() {
    const t = this.clock.getElapsedTime();
    let any = false;
    for (const b of this.blocks) {
      b.mesh.visible = !!b.active;
      if (!b.active) continue;
      any = true;
      const s = sample(b.frames, b.progress);
      b.mesh.scale.setScalar(s.scale);
      b.mesh.rotation.set(s.rotX, s.rotY, s.rotZ);
      const u = b.material.uniforms;
      u.uBend.value = s.bend;
      u.uTwist.value = s.twist;
      u.uWave.value = s.wave;
      u.uOpacity.value = s.opacity;
      u.uTime.value = t;
    }
    if (any || this.wasDrawing) this.renderer.render(this.scene, this.camera);
    this.wasDrawing = any;
  }
}
