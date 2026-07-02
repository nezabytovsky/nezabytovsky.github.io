import{a as e,n as t,t as n}from"./reveal-C5xMytDG.js";import"./three.module-DsNDpfSU.js";import"./portfolio-bg-BjLoG7Q_.js";function r(e){return!e||e.length===0?``:`<div class="post-tags">${e.map(e=>`<span class="gallery-card-tag">${e}</span>`).join(``)}</div>`}function i(e,n){return`
    <li class="post-item reveal reveal-delay-${Math.min(n,4)}">
      <a href="/post.html?slug=${encodeURIComponent(e.slug)}">
        <div class="post-item-date">${t(e.date)}</div>
        <div class="post-item-title">${e.title}</div>
        <div class="post-item-excerpt">${e.excerpt}</div>
        ${r(e.tags)}
      </a>
    </li>`}var a=document.getElementById(`post-list`);a&&(e.length===0?a.innerHTML=`<p class="page-subtitle">No posts yet.</p>`:(a.innerHTML=e.map((e,t)=>i(e,t)).join(``),n(a)));