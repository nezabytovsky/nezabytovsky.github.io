import{F as e,U as t,W as n,a as r,c as i,j as a,l as o,n as s,o as c}from"./three.module-DYuz7n-v.js";var l=500,u=18,d=.04,f=.06,p=3,m=new c,h=new Float32Array(l*3),g=new Float32Array(l);for(let e=0;e<l;e++){let t=Math.random()*Math.PI*2,n=Math.sqrt(Math.random())*u,r=(Math.random()-.5)*8;h[e*3]=Math.cos(t)*n,h[e*3+1]=r,h[e*3+2]=Math.sin(t)*n,g[e]=Math.random()*Math.PI*2}m.setAttribute(`position`,new r(h,3)),m.setAttribute(`aSeed`,new r(g,1));var _=new n({uniforms:{uTime:{value:0},uRotateSpeed:{value:d},uRiseSpeed:{value:f},uPointSize:{value:p}},vertexShader:`
    attribute float aSeed;
    uniform float uTime;
    uniform float uRotateSpeed;
    uniform float uRiseSpeed;
    uniform float uPointSize;
    varying float vAlpha;
    void main() {
      vec3 pos = position;
      // Clockwise rotation around Y axis
      float angle = uTime * uRotateSpeed + aSeed * 0.1;
      float cosA = cos(angle);
      float sinA = sin(angle);
      float x = pos.x * cosA + pos.z * sinA;
      float z = -pos.x * sinA + pos.z * cosA;
      pos.x = x;
      pos.z = z;
      // Slow vertical drift
      pos.y += sin(uTime * uRiseSpeed + aSeed) * 0.3;
      // Twinkle
      float twinkle = 0.5 + 0.5 * sin(uTime * 0.5 + aSeed * 3.0);
      vAlpha = 0.2 + 0.4 * twinkle;
      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      float sizeVar = 1.0 + aSeed * 2.5;
      gl_PointSize = (uPointSize * (2.5 + sizeVar)) / -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `,fragmentShader:`
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(1.0, 1.0, 1.0, a * vAlpha);
    }
  `,transparent:!0,blending:2,depthWrite:!1}),v=new e(m,_),y=new t;y.background=new o(328976);var b=new a(60,window.innerWidth/window.innerHeight,.1,100);b.position.set(0,0,16);var x=new s({antialias:!0});x.setSize(window.innerWidth,window.innerHeight),x.setPixelRatio(Math.min(window.devicePixelRatio,2)),x.domElement.style.cssText=`position:fixed;top:0;left:0;z-index:0;`,document.body.prepend(x.domElement),y.add(v);var S=new i;function C(){requestAnimationFrame(C),_.uniforms.uTime.value=S.getElapsedTime(),x.render(y,b)}C(),window.addEventListener(`resize`,()=>{b.aspect=window.innerWidth/window.innerHeight,b.updateProjectionMatrix(),x.setSize(window.innerWidth,window.innerHeight)});