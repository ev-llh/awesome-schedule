/* @map:util — tiny DOM helpers used everywhere */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* @map:icons — inline SVG icons: ic('check'|'x'|'play'|'plus'|'theme'|'sliders'|'popout'). Symbols live in the sprite in src/index.template.html. */
const ic=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
