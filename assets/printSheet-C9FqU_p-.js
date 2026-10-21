import{p as u}from"./chordPro-Bsf6MIUk.js";import{v,b as m}from"./index-CmwlCW_a.js";const b={fontSize:12},i=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),g=(t,r)=>{if(!t.key)return;const e=m(t.key,r.transpose??0,{preferFlats:r.preferFlats});return r.capo?m(e,r.capo,{preferFlats:r.preferFlats}):e},$=(t,r)=>{const e=r.transpose??0,a=r.preferFlats;return u(t.content).map(o=>({...o,items:o.items.map(s=>({...s,chord:s.chord?v(s.chord,e,{preferFlats:a}):void 0}))}))},w=t=>{const r=[];let e;return t.forEach(a=>{a.section?(e={label:a.section.label??a.section.type,chords:[]},r.push(e)):e||(e={label:"",chords:[]},r.push(e));const o=e;o&&a.items.forEach(s=>{const n=s.chord?.trim();n&&o.chords[o.chords.length-1]!==n&&o.chords.push(n)})}),r.filter(a=>a.chords.length>0)},y=t=>{const r=[];return t.forEach(e=>{e.items.forEach(a=>{const o=a.chord?.trim();!o||r.includes(o)||r.push(o)})}),r},k=t=>{const r=t.section?`<div class="section">${i(t.section.label??"")}</div>`:"";if(t.annotation){if(t.annotation.kind==="comment")return`<div class="line">${r}<div class="comment">${i(t.annotation.text)}</div></div>`;if(t.annotation.kind==="tab")return`<div class="line">${r}<pre class="tab">${i(t.annotation.raw??"")}</pre></div>`;if(t.annotation.kind==="chords"){const a=(t.annotation.chords??[]).map(o=>i(o));return`<div class="line">${r}<div class="chord-row">${a.join('</div><div class="chord-row">')}</div></div>`}if(t.annotation.kind==="grid"){const a=(t.annotation.chords??[]).map(o=>i(o));return`<div class="line">${r}<div class="chord-row">${a.join(" &middot; ")}</div></div>`}return`<div class="line">${r}<div class="comment">${i(t.annotation.text)}</div></div>`}const e=t.items.map(a=>{const o=i(a.lyric??"");if(!a.chord)return`<span class="lyric">${o}</span>`;const s=i(a.chord),n=(a.lyric??"").match(/^(\s*)(\S*)([\s\S]*)$/),[,c="",l="",d=""]=n??[];return`<span class="chord-word"><span class="chord">${s}</span><span class="word">${i(c+l)}</span></span><span class="lyric">${i(d)}</span>`}).join("");return`<div class="line">${r}${e}</div>`},x=t=>w(t).map(r=>{const e=r.chords.map(a=>`<span class="chart-chord">${i(a)}</span>`);return`<div class="chart-section"><div class="section">${i(r.label)}</div><div class="chart-chords">${e.join("")}</div></div>`}).join(`
`),z=(t,r)=>{if(t.length===0)return"";const e=t.map(a=>{const o=r[a];return o?`<div class="diagram"><div class="diagram-name">${i(a)}</div><div class="diagram-shape">${o}</div></div>`:""}).join("");return e?`<h3 class="diagrams-title">The chords</h3><div class="diagrams">${e}</div>`:""},C=`
  @page { margin: 16mm; }
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 720px; margin: 1.5rem auto; color: #1a1a1a; }
  h1 { margin-bottom: 0.15rem; font-size: 1.9rem; }
  h2 { color: #555; font-weight: normal; margin-top: 0; font-size: 1.15rem; }
  .meta { color: #555; font-size: 0.9rem; margin-bottom: 1.2rem; }
  .note { border-left: 3px solid #999; padding-left: 0.6rem; margin: 0.8rem 0; font-style: italic; }
  .line { line-height: 1.9; margin-bottom: 0.55rem; }
  .section { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: #777; margin-bottom: 0.35rem; }
  .chord-word { display: inline-block; vertical-align: bottom; }
  .chord { display: block; font-family: 'Courier New', monospace; font-weight: bold; font-size: 0.85em; }
  .word { display: block; white-space: nowrap; }
  .lyric { white-space: pre-wrap; }
  .comment { font-style: italic; color: #555; }
  .tab { font-family: 'Courier New', monospace; font-size: 0.85em; white-space: pre; margin: 0; }
  .chord-row { font-family: 'Courier New', monospace; font-weight: bold; display: inline-block; margin-right: 1.2rem; }
  .chart-section { margin-bottom: 1.4rem; }
  .chart-chords { display: flex; flex-wrap: wrap; gap: 0.4rem 1.1rem; }
  .chart-chord { font-family: 'Courier New', monospace; font-weight: bold; font-size: 1.15em; }
  .diagrams-title { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #777; margin-top: 2rem; }
  .diagrams { display: flex; flex-wrap: wrap; gap: 1rem 1.4rem; }
  .diagram { text-align: center; }
  .diagram-name { font-family: 'Courier New', monospace; font-weight: bold; font-size: 0.95em; }
  .diagram-shape svg { width: 90px; height: auto; }
  .diagram-shape svg line { stroke: #1a1a1a !important; }
  .diagram-shape svg text { fill: #1a1a1a !important; }
  .diagram-shape svg circle { fill: #1a1a1a !important; stroke: none !important; }
  .diagram-shape svg rect { fill: #1a1a1a !important; stroke: none !important; }
  .attribution, .source { color: #666; font-size: 0.8rem; margin: 0.25rem 0; }
  @media print {
    body { margin: 0; max-width: none; }
    .line { break-inside: avoid; }
    .chart-section { break-inside: avoid; }
    .diagram { break-inside: avoid; }
    .diagrams-title { break-after: avoid; }
  }
`,S=(t,r={},e={})=>{const a=r.capo??0,o=r.layout??"chords",s=$(t,r),n=g(t,r),c=t.key,l=[n?`Key: ${n}`:null,c&&n&&c!==n?`written in ${c}`:null,a?`Capo ${a}`:null,t.bpm?`${t.bpm} bpm`:null,t.duration??null].filter(Boolean).join(" &middot; "),d=[t.attribution?.sourceName,t.attribution?.author,t.attribution?.notes].filter(Boolean).join(" · "),p=t.attribution?.sourceUrl?`<p class="source">Source: <a href="${i(t.attribution.sourceUrl)}">${i(t.attribution.sourceUrl)}</a></p>`:"",h=o==="chart"?x(s):s.map(k).join(`
`),f=r.diagrams?z(y(s),e):"";return`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${i(t.title)}</title>
  <style>${C}</style>
</head>
<body style="font-size: ${r.fontSize??b.fontSize}pt">
  <h1>${i(t.title)}</h1>
  <h2>${i(t.artist)}</h2>
  ${l?`<div class="meta">${l}</div>`:""}
  ${t.notes?`<p class="note">${i(t.notes)}</p>`:""}
  ${d?`<p class="attribution">${i(d)}</p>`:""}
  ${p}
  <hr />
  ${h}
  ${f}
</body>
</html>`},F=(t,r={},e={})=>{const a=window.open("","_blank");return a?(a.document.write(S(t,r,e)),a.document.close(),!0):!1};export{C as P,S as b,y as c,F as p};
