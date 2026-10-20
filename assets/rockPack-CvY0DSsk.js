import{_ as s}from"./index-C7HOqiRt.js";const r=t=>{let a=0;for(let o=0;o<t.length;o++){const i=t.charCodeAt(o);a=(a<<5)-a+i,a=a&a}return Math.abs(a).toString(36)},n=new Date().toISOString(),e=t=>({id:t.id??s(),title:t.title??"Untitled",artist:t.artist??"Unknown Artist",content:t.content,format:"chordpro",capo:t.capo??0,tags:t.tags??[],key:t.key??"C",bpm:t.bpm??120,timeSignature:t.timeSignature??"4/4",attribution:{sourceName:"Traditional",sourceUrl:"",license:"unknown",author:t.artist,notes:"",verifiedBy:"auto",...t.attribution??{}},rightsStatus:"restricted",createdAt:t.createdAt??n,updatedAt:t.updatedAt??n,hash:t.hash??r(t.content)}),h=[e({id:"rock-pack-wildwood-flower",title:"Wildwood Flower",artist:"Traditional Carter Family",tags:["Folk","Traditional","Bluegrass","Easy"],key:"C",bpm:100,content:`{start_of_verse}
[C]Oh, I'll twine with my [C]mingles and [C]waving black hair
With the [C]roses so red and the [C]lilies so fair
And the [C]myrtle so bright with the [C]emerald dew
The [C]pale and the [C]lily and [C]blue

{start_of_chorus}
[C]I'll twine with my [C]mingles and [C]waving black hair
[C]Until the day I [C]die
[C]Poor [C]old [C]heart,
[C]Pale [C]lily and [C]blue`,attribution:{sourceName:"Traditional",sourceUrl:"",license:"public-domain",author:"",notes:"Traditional Carter Family song, public domain.",verifiedBy:"auto"}}),e({id:"rock-pack-this-land-is-your-land",title:"This Land Is Your Land",artist:"Woody Guthrie",tags:["Folk","Traditional","Protest"],key:"G",bpm:110,content:`{start_of_verse}
[G]This land is your land, this [C]land is my land
From [G]California to the [D7]New York Island
From the [G]redwood forest to the [C]gulf stream waters
This [G]land was made for [D7]you and [G]me

{start_of_chorus}
[G]As I was walking that [C]ribbon of highway
[G]I saw above me that [D7]endless skyway
[G]I saw below me that [C]golden valley
This [G]land was made for [D7]you and [G]me`}),e({id:"rock-pack-you-are-my-sunshine",title:"You Are My Sunshine",artist:"Jimmie Davis",tags:["Folk","Traditional","Easy","Children"],key:"C",bpm:100,content:`{start_of_verse}
[C]The other night dear, as I lay [F]sleeping
I [C]dreamed I held you in my [G7]arms
When [C]I awoke dear, I was [F]mistaken
And [C]I hung my head and [G7]cried

{start_of_chorus}
[C]You are my sunshine, my [F]only sunshine
[C]You make me happy when [G7]skies are gray
[C]You'll never know dear, how [F]much I love you
[C]Please don't take my [G7]sunshine [C]away`}),e({id:"rock-pack-blues-stay-away-from-me",title:"Blues Stay Away from Me",artist:"Delmore Brothers",tags:["Blues","Traditional","Country"],key:"G",bpm:90,content:`{start_of_verse}
[G]Blues stay away from me, [C]blues why don't you let me [G]be
Don't [D7]hang around my door, [C]blues I don't want you no [G]more

{start_of_chorus}
[G]Blues stay away from me, [C]blues why don't you let me [G]be
Don't [D7]hang around my door, [C]blues I don't want you no [G]more`}),e({id:"rock-pack-i-saw-the-light",title:"I Saw the Light",artist:"Hank Williams",tags:["Gospel","Country","Traditional"],key:"G",bpm:120,content:`{start_of_verse}
[G]I wandered so aimless, life filled with [C]sin
I [G]wouldn't let my dear [D7]Savior in
Then [G]Jesus came like a [C]stranger in the [G]night
[D7]Praise the Lord, I saw the [G]light

{start_of_chorus}
[G]I saw the light, I saw the [C]light
No more [G]darkness, no more [D7]night
Now I'm so [G]happy, no sorrow in [C]sight
[D7]Praise the Lord, I saw the [G]light`})];export{h as ROCK_PACK};
