const s=t=>{let a=0;for(let i=0;i<t.length;i++){const o=t.charCodeAt(i);a=(a<<5)-a+o,a=a&a}return Math.abs(a).toString(36)},n=new Date().toISOString(),e=t=>({id:t.id??crypto.randomUUID(),title:t.title??"Untitled",artist:t.artist??"Unknown Artist",content:t.content,format:"chordpro",capo:t.capo??0,tags:t.tags??[],key:t.key??"C",bpm:t.bpm??120,timeSignature:t.timeSignature??"4/4",attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:t.artist,notes:"",verifiedBy:"auto",...t.attribution??{}},rightsStatus:"open",createdAt:t.createdAt??n,updatedAt:t.updatedAt??n,hash:t.hash??s(t.content)}),l=[e({id:"mix-pack-this-little-light-of-mine",title:"This Little Light of Mine",artist:"Traditional Gospel",tags:["Gospel","Traditional","Children","Easy"],key:"C",bpm:120,content:`{start_of_verse}
[C]This little light of mine, I'm [F]gonna let it [C]shine
This little light of mine, I'm [G7]gonna let it [C]shine
This little light of mine, I'm [F]gonna let it [C]shine
[C]Let it shine, [G7]let it shine, [C]let it shine`,attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:"",notes:"Traditional gospel song, public domain.",verifiedBy:"auto"}}),e({id:"mix-pack-when-the-saints-go-marching-in",title:"When the Saints Go Marching In",artist:"Traditional",tags:["Gospel","Traditional","Jazz","Easy"],key:"F",bpm:130,content:`{start_of_verse}
[F]Oh, when the saints go marching [C7]in
[F]Oh, when the saints go marching [C7]in
[Bb]Lord, I want to be in that [F]number
When the [C7]saints go marching [F]in`,attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:"",notes:"Traditional gospel/jazz standard, public domain.",verifiedBy:"auto"}}),e({id:"mix-pack-he-aint-heavy-hes-my-brother",title:"He Ain't Heavy, He's My Brother",artist:"Bob Russell & Bobby Scott",tags:["Pop","Traditional","Ballad"],key:"C",bpm:80,content:`{start_of_verse}
[C]The road is long with many a [F]winding turn
That [C]leads us to who [G7]knows where
But [C]I'm strong enough to [F]carry him
He [C]ain't heavy, he's my [G7]brother`}),e({id:"mix-pack-blowin-in-the-wind",title:"Blowin' in the Wind",artist:"Bob Dylan",tags:["Folk","Protest","Traditional"],key:"G",bpm:100,content:`{start_of_verse}
[G]How many roads must a man walk [C]down
Before you [G]call him a man?
Yes, and [G]how many seas must a white dove [C]sail
Before she [D7]sleeps in the sand?
Yes, and [G]how many times must the cannonballs [C]fly
Before they're [D7]forever banned?
The [C]answer, my [D7]friend, is [G]blowin' in the [Em]wind
The [C]answer is [D7]blowin' in the [G]wind`}),e({id:"mix-pack-leaving-on-a-jet-plane",title:"Leaving on a Jet Plane",artist:"John Denver",tags:["Folk","Traditional","Ballad"],key:"G",bpm:90,content:`{start_of_verse}
[G]All my bags are packed, I'm [C]ready to go
I'm [G]standing here outside your [D7]door
I [G]hate to wake you up to say [C]goodbye
But [G]the dawn is breaking, it's [D7]early morn
The [G]taxi's waiting, he's [C]blowing his horn
Already [G]I'm so lonesome I could [D7]die`})];export{l as MIX_PACK};
