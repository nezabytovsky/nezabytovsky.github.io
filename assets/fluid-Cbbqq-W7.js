import{F as e,W as t,a as n,et as r,o as i,s as a}from"./three.module-DmW5sRKN.js";function o(e=[[0,1],[.1,.9],[.4,.5],[.7,.1],[1,0]]){let t=document.createElement(`canvas`);t.width=t.height=64;let n=t.getContext(`2d`),r=n.createRadialGradient(32,32,0,32,32,32);for(let[t,n]of e)r.addColorStop(t,`rgba(255,255,255,${n})`);return n.fillStyle=r,n.fillRect(0,0,64,64),new a(t)}var s=`
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 snoiseVec3(vec3 x){
    return vec3(
      snoise(x),
      snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
      snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
    );
  }

  // Curl of the vector-potential noise field → divergence-free flow.
  vec3 curlNoise(vec3 p){
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    vec3 p_x0 = snoiseVec3(p - dx);
    vec3 p_x1 = snoiseVec3(p + dx);
    vec3 p_y0 = snoiseVec3(p - dy);
    vec3 p_y1 = snoiseVec3(p + dy);
    vec3 p_z0 = snoiseVec3(p - dz);
    vec3 p_z1 = snoiseVec3(p + dz);
    float x = (p_y1.z - p_y0.z) - (p_z1.y - p_z0.y);
    float y = (p_z1.x - p_z0.x) - (p_x1.z - p_x0.z);
    float z = (p_x1.y - p_x0.y) - (p_y1.x - p_y0.x);
    return vec3(x, y, z) / (2.0 * e);
  }
`;function c({count:a=16e4,pointSize:c=26}={}){let l=new i,u=new Float32Array(a*3),d=new Float32Array(a*3);for(let e=0;e<a;e++){let t=Math.random()*Math.PI*2,n=Math.acos(2*Math.random()-1),r=Math.cbrt(Math.random());u[e*3]=r*Math.sin(n)*Math.cos(t)*5,u[e*3+1]=r*Math.sin(n)*Math.sin(t)*3.6,u[e*3+2]=r*Math.cos(n)*3.6,d[e*3]=Math.random(),d[e*3+1]=Math.random(),d[e*3+2]=Math.random()*.5+.5}l.setAttribute(`position`,new n(u,3)),l.setAttribute(`aSeed`,new n(d,3));let f=new t({uniforms:{uTime:{value:0},uMouse:{value:new r(0,0,-999)},uMouseVel:{value:new r(0,0,0)},uMouseStrength:{value:0},uMouseRadius:{value:5},uAttract:{value:4.5},uDrag:{value:1.5},uFlowSpeed:{value:.01},uNoiseScale:{value:.18},uAmplitude:{value:4.5},uLifeSpeed:{value:.13},uPointSize:{value:c},uTexture:{value:o()}},vertexShader:`
      #define STEPS 8
      attribute vec3 aSeed;
      varying float vAlpha;
      varying vec3 vColor;
      uniform float uTime;
      uniform vec3 uMouse;
      uniform vec3 uMouseVel;
      uniform float uMouseStrength;
      uniform float uMouseRadius;
      uniform float uAttract;
      uniform float uDrag;
      uniform float uFlowSpeed;
      uniform float uNoiseScale;
      uniform float uAmplitude;
      uniform float uLifeSpeed;
      uniform float uPointSize;

      ${s}

      void main() {
        // Each particle has a looping life. Over its life it is advected ALONG
        // the curl flow (Euler integration) away from its spawn point, then
        // recycles. A sin() fade hides the reset, giving streaming filaments.
        float lifeSpeed = uLifeSpeed * (0.6 + aSeed.z * 0.8);
        float life = fract(uTime * lifeSpeed + aSeed.x);

        vec3 pos = position;
        float h = uAmplitude / float(STEPS);
        float speed = 0.0;
        for (int i = 0; i < STEPS; i++) {
          if (float(i) / float(STEPS) > life) break;
          vec3 sm = pos * uNoiseScale + vec3(0.0, uTime * uFlowSpeed, 0.0);
          vec3 v = curlNoise(sm);
          speed = length(v);
          pos += v * h;
        }

        // Mouse attraction: particles are pulled toward the cursor with a
        // smooth, long-range falloff (Lorentzian) so they stretch toward it
        // like tendrils — no hard spherical boundary.
        vec3 toMouse = uMouse - pos;
        float dist = length(toMouse);
        vec3 dir = toMouse / max(dist, 1e-3);
        float infl = uMouseStrength / (1.0 + (dist * dist) / (uMouseRadius * uMouseRadius));
        float pull = min(infl * uAttract, dist * 0.9); // don't overshoot the cursor
        pos += dir * pull;
        pos += uMouseVel * infl * uDrag;                // lean with the cursor's motion
        speed += infl * 1.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (uPointSize / -mvPosition.z) * (0.6 + aSeed.y * 0.5);

        // Color driven by local flow speed: slow core is deep teal, fast streaks
        // brighten toward cyan/white for depth and energy.
        float s = clamp(speed * 0.9, 0.0, 1.0);
        vec3 slow = vec3(0.04, 0.26, 0.5);
        vec3 fast = vec3(0.55, 0.95, 1.0);
        vColor = mix(slow, fast, s) * (0.7 + aSeed.z * 0.5);
        // Glow harder where the mouse is influencing the fluid.
        vColor += vec3(0.4, 0.75, 1.0) * infl * 1.6;

        // Fade in at birth and out at death so the recycle is invisible.
        float lifeFade = sin(life * 3.14159265);
        vAlpha = (0.3 + aSeed.y * 0.5 + s * 0.35) * lifeFade + infl * 0.5;
      }
    `,fragmentShader:`
      uniform sampler2D uTexture;
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        gl_FragColor = vec4(vColor * tex.rgb, tex.a * vAlpha);
      }
    `,blending:2,depthWrite:!1,transparent:!0});return{objects:[new e(l,f)],background:1296,camera:{fov:60,position:[0,.5,13],target:[0,0,0]},uniforms:f.uniforms,setPointer(e,t,n){f.uniforms.uMouse.value.copy(e),f.uniforms.uMouseStrength.value=t,n?f.uniforms.uMouseVel.value.copy(n):f.uniforms.uMouseVel.value.set(0,0,0)},update(e){f.uniforms.uTime.value=e},dispose(){l.dispose(),f.dispose(),f.uniforms.uTexture.value.dispose()}}}export{c as t};