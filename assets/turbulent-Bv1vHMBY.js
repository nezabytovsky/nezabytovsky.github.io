import{W as e,a as t,et as n,l as r,o as i,x as a}from"./three.module-DGOwXJQ9.js";function o({streams:o=5e3,seg:s=20}={}){let c=s,l=new i,u=new Float32Array(o*c*3),d=new Float32Array(o*c*2),f=new Float32Array(o*c),p=new Uint32Array(o*(c-1)*2),m=0;for(let e=0;e<o;e++){let t=23*Math.cbrt(Math.random()),n=Math.random()*Math.PI*2,r=Math.acos(2*Math.random()-1),i=t*Math.sin(r)*Math.cos(n),a=t*Math.sin(r)*Math.sin(n),o=t*Math.cos(r),s=Math.random(),l=Math.random(),h=e*c;for(let e=0;e<c;e++){let t=h+e;u[t*3]=i,u[t*3+1]=a,u[t*3+2]=o,d[t*2]=s,d[t*2+1]=l,f[t]=e/(c-1)}for(let e=0;e<c-1;e++)p[m++]=h+e,p[m++]=h+e+1}l.setAttribute(`position`,new t(u,3)),l.setAttribute(`aSeed`,new t(d,2)),l.setAttribute(`aT`,new t(f,1)),l.setIndex(new t(p,1));let h=new e({uniforms:{uTime:{value:0},uMouse:{value:new n(0,0,-999)},uMouseStrength:{value:0},uMouseForce:{value:1},uNoiseScale:{value:.22},uSpeed:{value:1.1},uCurl:{value:1},uBounds:{value:23},uLifetime:{value:9},uInvLifetime:{value:1/9},uSpeedScale:{value:2.6},uOpacity:{value:.9},uIntensity:{value:1.7},uColorA:{value:new r(1127423)},uColorB:{value:new r(65493)},uColorC:{value:new r(16723566)}},vertexShader:`
      #define SEG ${c}
      attribute vec2 aSeed; attribute float aT;
      varying float vAlpha; varying vec3 vColor;
      uniform float uTime; uniform vec3 uMouse; uniform float uMouseStrength; uniform float uMouseForce;
      uniform float uNoiseScale; uniform float uSpeed; uniform float uCurl;
      uniform float uBounds; uniform float uLifetime; uniform float uInvLifetime; uniform float uSpeedScale;
      uniform float uOpacity; uniform float uIntensity;
      uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
      float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float noise3D(vec3 x) {
        vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
              mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
          mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
              mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
      }
      vec3 curl3D(vec3 p) {
        float e = 0.4; float tt = uTime * 0.06;
        vec3 a = p + vec3(tt, -tt * 0.7, tt * 0.4);
        float ny = noise3D(a + vec3(0.0, e, 0.0)) - noise3D(a - vec3(0.0, e, 0.0));
        float nz = noise3D(a + vec3(0.0, 0.0, e)) - noise3D(a - vec3(0.0, 0.0, e));
        float nx = noise3D(a + vec3(e, 0.0, 0.0)) - noise3D(a - vec3(e, 0.0, 0.0));
        return vec3(ny - nz, nz - nx, nx - ny) / e;
      }
      vec3 velocity(vec3 p) {
        vec3 v = curl3D(p * uNoiseScale) * uCurl;
        v += curl3D(p * uNoiseScale * 2.3) * uCurl * 0.45;
        v += curl3D(p * uNoiseScale * 4.9) * uCurl * 0.2;
        v += vec3(-p.z, 0.0, p.x) * 0.18;
        v -= p * (0.04 + 0.03 * length(p) / uBounds);
        return v;
      }
      void main() {
        float life = fract(uTime * uInvLifetime + aSeed.x);
        float age = life * uLifetime;
        float dt = (age / float(SEG - 1)) * uSpeed;
        int steps = int(floor(aT * float(SEG - 1) + 0.5));
        vec3 pos = position;
        for (int i = 0; i < SEG - 1; i++) { if (i >= steps) break; pos += velocity(pos) * dt; }

        // ── mouse interaction ──
        float mDist = length(pos - uMouse);
        if (mDist < 5.0 && uMouseStrength > 0.01) {
          vec3 mDir = normalize(pos - uMouse + 0.001);
          float falloff = (1.0 - mDist / 5.0);
          float push = uMouseStrength * 0.8 * falloff * uMouseForce;
          vec3 tangent = normalize(cross(mDir, vec3(0.0, 1.0, 0.0)) + 0.001);
          float swirl = uMouseStrength * 0.6 * falloff * uMouseForce;
          pos += mDir * push + tangent * swirl;
        }

        float heat = clamp(length(velocity(pos)) / uSpeedScale, 0.0, 1.0);
        vec3 cool = mix(uColorA, uColorB, smoothstep(0.0, 0.5, heat));
        vec3 col = mix(cool, uColorC, smoothstep(0.5, 1.0, heat));
        col *= 0.85 + aSeed.y * 0.4;
        vColor = col * uIntensity;
        float lifeFade = sin(life * 3.14159265);
        float trailFade = pow(aT, 0.7);
        vAlpha = lifeFade * trailFade * uOpacity;
        // ── mouse glow ──
        float mGlow = smoothstep(3.0, 0.0, mDist) * uMouseStrength * 1.5 * uMouseForce;
        vColor *= 1.0 + mGlow * (1.0 - aT);
        vAlpha += mGlow * 0.5;
        // ── mouse swirl tint ──
        vColor += vec3(0.6, 0.2, 0.0) * mGlow * 0.3;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,fragmentShader:`
      varying float vAlpha; varying vec3 vColor;
      void main() { gl_FragColor = vec4(vColor * vAlpha, vAlpha); }
    `,blending:2,depthWrite:!1,transparent:!0}),g=new a(l,h);return g.frustumCulled=!1,{objects:[g],background:197642,camera:{fov:60,position:[0,2,24],target:[0,0,0]},uniforms:h.uniforms,update(e){h.uniforms.uTime.value=e},dispose(){l.dispose(),h.dispose()}}}export{o as t};