import"./three.module-DCYiBNzM.js";import"./portfolio-bg-Ba5YbJyk.js";var e=[{title:`Shaders Reel 2026`,tag:[`Showreel`,`GLSL`,`VFX`],type:`video`,src:`/projects/reel-2026.mp4`,poster:`/projects/reel-2026.jpg`,description:`Recent shader based fx (GLSL)`},{title:`GAMEDEV VFX`,tag:[`Gamedev`,`Unity`,`VFX`],type:`video`,src:`/projects/unity-vfx1.mp4`,poster:`/projects/unity-vfx1.jpg`,description:`Unity VFX Practice reel 2022`}];function t(e){return e?(Array.isArray(e)?e:[e]).map(e=>`<span class="gallery-card-tag">${e}</span>`).join(``):``}function n(e){if(e.type===`video`){let t=e.poster?` poster="${e.poster}"`:``;return`<video src="${e.src}"${t} muted loop autoplay playsinline preload="metadata"></video>`}return`<img src="${e.src}" alt="${e.title}" loading="lazy" />`}function r(e,r){return`
    <div class="gallery-card" data-idx="${r}">
      <div class="gallery-card-media">${n(e)}</div>
      <div class="gallery-card-body">
        ${t(e.tag)}
        <div class="gallery-card-title">${e.title}</div>
        <div class="gallery-card-desc">${e.description??``}</div>
      </div>
    </div>`}var i=document.getElementById(`projects-grid`);i&&(e.length===0?i.innerHTML=`<p class="page-subtitle">No projects yet.</p>`:i.innerHTML=e.map((e,t)=>r(e,t)).join(``));var a=document.createElement(`div`);a.className=`modal-overlay`,a.innerHTML=`
  <button class="modal-close">Close</button>
  <div class="modal-content">
    <div class="modal-video-wrap"></div>
    <div class="modal-info">
      <h2></h2>
      <p></p>
    </div>
  </div>
`,document.body.appendChild(a);var o=a.querySelector(`.modal-video-wrap`),s=a.querySelector(`.modal-info h2`),c=a.querySelector(`.modal-info p`);i?.addEventListener(`click`,t=>{let n=t.target.closest(`.gallery-card`);if(!n)return;let r=e[parseInt(n.dataset.idx)];!r||r.type!==`video`||(o.innerHTML=`<video src="${r.src}" controls autoplay playsinline preload="metadata"></video>`,s.textContent=r.title,c.textContent=r.description??``,a.classList.add(`open`))}),a.querySelector(`.modal-close`).addEventListener(`click`,l),a.addEventListener(`click`,e=>{e.target===a&&l()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&l()});function l(){a.classList.remove(`open`),o.innerHTML=``}