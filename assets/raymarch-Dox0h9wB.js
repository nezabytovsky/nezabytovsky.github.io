import{$ as e,A as t,N as n,U as r,W as i,et as a,l as o,w as s}from"./three.module-DsNDpfSU.js";function c({width:c,height:l}={}){let u=new r,d=new t(-1,1,1,-1,.1,10);d.position.z=1;let f=new n(2,2),p=new i({uniforms:{uTime:{value:0},uResolution:{value:new e(c,l)},uCamera:{value:new a(0,0,3)},uCameraAng:{value:new e(0,0)},uBlend:{value:.4},uTimeSpeed:{value:1},uLightInt:{value:1.5},uSpecular:{value:32},uBgColor:{value:new o(`#080818`)},uObjColor:{value:new o(`#ff5533`)},uShape:{value:0}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform vec3 uCamera;
      uniform vec2 uCameraAng;
      uniform float uTime, uBlend, uTimeSpeed, uLightInt, uSpecular;
      uniform vec3 uBgColor, uObjColor;
      uniform int uShape;
      float sdSphere(vec3 p, float r) { return length(p) - r; }
      float sdBox(vec3 p, vec3 b) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }
      float sdTorus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }
      float sdRoundBox(vec3 p, vec3 b, float r) { vec3 q = abs(p) - b; return length(max(q, 0.0)) - r + min(max(q.x, max(q.y, q.z)), 0.0); }
      float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
      }
      float map(vec3 p) {
        float t = uTime * uTimeSpeed;
        float b = uBlend;
        if (uShape == 0) {
          vec3 o1 = vec3(sin(t * 0.7), cos(t * 0.5), 0.0) * 0.3;
          vec3 o2 = -o1;
          float s = sdSphere(p - o1, 0.5);
          float torus = sdTorus(p - o2, vec2(0.4, 0.15));
          return smin(s, torus, b * 0.8);
        } else if (uShape == 1) {
          vec3 o1 = vec3(cos(t * 0.5), sin(t * 0.4), 0.0) * 0.35;
          vec3 o2 = -o1;
          float bx = sdRoundBox(p - o1, vec3(0.32), 0.08);
          float sp = sdSphere(p - o2, 0.4);
          return smin(bx, sp, b * 0.6);
        }
      }
      vec3 calcNormal(vec3 p) {
        vec2 e = vec2(0.001, 0.0);
        return normalize(vec3(
          map(p + e.xyy) - map(p - e.xyy),
          map(p + e.yxy) - map(p - e.yxy),
          map(p + e.yyx) - map(p - e.yyx)
        ));
      }
      void main() {
        vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / uResolution.y;
        float theta = uCameraAng.x;
        float phi = uCameraAng.y + 1.57;
        float dist = uCamera.z;
        vec3 ro = dist * vec3(sin(theta) * sin(phi), cos(phi), cos(theta) * sin(phi));
        vec3 fwd = normalize(-ro);
        vec3 wUp = abs(dot(fwd, vec3(0,1,0))) > 0.999 ? vec3(1,0,0) : vec3(0,1,0);
        vec3 right = normalize(cross(fwd, wUp));
        vec3 up = cross(right, fwd);
        vec3 rd = normalize(uv.x * right + uv.y * up + fwd * 2.0);
        float t = 0.0;
        float maxDist = 15.0;
        for (int i = 0; i < 80; i++) {
          float d = map(ro + rd * t);
          if (d < 0.0005) break;
          t += d;
          if (t > maxDist) break;
        }
        vec3 col = uBgColor;
        if (t < maxDist) {
          vec3 p = ro + rd * t;
          vec3 n = calcNormal(p);
          vec3 lightDir = normalize(vec3(0.5, 0.8, 0.6));
          float diff = max(dot(n, lightDir), 0.0);
          vec3 h = normalize(lightDir - rd);
          float spec = pow(max(dot(n, h), 0.0), uSpecular);
          col = uObjColor * (diff * uLightInt + 0.08) + spec * 0.4;
        }
        gl_FragColor = vec4(col, 1.0);
      }
    `});u.add(new s(f,p));let m={x:0,y:0};return{uniforms:p.uniforms,controlDefs:[{label:`SHAPE`,type:`toggle`,value:`0`,options:[`SPHERE+TORUS`,`BOX+SPHERE`],on(e){p.uniforms.uShape.value=e}},{label:`BLEND`,type:`range`,min:`0`,max:`1`,step:`0.01`,value:`0.4`,on(e){p.uniforms.uBlend.value=e}},{label:`SPEED`,type:`range`,min:`0`,max:`2`,step:`0.1`,value:`1`,on(e){p.uniforms.uTimeSpeed.value=e}},{label:`LIGHT`,type:`range`,min:`0.5`,max:`3`,step:`0.1`,value:`1.5`,on(e){p.uniforms.uLightInt.value=e}},{label:`SPECULAR`,type:`range`,min:`1`,max:`128`,step:`1`,value:`32`,on(e){p.uniforms.uSpecular.value=e}},{label:`BG`,type:`color`,value:`#080818`,on(e){p.uniforms.uBgColor.value.set(e)}},{label:`OBJECT`,type:`color`,value:`#ff5533`,on(e){p.uniforms.uObjColor.value.set(e)}}],setSize(e,t){p.uniforms.uResolution.value.set(e,t)},orbit(e,t){m.x+=e*.005,m.y+=t*.005,m.y=Math.max(-1.4,Math.min(1.4,m.y))},render(e,t){p.uniforms.uTime.value=t,p.uniforms.uCameraAng.value.set(m.x,m.y),e.render(u,d)},dispose(){f.dispose(),p.dispose()}}}export{c as t};