import{$ as e,A as t,N as n,O as r,R as i,U as a,W as o,g as s,l as c,s as l,tt as u,w as d}from"./three.module-DmW5sRKN.js";function f({width:f,height:p,scale:m=.6}={}){let h=m,g=new t(-1,1,1,-1,.1,10);g.position.z=1;let _=new n(2,2),v=0,y=0,b=null,x=null,S=!0,C=f,w=p,T=new o({uniforms:{uPrev:{value:null},uResolution:{value:new e(1,1)},uFeed:{value:.054},uKill:{value:.062},uDA:{value:1},uDB:{value:.5},uSpeed:{value:1}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform sampler2D uPrev;
      uniform vec2 uResolution;
      uniform float uFeed, uKill, uDA, uDB, uSpeed;
      void main() {
        vec2 t = 1.0 / uResolution;
        vec4 c  = texture2D(uPrev, vUv);
        // Weighted 9-point Laplacian (center -1, orthogonal 0.2, diagonal 0.05).
        // Stable at dt~1 for DA=1/DB=0.5 and avoids the checkerboard blow-up of
        // the simple 5-point stencil.
        vec4 lap = -c;
        lap += texture2D(uPrev, vUv + vec2(-t.x, 0.0)) * 0.2;
        lap += texture2D(uPrev, vUv + vec2( t.x, 0.0)) * 0.2;
        lap += texture2D(uPrev, vUv + vec2(0.0,  t.y)) * 0.2;
        lap += texture2D(uPrev, vUv + vec2(0.0, -t.y)) * 0.2;
        lap += texture2D(uPrev, vUv + vec2(-t.x,  t.y)) * 0.05;
        lap += texture2D(uPrev, vUv + vec2( t.x,  t.y)) * 0.05;
        lap += texture2D(uPrev, vUv + vec2(-t.x, -t.y)) * 0.05;
        lap += texture2D(uPrev, vUv + vec2( t.x, -t.y)) * 0.05;
        float a = c.r, b = c.g;
        float r = a * b * b;
        float dt = uSpeed;
        float na = a + (uDA * lap.r - r + uFeed * (1.0 - a)) * dt;
        float nb = b + (uDB * lap.g + r - (uKill + uFeed) * b) * dt;
        gl_FragColor = vec4(clamp(na, 0.0, 1.0), clamp(nb, 0.0, 1.0), 0.0, 1.0);
      }
    `}),E=new o({uniforms:{uTex:{value:null},uColorA:{value:new c(`#000a20`)},uColorB:{value:new c(`#40a0ff`)}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec3 uColorA, uColorB;
      void main() {
        vec4 s = texture2D(uTex, vUv);
        float total = s.r + s.g;
        vec3 col = mix(uColorA, uColorB, total * 0.7);
        float inten = smoothstep(0.05, 0.6, total);
        gl_FragColor = vec4(col * inten, 1.0);
      }
    `}),D=new a;D.add(new d(_,E));let O=new d(_,T),k=new a;k.add(O);function A(e,t){let n=document.createElement(`canvas`);n.width=v,n.height=y;let i=n.getContext(`2d`),s=i.createImageData(v,y);for(let e=0;e<v*y;e++)s.data[e*4]=255,s.data[e*4+1]=Math.random()<.04?255:0,s.data[e*4+2]=0,s.data[e*4+3]=255;i.putImageData(s,0,0);let c=new l(n);c.minFilter=r,c.magFilter=r;let u=new o({uniforms:{uTex:{value:c}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position,1.0); }`,fragmentShader:`uniform sampler2D uTex; varying vec2 vUv; void main() { gl_FragColor = texture2D(uTex, vUv); }`}),f=new a;f.add(new d(_,u)),e.setRenderTarget(t),e.render(f,g),e.setRenderTarget(null),u.dispose(),c.dispose()}function j(e){b&&b.dispose(),x&&x.dispose(),v=Math.max(1,Math.floor(C*h)),y=Math.max(1,Math.floor(w*h));let t={minFilter:r,magFilter:r,format:i,type:s};b=new u(v,y,t),x=new u(v,y,t),T.uniforms.uResolution.value.set(v,y),A(e,b),E.uniforms.uTex.value=b.texture,S=!1}function M(e){T.uniforms.uPrev.value=b.texture,e.setRenderTarget(x),e.render(k,g),e.setRenderTarget(null);let t=b;b=x,x=t,E.uniforms.uTex.value=b.texture}return{uniforms:T.uniforms,controlDefs:[{label:`FEED`,type:`range`,min:`0.02`,max:`0.08`,step:`0.001`,value:`0.054`,on(e){T.uniforms.uFeed.value=e}},{label:`KILL`,type:`range`,min:`0.04`,max:`0.07`,step:`0.001`,value:`0.062`,on(e){T.uniforms.uKill.value=e}},{label:`DIFF A`,type:`range`,min:`0.5`,max:`1.2`,step:`0.01`,value:`1.0`,on(e){T.uniforms.uDA.value=e}},{label:`DIFF B`,type:`range`,min:`0.2`,max:`0.6`,step:`0.01`,value:`0.5`,on(e){T.uniforms.uDB.value=e}},{label:`SPEED`,type:`range`,min:`0.2`,max:`1.0`,step:`0.05`,value:`1.0`,on(e){T.uniforms.uSpeed.value=e}},{label:`BG`,type:`color`,value:`#000a20`,on(e){E.uniforms.uColorA.value.set(e)}},{label:`PATTERN`,type:`color`,value:`#40a0ff`,on(e){E.uniforms.uColorB.value.set(e)}}],setSize(e,t){C=e,w=t,S=!0},render(e){S&&j(e),M(e),e.render(D,g)},dispose(){b&&b.dispose(),x&&x.dispose(),_.dispose(),T.dispose(),E.dispose()}}}export{f as t};