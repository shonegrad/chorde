import{O as l}from"./index-B6Byx9b4.js";const s=t=>{let i=0;for(let n=0;n<t.length;n++){const o=t.charCodeAt(n);i=(i<<5)-i+o,i=i&i}return Math.abs(i).toString(36)},a=new Date().toISOString(),e=t=>({id:t.id??l(),title:t.title??"Untitled",artist:t.artist??"Unknown Artist",content:t.content,format:"chordpro",capo:t.capo??0,tags:t.tags??[],key:t.key??"C",bpm:t.bpm??120,timeSignature:t.timeSignature??"4/4",attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:t.artist,notes:"",verifiedBy:"auto",...t.attribution??{}},rightsStatus:"open",origin:"builtin",createdAt:t.createdAt??a,updatedAt:t.updatedAt??a,hash:t.hash??s(t.content)}),c=[e({id:"mix-pack-this-little-light-of-mine",title:"This Little Light of Mine",artist:"Traditional Gospel",tags:["Gospel","Traditional","Children","Easy"],key:"C",bpm:120,content:`{start_of_verse}
[C]This little light of mine, I'm [F]gonna let it [C]shine
This little light of mine, I'm [G7]gonna let it [C]shine
This little light of mine, I'm [F]gonna let it [C]shine
[C]Let it shine, [G7]let it shine, [C]let it shine`,attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:"",notes:"Traditional gospel song, public domain.",verifiedBy:"auto"}}),e({id:"mix-pack-when-the-saints-go-marching-in",title:"When the Saints Go Marching In",artist:"Traditional",tags:["Gospel","Traditional","Jazz","Easy"],key:"F",bpm:130,content:`{start_of_verse}
[F]Oh, when the saints go marching [C7]in
[F]Oh, when the saints go marching [C7]in
[Bb]Lord, I want to be in that [F]number
When the [C7]saints go marching [F]in`,attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:"",notes:"Traditional gospel/jazz standard, public domain.",verifiedBy:"auto"}})];export{c as MIX_PACK};
