import{$ as e,A as t,N as n,U as r,W as i,w as a}from"./three.module-DsNDpfSU.js";function o({width:o,height:s}={}){let c=new r,l=new t(-1,1,1,-1,.1,10);l.position.z=1;let u=new n(2,2),d=new i({uniforms:{uResolution:{value:new e(o,s)},uCols:{value:10},uRowDensity:{value:6},uGap:{value:.011},uChevronDepth:{value:.115},uRimWidth:{value:.013},uRimBright:{value:.65},uShadeAO:{value:.45},uCrackChance:{value:.45},uCrackAmount:{value:.8},uVWobble:{value:.025},uGrainFX:{value:7},uGrainAmount:{value:.1}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uCols, uRowDensity, uGap, uChevronDepth;
      uniform float uRimWidth, uRimBright, uShadeAO;
      uniform float uCrackChance, uCrackAmount, uVWobble, uGrainFX, uGrainAmount;

      const float PI = 3.14159265359;
      const float LIGHT_STEPS   = 4.0;

      const vec3 WOOD_DARK  = vec3(0.4314, 0.1922, 0.0392);
      const vec3 WOOD_MID   = vec3(0.7569, 0.3804, 0.0784);
      const vec3 WOOD_LIGHT = vec3(0.9255, 0.5961, 0.2549);
      const vec3 GAP_COL    = vec3(0.1490, 0.0510, 0.0157);

      float hash1(vec2 p) {
        p = fract(p * vec2(443.897, 441.423));
        p += dot(p, p + 19.19);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash1(i), hash1(i + vec2(1, 0)), u.x),
                   mix(hash1(i + vec2(0, 1)), hash1(i + vec2(1, 1)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.0; a *= 0.5; }
        return v;
      }

      float pnoise(vec2 p, float period) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        vec2 pp = vec2(period);
        float a = hash1(mod(i, pp));
        float b = hash1(mod(i + vec2(1, 0), pp));
        float c = hash1(mod(i + vec2(0, 1), pp));
        float d = hash1(mod(i + vec2(1, 1), pp));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float rowCount(float c, float aspect) {
        float h = hash1(vec2(mod(c, uCols), 17.0));
        float n = floor(uRowDensity / aspect + step(0.5, h) + step(0.83, h));
        return clamp(n, 1.0, 64.0);
      }

      float boundaryY(float c, float r, float rows, float x) {
        vec2 s = vec2(mod(c, uCols), mod(r, rows));
        float base  = r / rows;
        float jit   = (hash1(s + vec2(2.0, 5.0)) - 0.5) * (1.0 / rows) * 0.30;
        float depth = (uChevronDepth / rows) * (0.5 + 0.5 * hash1(s + vec2(9.0, 1.0)));
        float freq  = 1.0 + step(0.5, hash1(s + vec2(4.0, 8.0)));
        float dir   = sign(hash1(s + vec2(6.0, 3.0)) - 0.5);
        float ph    = hash1(s + vec2(7.0, 2.0));
        float t     = abs(fract(x * freq + ph) - 0.5) * 2.0;
        return base + jit + dir * (t - 0.5) * depth * 2.0;
      }

      vec3 boardTone(float c, float r, float rows) {
        vec2 s = vec2(mod(c, uCols), mod(r, rows));
        vec3 base = mix(WOOD_MID, WOOD_LIGHT, hash1(s + vec2(5.0, 1.0)));
        base = mix(base, WOOD_DARK, step(0.80, hash1(s + vec2(2.0, 8.0))) * 0.55);
        base *= 0.90 + hash1(s + vec2(7.7, 3.3)) * 0.18;
        return base;
      }

      vec3 render(vec2 uv, vec2 res, out float h) {
        float aspect = res.x / res.y;
        float w  = 1.0 / uCols;
        float c  = floor(uv.x * uCols);
        float tx = fract(uv.x * uCols);
        float rows = rowCount(c, aspect);

        float fr = floor(uv.y * rows);
        float bBelow = boundaryY(c, fr,        rows, tx);
        float bAbove = boundaryY(c, fr + 1.0,  rows, tx);
        if (uv.y > bAbove)      { fr += 1.0; bBelow = bAbove; bAbove = boundaryY(c, fr + 1.0, rows, tx); }
        else if (uv.y < bBelow) { fr -= 1.0; bAbove = bBelow; bBelow = boundaryY(c, fr,       rows, tx); }

        float wobL = sin(uv.y * 4.0 * PI + hash1(vec2(mod(c,       uCols), 0.0)) * 6.2831) * uVWobble;
        float wobR = sin(uv.y * 4.0 * PI + hash1(vec2(mod(c + 1.0, uCols), 0.0)) * 6.2831) * uVWobble;

        float eBot = uv.y - bBelow;
        float eTop = bAbove - uv.y;
        float eL   = (tx - wobL) * w;
        float eR   = (1.0 + wobR - tx) * w;

        float d    = min(min(eBot, eTop), min(eL, eR));
        float hw   = uGap * 0.5;
        float aa   = 1.5 / res.y;

        vec3 base = boardTone(c, fr, rows);
        float fib = mix(fbm(vec2(tx * uGrainFX + mod(c, uCols) * 3.7, 0.0)),
                        fbm(vec2(tx * uGrainFX * 2.0, 1.7)), 0.4);
        base *= mix(1.0 - uGrainAmount, 1.0 + uGrainAmount, fib);
        base *= 0.97 + 0.03 * cos(uv.y * 2.0 * PI);

        vec2 sid = vec2(mod(c, uCols), mod(fr, rows));
        float seed = hash1(sid) * 31.0;
        float ya = uv.y * 2.0 * PI;
        float cn = fbm(vec2(tx * 5.0 + seed * 1.7 + 0.6 * cos(ya), 0.6 * sin(ya)));
        float crack = step(1.0 - uCrackChance, hash1(sid + vec2(21.0, 4.0)))
                      * (1.0 - smoothstep(0.0, 0.030, abs(cn - 0.5)));
        base *= 1.0 - crack * uCrackAmount;

        float face = smoothstep(hw - aa, hw + aa, d);
        vec3 col = mix(GAP_COL, base, face);

        float rim = max(smoothstep(hw + uRimWidth, hw, eBot) * step(hw, eBot),
                        smoothstep(hw + uRimWidth, hw, eL)   * step(hw, eL));
        float ao  = max(smoothstep(hw + uRimWidth, hw, eTop) * step(hw, eTop),
                        smoothstep(hw + uRimWidth, hw, eR)   * step(hw, eR));
        col *= 1.0 - ao * uShadeAO * face;
        col  = mix(col, WOOD_LIGHT, rim * uRimBright * face);

        h = face - (1.0 - face) + rim * 0.5 - ao * 0.5 - crack * 0.5 * face;
        return col;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;

        float h;
        vec3 col = render(uv, uResolution.xy, h);

        float S = 1.3;
        vec3 N = normalize(vec3(-dFdx(h) * S, -dFdy(h) * S, 1.0));
        vec3 L = normalize(vec3(-0.40, 0.55, 0.80));
        float diff = dot(N, L) * 0.5 + 0.5;
        diff = floor(diff * LIGHT_STEPS + 0.5) / LIGHT_STEPS;
        col *= mix(0.88, 1.12, diff);

        col *= 0.97 + 0.03 * cos(uv.x * 2.0 * PI) * cos(uv.y * 2.0 * PI);
        col = clamp(col, 0.0, 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `});return c.add(new a(u,d)),{uniforms:d.uniforms,controlDefs:[{label:`COLS`,type:`range`,min:`3`,max:`20`,step:`1`,value:`10`,on(e){d.uniforms.uCols.value=e}},{label:`ROWS`,type:`range`,min:`2`,max:`15`,step:`1`,value:`6`,on(e){d.uniforms.uRowDensity.value=e}},{label:`GAP`,type:`range`,min:`0.001`,max:`0.05`,step:`0.001`,value:`0.011`,on(e){d.uniforms.uGap.value=e}},{label:`CHEVRON`,type:`range`,min:`0`,max:`0.3`,step:`0.005`,value:`0.115`,on(e){d.uniforms.uChevronDepth.value=e}},{label:`RIM W`,type:`range`,min:`0`,max:`0.05`,step:`0.001`,value:`0.013`,on(e){d.uniforms.uRimWidth.value=e}},{label:`RIM B`,type:`range`,min:`0`,max:`1`,step:`0.01`,value:`0.65`,on(e){d.uniforms.uRimBright.value=e}},{label:`AO`,type:`range`,min:`0`,max:`1`,step:`0.01`,value:`0.45`,on(e){d.uniforms.uShadeAO.value=e}},{label:`CRACK %`,type:`range`,min:`0`,max:`1`,step:`0.01`,value:`0.45`,on(e){d.uniforms.uCrackChance.value=e}},{label:`CRACK AMT`,type:`range`,min:`0`,max:`1`,step:`0.01`,value:`0.8`,on(e){d.uniforms.uCrackAmount.value=e}},{label:`WOBBLE`,type:`range`,min:`0`,max:`0.1`,step:`0.001`,value:`0.025`,on(e){d.uniforms.uVWobble.value=e}},{label:`GRAIN`,type:`range`,min:`1`,max:`20`,step:`0.5`,value:`7`,on(e){d.uniforms.uGrainFX.value=e}},{label:`GRAIN AMT`,type:`range`,min:`0`,max:`0.5`,step:`0.01`,value:`0.1`,on(e){d.uniforms.uGrainAmount.value=e}}],setSize(e,t){d.uniforms.uResolution.value.set(e,t)},render(e,t){e.render(c,l)},dispose(){u.dispose(),d.dispose()}}}export{o as t};