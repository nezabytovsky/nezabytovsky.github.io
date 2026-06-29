import{$ as e,A as t,N as n,U as r,W as i,w as a}from"./three.module-Cs8GzSxb.js";function o({width:o,height:s}={}){let c=new r,l=new t(-1,1,1,-1,.1,10);l.position.z=1;let u=new n(2,2),d=new i({uniforms:{uTime:{value:0},uResolution:{value:new e(o,s)},uSpeed:{value:1},uPetals:{value:1}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime, uSpeed, uPetals;

      const float PI = 3.14159265;

      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.5, 0.2, 0.7);
        return a + b * cos(2.0 * PI * (c * t + d));
      }

      vec4 arm(float r, float a, float petals, float twist, float spin, float thick, vec3 hue) {
        float wave = sin(petals * a + r * twist - spin);
        float band = abs(wave);
        float bright = smoothstep(0.0, 1.0, 1.0 - band / thick);
        return vec4(vec3(bright) * hue, 1.0);
      }

      void main() {
        vec2 uv = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;

        float r = length(uv);
        float a = atan(uv.y, uv.x);

        float t = uTime * uSpeed;
        vec3 col = vec3(0.0);

        for (int i = 0; i < 10; i++) {
          float layer = float(i) * 0.1;
          float petals = uPetals + floor(layer * 9.0);
          float twist = 6.0 * (0.5 - layer) + 2.0 * sin(t * 0.5);
          float spin = t * (0.6 + layer * 1.4);
          float la = a + layer * PI * 0.5;
          float thick = 0.35 + 0.25 * sin(t + layer * 5.0);
          vec3 hue = palette(a / (2.0 * PI) + r - layer + 0.2 * t);
          col += arm(r, la, petals, twist, spin, thick, hue).rgb * (1.0 - 0.6 * layer);
        }

        col += palette(0.21 * t) * smoothstep(0.25, 0.0, r) * 0.6;

        gl_FragColor = vec4(col, 1.0);
      }
    `});return c.add(new a(u,d)),{uniforms:d.uniforms,controlDefs:[{label:`SPEED`,type:`range`,min:`0`,max:`3`,step:`0.1`,value:`1`,on(e){d.uniforms.uSpeed.value=e}},{label:`PETALS`,type:`toggle`,value:`0`,options:[`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`],on(e){d.uniforms.uPetals.value=e+1}}],setSize(e,t){d.uniforms.uResolution.value.set(e,t)},render(e,t){d.uniforms.uTime.value=t,e.render(c,l)},dispose(){u.dispose(),d.dispose()}}}export{o as t};