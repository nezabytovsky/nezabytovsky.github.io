import{$ as e,A as t,N as n,U as r,W as i,w as a}from"./three.module-DmW5sRKN.js";function o({width:o,height:s}={}){let c=new r,l=new t(-1,1,1,-1,.1,10);l.position.z=1;let u=new n(2,2),d=new i({uniforms:{uTime:{value:0},uResolution:{value:new e(o,s)},uStoneHeight:{value:.26},uStoneScale:{value:8},uGapRandomness:{value:.9},uGapWidth:{value:.04},uEdgeRolloff:{value:.12},uSpeed:{value:1}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime, uSpeed;
      uniform float uStoneHeight, uStoneScale, uGapRandomness, uGapWidth, uEdgeRolloff;

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

      void voronoiStone(vec2 st, float jitter,
                        out float f1, out float f2,
                        out vec2 cellID, out vec2 toCenter) {
        vec2 iSt = floor(st);
        vec2 fSt = fract(st);

        f1 = 1e5;
        f2 = 1e5;
        cellID = vec2(0.0);
        toCenter = vec2(0.0);

        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 cell = iSt + neighbor;
            vec2 r = hash22(cell);
            vec2 point = neighbor + 0.5 + (r - 0.5) * jitter - fSt;

            float sizeVar = 0.85 + 0.3 * hash21(cell);
            float d = length(point) / sizeVar;

            if (d < f1) {
              f2 = f1;
              f1 = d;
              cellID = cell;
              toCenter = point;
            } else if (d < f2) {
              f2 = d;
            }
          }
        }
      }

      float stoneHeightField(vec2 st, float jitter) {
        float f1, f2;
        vec2 cID, toC;
        voronoiStone(st, jitter, f1, f2, cID, toC);

        float edgeDist = (f2 - f1) * 0.5;
        float edge = smoothstep(0.0, uEdgeRolloff, edgeDist);
        float dome = 1.0 - f1 * 0.35;
        dome = clamp(dome, 0.0, 1.0);

        return edge * dome * uStoneHeight;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;

        vec2 centeredUV = uv - 0.5;
        centeredUV.x *= uResolution.x / uResolution.y;
        vec2 st = centeredUV * uStoneScale;

        float f1, f2;
        vec2 cID, toC;
        voronoiStone(st, uGapRandomness, f1, f2, cID, toC);

        float edgeDist = (f2 - f1) * 0.5;
        float gapMask = smoothstep(uGapWidth, uGapWidth + 0.02, edgeDist);

        float eps = 0.005;
        float hC = stoneHeightField(st, uGapRandomness);
        float hL = stoneHeightField(st - vec2(eps, 0.0), uGapRandomness);
        float hR = stoneHeightField(st + vec2(eps, 0.0), uGapRandomness);
        float hD = stoneHeightField(st - vec2(0.0, eps), uGapRandomness);
        float hU = stoneHeightField(st + vec2(0.0, eps), uGapRandomness);
        vec3 N = normalize(vec3(hL - hR, hD - hU, 2.0 * eps));

        float ne = 0.02;
        vec2 bumpSt = st * 8.0 + cID * 5.7;
        float n0 = fbm(bumpSt);
        float nX = fbm(bumpSt + vec2(ne, 0.0) * 8.0);
        float nY = fbm(bumpSt + vec2(0.0, ne) * 8.0);
        N.x += (n0 - nX) / ne * 0.04 * gapMask;
        N.y += (n0 - nY) / ne * 0.04 * gapMask;
        N = normalize(N);

        float t = uTime * uSpeed;
        vec3 lightDir = normalize(vec3(
          0.35 + 0.15 * sin(t * 0.3),
          0.5 + 0.1 * cos(t * 0.4),
          0.85
        ));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfDir = normalize(lightDir + viewDir);

        float diff = max(dot(N, lightDir), 0.0);
        diff = diff * 0.65 + 0.35;

        float spec = pow(max(dot(N, halfDir), 0.0), 40.0);
        float fresnel = pow(1.0 - max(dot(N, viewDir), 0.0), 3.5);

        float ao = smoothstep(0.0, 0.1, edgeDist);
        ao = 0.5 + 0.5 * ao;

        float h = hash21(cID);
        float h2 = hash21(cID + vec2(77.7, 33.3));

        vec3 stoneDark  = vec3(0.42, 0.58, 0.68);
        vec3 stoneLight = vec3(0.62, 0.78, 0.86);
        vec3 stoneCol = mix(stoneDark, stoneLight, h);
        stoneCol *= 0.85 + 0.3 * h2;

        float warmShift = fbm(st * 0.3 + vec2(3.1, 7.7)) * 0.12;
        stoneCol += vec3(warmShift * 0.2, warmShift * 0.05, -warmShift * 0.15);

        float grain = fbm(st * 12.0 + cID * 11.0);
        stoneCol *= 0.94 + 0.12 * grain;

        float innerVar = fbm(st * 3.0 + cID * 7.3);
        stoneCol *= 0.92 + 0.16 * innerVar;

        stoneCol *= diff;
        stoneCol *= ao;
        vec3 specCol = vec3(0.80, 0.90, 0.97);
        stoneCol += spec * specCol * 0.7 * gapMask;
        stoneCol += fresnel * vec3(0.15, 0.22, 0.30) * 0.25;

        vec3 groutColor = vec3(0.25, 0.40, 0.52);
        groutColor *= 0.85 + 0.3 * valueNoise(st * 25.0);
        groutColor *= diff * 0.5 + 0.5;

        vec3 col = mix(groutColor, stoneCol, gapMask);

        float edgeHighlight = smoothstep(uEdgeRolloff, uGapWidth, edgeDist);
        col += edgeHighlight * spec * specCol * 0.3;

        col += (fbm(st * 20.0) - 0.5) * 0.015;

        vec2 vUV = uv - 0.5;
        col *= clamp(1.0 - dot(vUV * 1.2, vUV * 1.2) * 0.4, 0.0, 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `});return c.add(new a(u,d)),{uniforms:d.uniforms,controlDefs:[{label:`SPEED`,type:`range`,min:`0`,max:`3`,step:`0.1`,value:`1`,on(e){d.uniforms.uSpeed.value=e}},{label:`HEIGHT`,type:`range`,min:`0.05`,max:`0.5`,step:`0.01`,value:`0.26`,on(e){d.uniforms.uStoneHeight.value=e}},{label:`SCALE`,type:`range`,min:`2`,max:`20`,step:`0.5`,value:`8`,on(e){d.uniforms.uStoneScale.value=e}},{label:`JITTER`,type:`range`,min:`0`,max:`1`,step:`0.01`,value:`0.9`,on(e){d.uniforms.uGapRandomness.value=e}},{label:`GAP`,type:`range`,min:`0.01`,max:`0.15`,step:`0.002`,value:`0.04`,on(e){d.uniforms.uGapWidth.value=e}},{label:`ROLLOFF`,type:`range`,min:`0`,max:`0.3`,step:`0.005`,value:`0.12`,on(e){d.uniforms.uEdgeRolloff.value=e}}],setSize(e,t){d.uniforms.uResolution.value.set(e,t)},render(e,t){d.uniforms.uTime.value=t,e.render(c,l)},dispose(){u.dispose(),d.dispose()}}}export{o as t};