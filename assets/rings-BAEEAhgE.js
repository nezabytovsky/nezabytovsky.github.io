import{F as e,W as t,a as n,et as r,o as i,s as a}from"./three.module-DYuz7n-v.js";function o(e=[[0,1],[.08,.95],[.3,.55],[.6,.15],[1,0]]){let t=document.createElement(`canvas`);t.width=t.height=64;let n=t.getContext(`2d`),r=n.createRadialGradient(32,32,0,32,32,32);for(let[t,n]of e)r.addColorStop(t,`rgba(255,255,255,${n})`);return n.fillStyle=r,n.fillRect(0,0,64,64),new a(t)}function s({count:a=15e4,pointSize:s=10}={}){let c=4.5,l=Math.max(0,Math.round(a*.02)),u=Math.max(0,Math.round(a*.25)),d=Math.max(0,a-u-l),f=Math.floor(d/15),p=new Float32Array(a*3),m=new Float32Array(a*3),h=0;for(let e=0;e<u&&h<a;e++,h++){let e=Math.random()*Math.PI*2,t=Math.acos(2*Math.random()-1),n=c+(Math.random()-.5)*.3;p[h*3]=Math.sin(t)*Math.cos(e)*n,p[h*3+1]=Math.sin(t)*Math.sin(e)*n,p[h*3+2]=Math.cos(t)*n,m[h*3]=0,m[h*3+1]=Math.random(),m[h*3+2]=Math.random()*.4+.1}let g=c*.85;for(let e=0;e<15&&h<a;e++){let t=e/15*Math.PI,n=e*.5;for(let r=0;r<f&&h<a;r++,h++){let i=r/f*Math.PI*2,a=Math.cos(i)*g,o=(Math.random()-.5)*.3,s=Math.sin(i)*g,c=Math.cos(t),l=Math.sin(t),u=Math.cos(n),d=Math.sin(n),_=o*c-s*l,v=o*l+s*c;p[h*3]=a*u+v*d,p[h*3+1]=_,p[h*3+2]=-a*d+v*u,m[h*3]=1,m[h*3+1]=e,m[h*3+2]=.7+Math.random()*.3}}for(let e=0;e<l&&h<a;e++,h++){let e=Math.random()*Math.PI*2,t=Math.acos(2*Math.random()-1),n=Math.random()*Math.random()*.5;p[h*3]=Math.sin(t)*Math.cos(e)*n,p[h*3+1]=Math.sin(t)*Math.sin(e)*n,p[h*3+2]=Math.cos(t)*n,m[h*3]=2,m[h*3+1]=1,m[h*3+2]=.9+Math.random()*.1}let _=new i;_.setAttribute(`position`,new n(p,3)),_.setAttribute(`aSeed`,new n(m,3)),_.setDrawRange(0,h);let v=new t({uniforms:{uTime:{value:0},uSpeed:{value:.5},uSpin:{value:1},uPulse:{value:1},uWobble:{value:.5},uHue:{value:0},uBrightness:{value:1},uMouse:{value:new r(0,0,-999)},uMouseStrength:{value:0},uPointSize:{value:s},uTexture:{value:o()}},vertexShader:`
      attribute vec3 aSeed; varying float vAlpha; varying vec3 vColor;
      uniform float uTime; uniform float uSpeed; uniform float uSpin; uniform float uPulse;
      uniform float uWobble; uniform float uHue; uniform float uBrightness;
      uniform vec3 uMouse; uniform float uMouseStrength; uniform float uPointSize;
      void main() {
        vec3 pos = position; float seedY = aSeed.y; float brightness = aSeed.z; float type = aSeed.x;
        float t = uTime * uSpeed;
        pos *= 1.0 + sin(t * 0.25 + seedY * 3.0) * 0.3 * uPulse;
        if (type > 0.5 && type < 1.9) {
          float speed = (0.3 + seedY * 0.5) * uSpeed * uSpin;
          float dir = (seedY < 2.5) ? 1.0 : -1.0;
          float a = uTime * speed * dir;
          float r = length(pos.xz);
          float ang = atan(pos.z, pos.x) + a;
          pos.x = cos(ang) * r;
          pos.z = sin(ang) * r;
          pos.y += sin(t * 0.8 + seedY * 4.0 + pos.x * 0.5) * 0.3 * uWobble;
        }
        if (type > 1.5) { pos *= 1.0 + sin(t * 2.5 + seedY) * 0.25 * uPulse; }
        float dist = length(pos - uMouse);
        if (dist < 4.0 && uMouseStrength > 0.01) {
          vec3 dir = normalize(uMouse - pos + 0.001);
          float repel = uMouseStrength / (dist * dist * 0.2 + 0.05);
          vec3 tangent = normalize(cross(dir, vec3(0.0, 1.0, 0.0)) + 0.001);
          float swirl = uMouseStrength * 0.4 / (dist + 0.1);
          pos += dir * repel + tangent * swirl;
        }
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (uPointSize / -mv.z) * (0.5 + seedY * 0.5);
        float hue = 0.78 + seedY * 0.08 + uHue;
        vColor = uBrightness * brightness * vec3(
          0.3 + sin(hue * 6.28) * 0.35,
          0.15 + cos(hue * 6.28) * 0.2,
          0.4 + sin(hue * 6.28 + 1.5) * 0.4
        );
        if (type > 1.5) vColor = mix(vColor, vec3(1.0, 0.9, 0.95), 0.6);
        vAlpha = brightness * (1.0 - smoothstep(1.5, 5.5, length(pos)));
        if (type > 0.5 && type < 1.9) vAlpha = brightness * 1.1;
        if (type > 1.5) vAlpha *= 1.5;
      }
    `,fragmentShader:`
      uniform sampler2D uTexture; varying float vAlpha; varying vec3 vColor;
      void main() { vec4 t = texture2D(uTexture, gl_PointCoord); gl_FragColor = vec4(vColor * t.rgb, t.a * vAlpha); }
    `,blending:2,depthWrite:!1,transparent:!0});return{objects:[new e(_,v)],background:524312,camera:{fov:60,position:[0,.5,8],target:[0,0,0]},uniforms:v.uniforms,setPointer(e,t){v.uniforms.uMouse.value.copy(e),v.uniforms.uMouseStrength.value=t},update(e){v.uniforms.uTime.value=e},dispose(){_.dispose(),v.dispose(),v.uniforms.uTexture.value.dispose()}}}export{s as t};