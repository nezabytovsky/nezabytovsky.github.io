import{F as e,U as t,W as n,a as r,j as i,l as a,o}from"./three.module-DCYiBNzM.js";function s({width:s,height:c,count:l=2e4}={}){let u=new t;u.background=new a(131600);let d=new i(55,s/c,.1,50);d.position.z=10;let f=new o,p=new Float32Array(l*3),m=new Float32Array(l*3);for(let e=0;e<l;e++){let t=Math.sqrt(Math.random())*3.5,n=Math.random()*Math.PI*2;p[e*3]=Math.cos(n)*t,p[e*3+1]=(Math.random()-.5)*4,p[e*3+2]=Math.sin(n)*t,m[e*3]=Math.random(),m[e*3+1]=Math.random(),m[e*3+2]=Math.random()}f.setAttribute(`position`,new r(p,3)),f.setAttribute(`aSeed`,new r(m,3));let h=new n({uniforms:{uTime:{value:0},uSpeed:{value:1},uNoiseScale:{value:2},uCurl:{value:1.2},uSize:{value:.06},uColor:{value:new a(`#44aaff`)},uOpacity:{value:.9}},vertexShader:`
      attribute vec3 aSeed;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime, uSpeed, uNoiseScale, uCurl, uSize, uOpacity;
      uniform vec3 uColor;
      float hash(float n) { return fract(sin(n) * 43758.5453123); }
      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = i.x + i.y * 57.0 + i.z * 113.0;
        return mix(
          mix(mix(hash(n), hash(n+1.0), f.x), mix(hash(n+57.0), hash(n+58.0), f.x), f.y),
          mix(mix(hash(n+113.0), hash(n+114.0), f.x), mix(hash(n+170.0), hash(n+171.0), f.x), f.y),
          f.z);
      }
      vec2 curl2(vec3 p) {
        float eps = 0.02;
        float dy = noise(p + vec3(0, eps, 0)) - noise(p - vec3(0, eps, 0));
        float dx = noise(p + vec3(eps, 0, 0)) - noise(p - vec3(eps, 0, 0));
        return vec2(dy, -dx) / (2.0 * eps);
      }
      void main() {
        vec3 p = position;
        float t = uTime * uSpeed * 0.15;
        vec3 flowSample = p * uNoiseScale * 0.4 + vec3(t, t * 0.7, t * 1.1);
        vec2 flow = curl2(flowSample) * uCurl;
        p.x += flow.x * 2.0;
        p.y += flow.y * 2.0;
        p = mod(p + 5.0, 10.0) - 5.0;
        p.z += sin(p.x * 0.5 + t * 2.0 + aSeed.z * 6.28) * 0.8;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (uSize * 240.0) / -mv.z;
        float bright = 0.5 + noise(p * 0.5 + t) * 0.5;
        vColor = uColor * (0.6 + bright * 1.2);
        vAlpha = uOpacity * (0.4 + aSeed.y * 0.6);
      }
    `,fragmentShader:`
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - smoothstep(0.4, 1.0, d)) * vAlpha;
        gl_FragColor = vec4(vColor, a);
      }
    `,transparent:!0,depthWrite:!1,blending:2});return u.add(new e(f,h)),{uniforms:h.uniforms,controlDefs:[{label:`SPEED`,type:`range`,min:`0.1`,max:`3`,step:`0.1`,value:`1`,on(e){h.uniforms.uSpeed.value=e}},{label:`NOISE`,type:`range`,min:`0.5`,max:`5`,step:`0.1`,value:`2`,on(e){h.uniforms.uNoiseScale.value=e}},{label:`CURL`,type:`range`,min:`0`,max:`3`,step:`0.1`,value:`1.2`,on(e){h.uniforms.uCurl.value=e}},{label:`SIZE`,type:`range`,min:`0.05`,max:`0.3`,step:`0.005`,value:`0.06`,on(e){h.uniforms.uSize.value=e}},{label:`OPACITY`,type:`range`,min:`0.1`,max:`1`,step:`0.05`,value:`0.8`,on(e){h.uniforms.uOpacity.value=e}},{label:`COLOR`,type:`color`,value:`#44aaff`,on(e){h.uniforms.uColor.value.set(e)}}],setSize(e,t){d.aspect=e/t,d.updateProjectionMatrix()},render(e,t){h.uniforms.uTime.value=t,e.render(u,d)},dispose(){f.dispose(),h.dispose()}}}export{s as t};