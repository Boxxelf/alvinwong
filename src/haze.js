import * as THREE from 'three';

// Generated "photography": light through haze, with grain and a column shadow.
// Stands in for the reference site's photos. One shared WebGL context renders
// each visible target, then copies the pixels into that target's 2D canvas.

const fragment = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uSeed;
  uniform vec2 uLight;
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    float ar = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * ar, uv.y);
    float t = uTime * 0.04 + uSeed;

    float fog = fbm(p * 1.7 + vec2(t, -t * 0.7));
    fog += 0.5 * fbm(p * 4.0 - vec2(t * 1.3, t * 0.4));

    vec2 lp = vec2(uLight.x * ar, uLight.y) + 0.02 * vec2(sin(t * 7.0), cos(t * 5.0));
    vec2 d2 = (p - lp) * vec2(1.0, 0.75);
    float d = length(d2);
    float glow = exp(-d * 3.4) * 0.85 + exp(-d * 12.0) * 0.75;

    // light shafts falling from the source
    float shaft = smoothstep(0.35, 0.0, abs(p.x - lp.x) - (lp.y - p.y) * 0.25) * smoothstep(-0.2, 0.6, lp.y - p.y + 0.4);

    // a dark vertical column, like the pillar in the reference photo
    float colX = fract(uSeed * 0.37) * 0.5 + 0.08;
    float column = smoothstep(0.035, 0.0, abs(uv.x - colX - 0.006 * sin(uv.y * 6.0))) * 0.55;

    float v = glow + shaft * 0.18 + (fog - 0.55) * 0.55 - column;
    v *= mix(0.55, 1.0, smoothstep(0.0, 0.55, uv.y)); // darker floor
    v -= 0.25 * length(uv - 0.5);                      // vignette

    vec3 col = mix(uC0, uC1, smoothstep(-0.1, 0.55, v));
    col = mix(col, uC2, smoothstep(0.7, 1.45, v));
    col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.07; // grain
    gl_FragColor = vec4(col, 1.0);
  }
`;

const TONES = {
  warm: [[0.22, 0.10, 0.04], [0.74, 0.43, 0.22], [1.0, 0.93, 0.82]],
  mono: [[0.02, 0.02, 0.02], [0.38, 0.38, 0.38], [0.96, 0.96, 0.96]],
};

const SIZE = 1024;

export class Haze {
  constructor() {
    this.gl = document.createElement('canvas');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.gl, preserveDrawingBuffer: true, antialias: false });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(SIZE, SIZE, false);
    this.uniforms = {
      uRes: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uSeed: { value: 0 },
      uLight: { value: new THREE.Vector2(0.55, 0.72) },
      uC0: { value: new THREE.Color() },
      uC1: { value: new THREE.Color() },
      uC2: { value: new THREE.Color() },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: fragment,
      uniforms: this.uniforms,
    });
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    this.camera = new THREE.Camera();
    this.targets = [];
    this.clock = new THREE.Clock();

    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const t = this.targets.find((x) => x.el === e.target);
        if (t) t.visible = e.isIntersecting;
      }
    }, { rootMargin: '10% 0px' });
  }

  add(el) {
    const [lx, ly] = (el.dataset.light || '0.55,0.72').split(',').map(Number);
    const target = {
      el,
      ctx: el.getContext('2d'),
      tone: TONES[el.dataset.variant] || TONES.mono,
      seed: Number(el.dataset.seed || 0),
      light: [lx, ly],
      visible: false,
      // hidden unless something sets it — used by the hover panel
      enabled: () => !el.classList.contains('exp__float') || el.classList.contains('is-on'),
    };
    this.targets.push(target);
    this.io.observe(el);
    return target;
  }

  render() {
    const time = this.clock.getElapsedTime();
    for (const t of this.targets) {
      if (!t.visible || !t.enabled()) continue;
      const r = t.el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      // render small and let the browser upscale: it is fog and grain anyway
      const k = Math.min(0.6, SIZE / Math.max(r.width, r.height));
      const w = Math.max(2, Math.round(r.width * k));
      const h = Math.max(2, Math.round(r.height * k));
      if (t.el.width !== w || t.el.height !== h) { t.el.width = w; t.el.height = h; }

      const u = this.uniforms;
      u.uRes.value.set(w, h);
      u.uTime.value = time;
      u.uSeed.value = t.seed;
      u.uLight.value.set(t.light[0], t.light[1]);
      u.uC0.value.setRGB(...t.tone[0]);
      u.uC1.value.setRGB(...t.tone[1]);
      u.uC2.value.setRGB(...t.tone[2]);
      this.renderer.setViewport(0, 0, w, h);
      this.renderer.render(this.scene, this.camera);
      t.ctx.drawImage(this.gl, 0, SIZE - h, w, h, 0, 0, w, h);
    }
  }
}
