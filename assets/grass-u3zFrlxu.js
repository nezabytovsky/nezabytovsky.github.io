import{$ as e,A as t,N as n,U as r,W as i,w as a}from"./three.module-Cs8GzSxb.js";function o({width:o,height:s}={}){let c=new r,l=new t(-1,1,1,-1,.1,10);l.position.z=1;let u=new n(2,2),d=new i({uniforms:{uTime:{value:0},uResolution:{value:new e(o,s)},uSpeed:{value:1},uDensity:{value:1}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime, uSpeed, uDensity;

      vec2 hash22(vec2 p) {
        vec3 a = fract(vec3(p.xyx) * vec3(5.3987, 5.4421, 6.9371));
        a += dot(a, a.yzx + 19.19);
        return fract(vec2(a.x * a.y, a.y * a.z));
      }

      float hash21(vec2 p) {
        p = fract(p * vec2(5.3987, 5.4421));
        p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
        return fract(p.x * p.y * 95.4307);
      }

      float valueNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash21(i), hash21(i + vec2(1, 0)), u.x),
          mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 4; i++) {
          v += a * valueNoise(p);
          p = rot * p * 2.1;
          a *= 0.5;
        }
        return v;
      }

      float bladeSDF(vec2 p, vec2 base, float angle, float len, float w, float bend, out float bladeT) {
        float c = cos(angle), s = sin(angle);
        vec2 dir = vec2(s, c);
        vec2 perp = vec2(c, -s);
        vec2 d = p - base;

        float along = dot(d, dir);
        float across = dot(d, perp);

        float t = clamp(along / len, 0.0, 1.0);
        bladeT = t;

        across -= bend * t * (1.0 - t);

        float hw = w * (1.0 - t) * (1.0 + 0.3 * t);

        float dAlong = max(-along, along - len);
        float dAcross = abs(across) - hw;

        return max(dAlong, dAcross);
      }

      float grassLayer3(vec2 st, float cellSize, vec2 seed, float windAngle, float bladeScale, out float outT, out float outRand) {
        vec2 grid = st / cellSize;
        vec2 cell = floor(grid);

        float bestDist = 1e5;
        float bestT = 0.0;
        float bestRand = 0.0;

        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 nc = cell + vec2(float(x), float(y));
            vec2 r = hash22(nc + seed);
            float r2 = hash21(nc + seed + 7.3);
            float r3 = hash21(nc + seed + 13.7);

            vec2 bladeBase = (nc + 0.1 + r * 0.8) * cellSize;
            float phase = r2 * 6.2832;
            float t = uTime * uSpeed;
            float sway = sin(t * 1.8 + phase + bladeBase.x * 4.0 + bladeBase.y * 2.5) * 0.25;
            float angle = windAngle + (r2 - 0.5) * 1.8 + sway;
            float len = cellSize * bladeScale * (0.8 + r3 * 0.5);
            float w = cellSize * (0.15 + r.x * 0.10);
            float windBend = sin(t * 1.4 + phase * 0.7 + bladeBase.y * 3.0) * cellSize * 0.35;
            float bendAmt = (r.y - 0.5) * cellSize * 0.6 + windBend;

            float bt;
            float d = bladeSDF(st, bladeBase, angle, len, w, bendAmt, bt);

            if (d < bestDist) {
              bestDist = d;
              bestT = bt;
              bestRand = r2;
            }
          }
        }

        outT = bestT;
        outRand = bestRand;

        float aa = cellSize * 0.018;
        return 1.0 - smoothstep(-aa, aa, bestDist);
      }

      float grassLayer5(vec2 st, float cellSize, vec2 seed, float windAngle, float bladeScale, out float outT, out float outRand) {
        vec2 grid = st / cellSize;
        vec2 cell = floor(grid);

        float bestDist = 1e5;
        float bestT = 0.0;
        float bestRand = 0.0;

        for (int y = -2; y <= 2; y++) {
          for (int x = -2; x <= 2; x++) {
            vec2 nc = cell + vec2(float(x), float(y));
            vec2 r = hash22(nc + seed);
            float r2 = hash21(nc + seed + 7.3);
            float r3 = hash21(nc + seed + 13.7);

            vec2 bladeBase = (nc + 0.1 + r * 0.8) * cellSize;
            float phase = r2 * 6.2832;
            float t = uTime * uSpeed;
            float sway = sin(t * 1.8 + phase + bladeBase.x * 4.0 + bladeBase.y * 2.5) * 0.25;
            float angle = windAngle + (r2 - 0.5) * 1.8 + sway;
            float len = cellSize * bladeScale * (0.8 + r3 * 0.5);
            float w = cellSize * (0.15 + r.x * 0.10);
            float windBend = sin(t * 1.4 + phase * 0.7 + bladeBase.y * 3.0) * cellSize * 0.35;
            float bendAmt = (r.y - 0.5) * cellSize * 0.6 + windBend;

            float bt;
            float d = bladeSDF(st, bladeBase, angle, len, w, bendAmt, bt);

            if (d < bestDist) {
              bestDist = d;
              bestT = bt;
              bestRand = r2;
            }
          }
        }

        outT = bestT;
        outRand = bestRand;

        float aa = cellSize * 0.018;
        return 1.0 - smoothstep(-aa, aa, bestDist);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;

        float baseScale = 10.0 * uDensity;
        vec2 centeredUV = uv - 0.5;
        centeredUV.x *= uResolution.x / uResolution.y;
        vec2 st = centeredUV * baseScale;

        float t = uTime * uSpeed;
        float windAngle = fbm(st * 0.25 + vec2(3.1 + t * 0.15, 7.7 + t * 0.1)) * 6.2832;

        vec3 col = vec3(0.06, 0.18, 0.05);
        col += (fbm(st * 2.5) - 0.5) * 0.05;

        float lt, lr;

        // Layer 1
        float cov1 = grassLayer3(st, 0.09, vec2(0.0, 0.0), windAngle, 1.3, lt, lr);
        vec3 c1 = mix(vec3(0.07, 0.20, 0.05), vec3(0.13, 0.30, 0.09), lt);
        c1 *= 0.9 + (lr - 0.5) * 0.2;
        col = mix(col, c1, cov1);

        // Layer 2
        float cov2 = grassLayer3(st, 0.13, vec2(5.5, 3.3), windAngle + 0.35, 1.4, lt, lr);
        vec3 c2 = mix(vec3(0.10, 0.28, 0.07), vec3(0.18, 0.40, 0.12), lt);
        c2 *= 0.9 + (lr - 0.5) * 0.25;
        col = mix(col, c2, cov2);

        // Layer 3
        float cov3 = grassLayer5(st, 0.17, vec2(11.1, 7.7), windAngle - 0.25, 1.9, lt, lr);
        vec3 c3 = mix(vec3(0.14, 0.36, 0.09), vec3(0.25, 0.54, 0.17), lt);
        c3 *= 0.88 + (lr - 0.5) * 0.3;
        col = mix(col, c3, cov3);

        // Layer 4
        float cov4 = grassLayer5(st, 0.21, vec2(17.3, 12.1), windAngle + 0.5, 2.0, lt, lr);
        vec3 c4 = mix(vec3(0.20, 0.46, 0.12), vec3(0.36, 0.64, 0.22), lt);
        c4 *= 0.88 + (lr - 0.5) * 0.3;
        col = mix(col, c4, cov4);

        // Layer 5
        float cov5 = grassLayer5(st, 0.26, vec2(23.7, 19.5), windAngle - 0.4, 1.8, lt, lr);
        vec3 c5 = mix(vec3(0.28, 0.52, 0.16), vec3(0.45, 0.72, 0.28), lt);
        c5 *= 0.88 + (lr - 0.5) * 0.3;
        col = mix(col, c5, cov5);

        gl_FragColor = vec4(col, 1.0);
      }
    `});return c.add(new a(u,d)),{uniforms:d.uniforms,controlDefs:[{label:`SPEED`,type:`range`,min:`0`,max:`3`,step:`0.1`,value:`1`,on(e){d.uniforms.uSpeed.value=e}},{label:`SCALE`,type:`range`,min:`0.5`,max:`3`,step:`0.1`,value:`1`,on(e){d.uniforms.uDensity.value=e}}],setSize(e,t){d.uniforms.uResolution.value.set(e,t)},render(e,t){d.uniforms.uTime.value=t,e.render(c,l)},dispose(){u.dispose(),d.dispose()}}}export{o as t};