import{$ as e,A as t,N as n,U as r,W as i,l as a,w as o}from"./three.module-DsNDpfSU.js";function s({width:s,height:c}={}){let l=new r;l.background=new a(1296);let u=new t(-1,1,1,-1,.1,10);u.position.z=1;let d=new n(2,2),f=new i({uniforms:{uResolution:{value:new e(s,c)},uTime:{value:0},uAnimSpeed:{value:1},uJuliaR:{value:.355},uJuliaI:{value:.355},uMaxIterF:{value:100},uZoom:{value:1},uPan:{value:new e(0,0)},uColorCycle:{value:0},uUseJuliaF:{value:1}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime, uAnimSpeed;
      uniform float uJuliaR, uJuliaI;
      uniform float uMaxIterF;
      uniform float uZoom;
      uniform vec2 uPan;
      uniform float uColorCycle;
      uniform float uUseJuliaF;
      vec3 palette(float t, float cycle) {
        return 0.5 + 0.5 * cos(6.28318 * (t * 2.5 + cycle + vec3(0.0, 0.33, 0.67)));
      }
      void main() {
        vec2 uv = vUv - 0.5;
        float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;
        uv = uv / uZoom + uPan;
        int maxIter = int(uMaxIterF);
        float animT = uTime * uAnimSpeed;
        float animatedCycle = uColorCycle + animT * 0.08;
        vec2 z, c;
        if (int(uUseJuliaF) == 1) {
          z = uv;
          c = vec2(uJuliaR + sin(animT * 0.4) * 0.06, uJuliaI + cos(animT * 0.35) * 0.06);
        } else {
          z = vec2(0.0);
          c = uv;
        }
        int iter = 0;
        for (int i = 0; i < 200; i++) {
          if (i >= maxIter) break;
          z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
          if (dot(z, z) > 16.0) break;
          iter++;
        }
        float frac = float(iter) / float(maxIter);
        float smoothVal = frac;
        if (iter < maxIter) {
          float log_zn = log(dot(z, z)) / 2.0;
          float nu = log(log_zn / log(2.0)) / log(2.0);
          smoothVal = (float(iter) + 1.0 - nu) / float(maxIter);
        }
        vec3 col = palette(smoothVal, animatedCycle);
        if (iter >= maxIter) col = vec3(0.0, 0.0, 0.02);
        gl_FragColor = vec4(col, 1.0);
      }
    `});l.add(new o(d,f));let p={panTarget:new e,zoomTarget:1};return{uniforms:f.uniforms,controlDefs:[{label:`MODE`,type:`toggle`,value:`1`,options:[`MANDELBROT`,`JULIA`],on(e){f.uniforms.uUseJuliaF.value=e,e===1?(p.panTarget.set(0,0),p.zoomTarget=1):(p.panTarget.set(-.7,0),p.zoomTarget=.55)}},{label:`JULIA R`,type:`range`,min:`-1`,max:`1`,step:`0.01`,value:`0.355`,on(e){f.uniforms.uJuliaR.value=e}},{label:`JULIA I`,type:`range`,min:`-1`,max:`1`,step:`0.01`,value:`0.355`,on(e){f.uniforms.uJuliaI.value=e}},{label:`ZOOM`,type:`range`,min:`0.2`,max:`10`,step:`0.1`,value:`1`,on(e){p.zoomTarget=e}},{label:`SPEED`,type:`range`,min:`0`,max:`5`,step:`0.1`,value:`1`,on(e){f.uniforms.uAnimSpeed.value=e}},{label:`CYCLE`,type:`range`,min:`0`,max:`6.28`,step:`0.01`,value:`0`,on(e){f.uniforms.uColorCycle.value=e}}],setSize(e,t){f.uniforms.uResolution.value.set(e,t)},pan(e,t){let n=f.uniforms.uResolution.value.x/f.uniforms.uResolution.value.y;p.panTarget.x-=e/f.uniforms.uZoom.value*n,p.panTarget.y+=t/f.uniforms.uZoom.value},zoomBy(e){p.zoomTarget=Math.max(.1,Math.min(200,p.zoomTarget*e))},render(e,t){f.uniforms.uTime.value=t,f.uniforms.uPan.value.lerp(p.panTarget,.1),f.uniforms.uZoom.value+=(p.zoomTarget-f.uniforms.uZoom.value)*.1,f.uniforms.uMaxIterF.value=Math.floor(50+100*Math.log(f.uniforms.uZoom.value+1)),e.render(l,u)},dispose(){d.dispose(),f.dispose()}}}export{s as t};