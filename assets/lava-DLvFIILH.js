import{$ as e,A as t,N as n,U as r,W as i,w as a}from"./three.module-DCYiBNzM.js";function o({width:o,height:s}={}){let c=new r,l=new t(-1,1,1,-1,.1,10);l.position.z=1;let u=new n(2,2),d=new i({uniforms:{uTime:{value:0},uResolution:{value:new e(o,s)},uSpeed:{value:1},uScale:{value:1},uBrightness:{value:1}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime, uSpeed, uScale, uBrightness;

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
        for (int i = 0; i < 5; i++) {
          v += a * valueNoise(p);
          p = rot * p * 2.1;
          a *= 0.5;
        }
        return v;
      }

      float ridgedNoise(vec2 p) {
        float n = valueNoise(p);
        return 1.0 - abs(2.0 * n - 1.0);
      }

      float ridgedFBM(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        float prev = 1.0;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 5; i++) {
          float r = ridgedNoise(p);
          r *= r;
          v += a * r * prev;
          prev = r;
          p = rot * p * 2.2;
          a *= 0.55;
        }
        return v;
      }

      vec2 domainWarp(vec2 p) {
        float t = uTime * uSpeed;
        vec2 q = vec2(
          fbm(p + vec2(0.0, 3.7) + vec2(t * 0.06, t * 0.04)),
          fbm(p + vec2(5.1, 1.3) + vec2(-t * 0.05, t * 0.07))
        );
        vec2 r = vec2(
          fbm(p + 3.8 * q + vec2(1.7, 9.2) + vec2(t * 0.03)),
          fbm(p + 3.8 * q + vec2(8.3, 2.8) + vec2(-t * 0.04))
        );
        return p + 1.2 * r;
      }

      float heightField(vec2 p) {
        vec2 wp = domainWarp(p * 0.8);
        float h = fbm(wp * 1.5);
        h += 0.3 * fbm(wp * 3.0 + 10.0);
        h += 0.15 * valueNoise(wp * 6.0);
        return h;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;

        float scale = 3.0 * uScale;
        vec2 cuv = uv - 0.5;
        cuv.x *= uResolution.x / uResolution.y;
        vec2 st = cuv * scale;

        float t = uTime * uSpeed;
        st.y += t * 0.05;
        vec2 wst = domainWarp(st * 1.6);
        float eps = 0.02;
        float hC = heightField(st);
        float hR = heightField(st + vec2(eps, 0.0));
        float hU = heightField(st + vec2(0.0, eps));
        vec3 normal = normalize(vec3(
          (hC - hR) / eps,
          (hC - hU) / eps,
          1.0
        ));

        vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
        float diffuse = max(dot(normal, lightDir), 0.0);
        diffuse = diffuse * 0.6 + 0.4;

        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfDir = normalize(lightDir + viewDir);
        float specular = pow(max(dot(normal, halfDir), 0.0), 20.0) * 0.15;

        float crackRaw = ridgedFBM(wst * 2.5);
        float crackSharp = pow(crackRaw, 3.5);

        float crackDetail = ridgedFBM(wst * 5.0 + 7.7);
        float crackFine = pow(crackDetail, 4.0) * 0.4;
        crackSharp = max(crackSharp, crackFine);

        float hotZone = fbm(st * 0.4 + vec2(13.1, 7.3) + vec2(t * 0.03, -t * 0.02));
        hotZone = smoothstep(0.35, 0.65, hotZone);

        float crackMask = crackSharp * (0.5 + 0.5 * hotZone);
        crackMask = clamp(crackMask, 0.0, 1.0);

        float lavaPulse = 0.85 + 0.15 * sin(t * 4.8 + fbm(st * 2.0) * 6.0);
        float lavaFlow = valueNoise(wst * 6.0 + vec2(t * 0.4, -t * 0.3));
        float lavaFlow2 = valueNoise(wst * 12.0 + vec2(-t * 0.25, t * 0.35));
        float lavaIntensity = lavaPulse * (0.7 + 0.2 * lavaFlow + 0.1 * lavaFlow2);

        vec3 lavaCore = vec3(1.0, 0.75, 0.1);
        vec3 lavaMid = vec3(1.0, 0.32, 0.02);
        vec3 lavaEdge = vec3(0.45, 0.06, 0.0);

        float coreT = smoothstep(0.3, 0.8, crackMask);
        float midT = smoothstep(0.1, 0.45, crackMask);

        vec3 lavaColor = lavaEdge;
        lavaColor = mix(lavaColor, lavaMid, midT);
        lavaColor = mix(lavaColor, lavaCore, coreT);
        lavaColor *= (1.5 + 0.8 * hotZone) * lavaIntensity;

        vec3 rockBase = vec3(0.08, 0.06, 0.05);
        float rockVar = fbm(wst * 3.0 + 20.0);
        rockBase += vec3(0.04, 0.03, 0.02) * (rockVar - 0.5);
        rockBase *= diffuse;
        rockBase += specular * vec3(0.12, 0.10, 0.09);

        float grain = (valueNoise(st * 40.0) - 0.5) * 0.04;
        rockBase += grain;

        float bumpDetail = valueNoise(wst * 12.0);
        rockBase *= 0.85 + 0.3 * bumpDetail;

        float subsurface = smoothstep(0.0, 0.25, crackMask) * (1.0 - smoothstep(0.25, 0.6, crackMask));
        vec3 subsurfaceColor = vec3(0.3, 0.05, 0.0);
        rockBase += subsurfaceColor * subsurface * (0.6 + 0.4 * hotZone) * lavaPulse;

        float crackBlend = smoothstep(0.02, 0.15, crackMask);
        vec3 col = mix(rockBase, lavaColor, crackBlend);

        float edgeGlow = smoothstep(0.02, 0.08, crackMask) * 0.35;
        col += vec3(0.25, 0.04, 0.0) * edgeGlow * (0.7 + 0.3 * hotZone) * lavaPulse;

        col *= uBrightness;
        gl_FragColor = vec4(col, 1.0);
      }
    `});return c.add(new a(u,d)),{uniforms:d.uniforms,controlDefs:[{label:`SPEED`,type:`range`,min:`0`,max:`3`,step:`0.1`,value:`1`,on(e){d.uniforms.uSpeed.value=e}},{label:`SCALE`,type:`range`,min:`0.5`,max:`5`,step:`0.1`,value:`1`,on(e){d.uniforms.uScale.value=e}},{label:`BRIGHTNESS`,type:`range`,min:`0.5`,max:`2.5`,step:`0.05`,value:`1`,on(e){d.uniforms.uBrightness.value=e}}],setSize(e,t){d.uniforms.uResolution.value.set(e,t)},render(e,t){d.uniforms.uTime.value=t,e.render(c,l)},dispose(){u.dispose(),d.dispose()}}}export{o as t};