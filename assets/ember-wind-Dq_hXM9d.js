import{F as e,J as t,W as n,a as r,et as i,o as a,q as o,s}from"./three.module-DCYiBNzM.js";function c(e=[[0,1],[.05,.95],[.25,.5],[.5,.15],[1,0]]){let t=document.createElement(`canvas`);t.width=t.height=64;let n=t.getContext(`2d`),r=n.createRadialGradient(32,32,0,32,32,32);for(let[t,n]of e)r.addColorStop(t,`rgba(255,255,255,${n})`);return n.fillStyle=r,n.fillRect(0,0,64,64),new s(t)}function l({core:s=1e5,ember:l=5e4,sizeCore:u=25,sizeEmber:d=10}={}){let f=s+l,p=.15,m=new a,h=new Float32Array(f*3),g=new Float32Array(f*3),_=0;for(let e=0;e<s;e++,_++){let e=Math.random()*6,t=e*.8+p,n=Math.random()*Math.PI*2,r=Math.random()*Math.random()*t;h[_*3]=Math.cos(n)*r,h[_*3+1]=e,h[_*3+2]=Math.sin(n)*r,g[_*3]=0,g[_*3+1]=Math.random(),g[_*3+2]=.7+Math.random()*.3}for(let e=0;e<l;e++,_++){let e=Math.random()*6*1.1,t=e*1.5+p,n=Math.random()*Math.PI*2,r=.3*t+Math.random()*.7*t;h[_*3]=Math.cos(n)*r,h[_*3+1]=e,h[_*3+2]=Math.sin(n)*r,g[_*3]=1,g[_*3+1]=Math.random(),g[_*3+2]=.2+Math.random()*.4}m.setAttribute(`position`,new r(h,3)),m.setAttribute(`aSeed`,new r(g,3));let v=new n({uniforms:{uTime:{value:0},uSpeed:{value:.4},uMouse:{value:new i(0,0,-999)},uMouseStrength:{value:0},uMouseVel:{value:new i(0,0,0)},uBurstOrigin:{value:new i(0,0,-999)},uBurstStart:{value:-999},uBurstStrength:{value:0},uFlicker:{value:1},uSizeCore:{value:u},uSizeEmber:{value:d},uTexture:{value:c()}},vertexShader:`
      attribute vec3 aSeed; varying float vAlpha; varying vec3 vColor;
      uniform float uTime; uniform float uSpeed; uniform vec3 uMouse; uniform float uMouseStrength;
      uniform vec3 uMouseVel; uniform vec3 uBurstOrigin; uniform float uBurstStart;
      uniform float uBurstStrength; uniform float uFlicker;
      uniform float uSizeCore; uniform float uSizeEmber;
      void main() {
        vec3 pos = position; float type = aSeed.x; float seedY = aSeed.y; float brightness = aSeed.z;
        float speed = (0.6 + seedY * 0.8) * uSpeed;
        pos.y += uTime * speed; pos.y = mod(pos.y, 6.0);
        float yNorm = pos.y / 6.0;
        float n1 = sin(pos.y*2.5 + uTime*3.0 + seedY*5.0);
        float n2 = sin(pos.y*5.0 + uTime*2.1 + seedY*7.0);
        float n3 = sin(pos.y*10.0 + uTime*1.5 + seedY*3.0);
        float noiseX = n1*0.55 + n2*0.30 + n3*0.15;
        float noiseZ = sin(pos.y*2.5+uTime*3.0+seedY*8.0+1.5)*0.55 + sin(pos.y*5.0+uTime*2.1+seedY*4.0+2.0)*0.30 + sin(pos.y*10.0+uTime*1.5+seedY*6.0+0.7)*0.15;
        float baseR = yNorm > 0.01 ? length(pos.xz)/yNorm : 0.0;
        float edgeFactor = baseR*1.5; float tipFactor = yNorm*yNorm;
        pos.x += noiseX*0.35*(0.3+edgeFactor+tipFactor*0.5);
        pos.z += noiseZ*0.35*(0.3+edgeFactor+tipFactor*0.5);
        float fadePastTip = 1.0 - smoothstep(0.85,1.0,yNorm);
        pos.xz *= 1.0 + (1.0-fadePastTip)*seedY*2.0;
        float dist = length(pos - uMouse);
        if (dist < 1.4 && uMouseStrength > 0.01) {
          vec3 dir = normalize(pos - uMouse + 0.001);
          float force = uMouseStrength * 0.25 / (dist*dist*2.0 + 0.25);
          pos += dir * force;
        }
        // ── drag wind + swirl: small, localized push following the pointer's motion ──
        float windFall = exp(-dist*dist*2.5) * uMouseStrength;
        pos += uMouseVel * windFall * 1.2;
        vec3 toP = pos - uMouse;
        vec3 swirl = vec3(-toP.z, abs(toP.x)*0.3, toP.x);
        pos += normalize(swirl + 0.001) * length(uMouseVel) * windFall * 0.7;
        // ── click shockwave: big expanding ring that pushes hard and flashes ──
        float vBoost = 0.0;
        if (uBurstStrength > 0.001) {
          float age = max(uTime - uBurstStart, 0.0);
          float bd = length(pos - uBurstOrigin);
          vec3 odir = normalize(pos - uBurstOrigin + 0.001);
          // Wide expanding ring carries most of the punch.
          float ringR = age * 7.0;
          float ring = exp(-pow(bd - ringR, 2.0) * 0.45);
          float decay = exp(-age * 2.2) * uBurstStrength;
          pos += odir * ring * decay * 3.4;
          // Early radial blast near the origin makes the eruption feel fuller.
          float blast = exp(-age * 5.0) * exp(-bd*bd*0.12) * uBurstStrength;
          pos += odir * blast * 2.2;
          vBoost = ring * decay * 1.7 + blast * 1.2;
        }
        vec4 mv = modelViewMatrix * vec4(pos,1.0); gl_Position = projectionMatrix * mv;
        float sizeBase = type < 0.5 ? uSizeCore : uSizeEmber;
        gl_PointSize = (sizeBase/-mv.z)*(0.4+seedY*0.6)*(1.0-yNorm*0.5);
        float hue = 0.14 - yNorm*0.14; float sat = 1.0-yNorm*0.5; float light = 0.95-yNorm*0.82;
        float h6 = hue*6.0; float c = (1.0-abs(2.0*light-1.0))*sat; float xx = c*(1.0-abs(mod(h6,2.0)-1.0)); float m = light-c*0.5;
        vec3 rgbCol;
        if (h6<1.0) rgbCol=vec3(c,xx,0.0); else if (h6<2.0) rgbCol=vec3(xx,c,0.0); else if (h6<3.0) rgbCol=vec3(0.0,c,xx);
        else if (h6<4.0) rgbCol=vec3(0.0,xx,c); else if (h6<5.0) rgbCol=vec3(xx,0.0,c); else rgbCol=vec3(c,0.0,xx);
        rgbCol += m;
        // faint blue combustion tint at the very base
        float baseBlue = smoothstep(0.07, 0.0, yNorm);
        rgbCol = mix(rgbCol, vec3(0.35,0.55,1.0), baseBlue*0.4);
        float colorBright = type < 0.5 ? 1.25 : 0.8;
        vColor = brightness*rgbCol*colorBright*uFlicker + vBoost;
        vAlpha = brightness*(1.0-yNorm*0.85)*(0.9+0.1*uFlicker) + vBoost*0.6;
        if (type > 0.5) vAlpha *= 0.5+0.5*(1.0-yNorm);
      }
    `,fragmentShader:`
      uniform sampler2D uTexture; varying float vAlpha; varying vec3 vColor;
      void main() { vec4 t = texture2D(uTexture, gl_PointCoord); gl_FragColor = vec4(vColor*t.rgb, t.a*vAlpha); }
    `,blending:2,depthWrite:!1,transparent:!0}),y=new e(m,v),b=c([[0,.9],[.2,.5],[.5,.18],[1,0]]),x=new t({map:b,color:16734750,transparent:!0,blending:2,depthWrite:!1,opacity:.55}),S=new o(x);S.position.set(0,.5,0),S.scale.set(7,4.5,1);let C=v.uniforms;return{objects:[y,S],background:655365,camera:{fov:60,position:[0,1.5,10],target:[0,6/2,0]},uniforms:C,setPointer(e,t){C.uMouse.value.copy(e),C.uMouseStrength.value=t},setPointerVel(e){C.uMouseVel.value.copy(e)},burst(e,t=3){C.uBurstOrigin.value.copy(e),C.uBurstStart.value=C.uTime.value,C.uBurstStrength.value=t},update(e){C.uTime.value=e;let t=1+.07*Math.sin(e*11)+.05*Math.sin(e*23+1.3)+.03*Math.sin(e*41);C.uFlicker.value=t,C.uMouseVel.value.multiplyScalar(.85),C.uBurstStrength.value*=.95,C.uBurstStrength.value<.01&&(C.uBurstStrength.value=0),x.opacity=.5+.12*(t-1)/.15},dispose(){m.dispose(),v.dispose(),C.uTexture.value.dispose(),x.dispose(),b.dispose()}}}export{l as t};