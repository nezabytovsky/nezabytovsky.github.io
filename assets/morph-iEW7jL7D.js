import{$ as e,F as t,M as n,U as r,V as i,W as a,a as o,c as s,et as c,j as ee,l,n as u,o as te,p as d,s as f}from"./three.module-DGOwXJQ9.js";import{n as p,r as ne,t as re}from"./UnrealBloomPass-DBEOS1AR.js";import{t as m}from"./OrbitControls-logFloET.js";import{t as h}from"./controls-ATJ4Gvg2.js";var g=16e4,_=42,v=3.2,ie=4,ae=2.6,y=.7,b=.35,oe=.1,se=.08,ce=.04,x=.15,S=.2,C=.2,w=new r;w.background=new l(197644);var T=new ee(60,window.innerWidth/window.innerHeight,.1,100);T.position.set(0,3.5,13);var E=new u({antialias:!0});E.setSize(window.innerWidth,window.innerHeight),E.setPixelRatio(Math.min(window.devicePixelRatio,2)),E.domElement.style.cssText=`position:fixed;top:0;left:0;z-index:0;`,document.body.appendChild(E.domElement);var D=new m(T,E.domElement);D.enableDamping=!0,D.dampingFactor=.08,D.autoRotate=!0,D.autoRotateSpeed=.35,D.enablePan=!1,D.minDistance=6,D.maxDistance=30,D.target.set(0,0,0);var O=new ne(E);O.addPass(new p(w,T));var k=new re(new e(window.innerWidth,window.innerHeight),x,S,C);O.addPass(k),h(document.getElementById(`ctrl-panel`),[{label:`Swirl`,type:`range`,min:0,max:3,step:.05,value:y,on:e=>{z.uniforms.uSwirl.value=e}},{label:`Turbulence`,type:`range`,min:0,max:1,step:.01,value:b,on:e=>{z.uniforms.uTurb.value=e}},{label:`Point Size`,type:`range`,min:10,max:120,step:1,value:_,on:e=>{z.uniforms.uPointSize.value=e}},{label:`Bloom`,type:`range`,min:0,max:2,step:.01,value:x,on:e=>{k.strength=e}},{label:`Bloom Radius`,type:`range`,min:0,max:1,step:.01,value:S,on:e=>{k.radius=e}},{label:`Bloom Threshold`,type:`range`,min:0,max:1,step:.01,value:C,on:e=>{k.threshold=e}}]);var A=5.2;function j(e){let t=.55;for(let n=0;n<g;n++){let r=n*3,i=Math.random()**.6*A,a=n%5/5*Math.PI*2+i*1.05,o=Math.random()**3*(Math.random()<.5?1:-1)*t*(i*.3+.3),s=Math.random()**3*(Math.random()<.5?1:-1)*t*.5,c=Math.random()**3*(Math.random()<.5?1:-1)*t*(i*.3+.3);e[r]=Math.cos(a)*i+o,e[r+1]=s,e[r+2]=Math.sin(a)*i+c}}function le(e){let t=Math.PI*(3-Math.sqrt(5));for(let n=0;n<g;n++){let r=n*3,i=1-n/(g-1)*2,a=Math.sqrt(Math.max(0,1-i*i)),o=n*t,s=A*.85*(.96+Math.random()*.04);e[r]=Math.cos(o)*a*s,e[r+1]=i*s,e[r+2]=Math.sin(o)*a*s}}function ue(e){let t=A*.7,n=A*.26;for(let r=0;r<g;r++){let i=r*3,a=Math.random()*Math.PI*2,o=Math.random()*Math.PI*2,s=n*(.85+Math.random()*.15);e[i]=(t+s*Math.cos(o))*Math.cos(a),e[i+1]=s*Math.sin(o),e[i+2]=(t+s*Math.cos(o))*Math.sin(a)}}function de(e){let t=A*1.9,n=A*.42;for(let r=0;r<g;r++){let i=r*3,a=r/g,o=r%2,s=a*5*Math.PI*2+o*Math.PI;if(Math.random()<.3){let r=Math.random();e[i]=Math.cos(s)*n*(1-r)+Math.cos(s+Math.PI)*n*r,e[i+1]=(a-.5)*t,e[i+2]=Math.sin(s)*n*(1-r)+Math.sin(s+Math.PI)*n*r}else{let r=.12;e[i]=Math.cos(s)*n+(Math.random()-.5)*r,e[i+1]=(a-.5)*t+(Math.random()-.5)*r,e[i+2]=Math.sin(s)*n+(Math.random()-.5)*r}}}function fe(e){for(let t=0;t<g;t++){let n=t*3,r=Math.random()*Math.PI*2,i=A*(.95+(Math.random()-.5)*.18),a=(Math.random()-.5)*.7;e[n]=Math.cos(r)*i,e[n+1]=a+Math.sin(r*6)*.2,e[n+2]=Math.sin(r)*i}}var M=[j,le,ue,de,fe].map(e=>{let t=new Float32Array(g*3);return e(t),t}),N=new te,P=new Float32Array(g*3),F=new Float32Array(g*3),I=new Float32Array(g*3);P.set(M[0]),F.set(M[1]);for(let e=0;e<g*3;e++)I[e]=Math.random();var L=new o(P,3),R=new o(F,3);L.setUsage(d),R.setUsage(d),N.setAttribute(`position`,L),N.setAttribute(`aPosA`,L),N.setAttribute(`aPosB`,R),N.setAttribute(`aSeed`,new o(I,3));var z=new a({uniforms:{uTime:{value:0},uMorph:{value:0},uIntro:{value:0},uSwirl:{value:y},uTurb:{value:b},uPointSize:{value:_},uTexture:{value:ge()},uMouse:{value:new c(0,0,-999)},uMouseStrength:{value:0},uColorCore:{value:new l(1,.9,.8)},uColorMid:{value:new l(.2,.6,1)},uColorEdge:{value:new l(.85,.25,.95)}},vertexShader:`
    attribute vec3 aPosA;
    attribute vec3 aPosB;
    attribute vec3 aSeed;

    uniform float uTime;
    uniform float uMorph;
    uniform float uIntro;
    uniform float uSwirl;
    uniform float uTurb;
    uniform float uPointSize;
    uniform vec3 uMouse;
    uniform float uMouseStrength;
    uniform vec3 uColorCore;
    uniform vec3 uColorMid;
    uniform vec3 uColorEdge;

    varying vec3 vColor;
    varying float vAlpha;

    float hash(float n) { return fract(sin(n) * 43758.5453123); }

    float noise3D(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      float n = i.x + i.y * 57.0 + i.z * 113.0;
      return mix(
        mix(mix(hash(n), hash(n + 1.0), f.x),
            mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
        f.z);
    }

    vec3 curl3D(vec3 p) {
      float e = 0.4;
      float ny = noise3D(p + vec3(0.0, e, 0.0)) - noise3D(p - vec3(0.0, e, 0.0));
      float nz = noise3D(p + vec3(0.0, 0.0, e)) - noise3D(p - vec3(0.0, 0.0, e));
      float nx = noise3D(p + vec3(e, 0.0, 0.0)) - noise3D(p - vec3(e, 0.0, 0.0));
      return vec3(ny - nz, nz - nx, nx - ny) / e;
    }

    mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

    void main() {
      float m = smoothstep(0.0, 1.0, uMorph);
      vec3 pos = mix(aPosA, aPosB, m);

      // Differential swirl — inner particles rotate faster (galaxy-like).
      float rad = length(pos.xz);
      float ang = uTime * uSwirl / (rad * 0.35 + 0.5);
      pos.xz = rot(ang) * pos.xz;

      // Curl-noise shimmer keeps shapes alive.
      pos += curl3D(pos * 0.22 + vec3(0.0, uTime * 0.05, 0.0)) * uTurb;

      // Intro: assemble from a scattered cloud.
      float intro = smoothstep(0.0, 1.0, uIntro);
      vec3 dir = normalize(pos + aSeed * 2.0 - 1.0 + 0.001);
      vec3 scatter = pos * 2.5 + dir * (5.0 + aSeed.z * 10.0);
      pos = mix(scatter, pos, intro);

      // Mouse vortex.
      vec3 toMouse = pos - uMouse;
      float md = length(toMouse);
      if (md < 4.0 && uMouseStrength > 0.01) {
        float f = uMouseStrength / (md * md * 0.25 + 0.06);
        pos -= normalize(toMouse) * f * 1.6;
        vec3 tang = normalize(cross(normalize(toMouse), vec3(0.0, 1.0, 0.0)));
        pos += tang * f * 1.3;
      }

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = (uPointSize / -mv.z) * (0.45 + aSeed.x * 0.85);

      // Color: warm core → blue mid → violet edge.
      float cr = clamp(rad / 6.0, 0.0, 1.0);
      vec3 col = mix(uColorCore, uColorMid, smoothstep(0.0, 0.45, cr));
      col = mix(col, uColorEdge, smoothstep(0.45, 1.0, cr));
      float twinkle = 0.7 + 0.5 * sin(uTime * 0.6 + aSeed.x * 6.28318);
      vColor = col * (0.65 + 0.7 * twinkle);
      vAlpha = (0.3 + 0.7 * aSeed.x) * intro;
    }
  `,fragmentShader:`
    uniform sampler2D uTexture;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vec4 tex = texture2D(uTexture, gl_PointCoord);
      gl_FragColor = vec4(vColor * tex.rgb, tex.a * vAlpha);
    }
  `,blending:2,depthWrite:!1,transparent:!0}),B=new t(N,z);B.frustumCulled=!1,w.add(B);var V=0,H=1,U=`hold`,W=0;function pe(){V=H,H=(H+1)%M.length,P.set(M[V]),F.set(M[H]),L.needsUpdate=!0,R.needsUpdate=!0,z.uniforms.uMorph.value=0}var G=new e,K=new i,me=new n(new c(0,0,1),0),q=new c,J=new c,Y=new c(0,0,-999),X=!1,Z=0;window.addEventListener(`pointermove`,e=>{G.x=e.clientX/window.innerWidth*2-1,G.y=-(e.clientY/window.innerHeight)*2+1,X=!0}),window.addEventListener(`pointerleave`,()=>{X=!1});function he(){X&&(K.setFromCamera(G,T),K.ray.intersectPlane(me,q)&&J.copy(q)),Y.lerp(J,oe),Z+=(+!!X-Z)*(X?se:ce),z.uniforms.uMouse.value.copy(Y),z.uniforms.uMouseStrength.value=Z}var Q=new s;function $(){requestAnimationFrame($);let e=Math.min(Q.getDelta(),.05),t=Q.getElapsedTime();if(z.uniforms.uTime.value=t,z.uniforms.uIntro.value=Math.min(1,t/v),z.uniforms.uIntro.value>=1)if(W+=e,U===`hold`)W>=ie&&(U=`morph`,W=0);else{let e=Math.min(1,W/ae);z.uniforms.uMorph.value=e,e>=1&&(pe(),U=`hold`,W=0)}he(),D.update(),O.render()}$(),window.addEventListener(`resize`,()=>{T.aspect=window.innerWidth/window.innerHeight,T.updateProjectionMatrix(),E.setSize(window.innerWidth,window.innerHeight),O.setSize(window.innerWidth,window.innerHeight)}),document.addEventListener(`keydown`,e=>{if(e.code===`KeyG`&&!e.metaKey&&!e.ctrlKey&&!e.altKey){let e=document.getElementById(`ctrl-panel`);e.style.display=e.style.display===`none`?``:`none`}});function ge(){let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.1,`rgba(255,255,255,0.9)`),n.addColorStop(.35,`rgba(255,255,255,0.45)`),n.addColorStop(.7,`rgba(255,255,255,0.1)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),new f(e)}