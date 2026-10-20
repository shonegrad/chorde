import{K as o}from"./index-BaZbjN_o.js";const l=t=>{let a=0;for(let i=0;i<t.length;i++){const e=t.charCodeAt(i);a=(a<<5)-a+e,a=a&a}return Math.abs(a).toString(36)},n=new Date().toISOString(),r=t=>({id:t.id??o(),title:t.title??"Untitled",artist:t.artist??"Unknown Artist",content:t.content,format:"chordpro",capo:t.capo??0,tags:t.tags??[],key:t.key??"C",bpm:t.bpm??120,timeSignature:t.timeSignature??"4/4",attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:t.artist,notes:"",verifiedBy:"auto",...t.attribution??{}},rightsStatus:"open",origin:"builtin",createdAt:t.createdAt??n,updatedAt:t.updatedAt??n,hash:t.hash??l(t.content)}),h=[r({id:"rock-pack-wildwood-flower",title:"Wildwood Flower",artist:"Traditional Carter Family",tags:["Folk","Traditional","Bluegrass","Easy"],key:"C",bpm:100,content:`{start_of_verse}
[C]Oh, I'll twine with my [C]mingles and [C]waving black hair
With the [C]roses so red and the [C]lilies so fair
And the [C]myrtle so bright with the [C]emerald dew
The [C]pale and the [C]lily and [C]blue

{start_of_chorus}
[C]I'll twine with my [C]mingles and [C]waving black hair
[C]Until the day I [C]die
[C]Poor [C]old [C]heart,
[C]Pale [C]lily and [C]blue`,attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:"",notes:"Traditional Carter Family song, public domain.",verifiedBy:"auto"}})];export{h as ROCK_PACK};
