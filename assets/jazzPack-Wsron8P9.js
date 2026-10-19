const s=a=>{let e=0;for(let r=0;r<a.length;r++){const n=a.charCodeAt(r);e=(e<<5)-e+n,e=e&e}return Math.abs(e).toString(36)},o=new Date().toISOString(),t=a=>({id:a.id??crypto.randomUUID(),title:a.title??"Untitled",artist:a.artist??"Unknown Artist",content:a.content,format:"chordpro",capo:a.capo??0,tags:a.tags??[],key:a.key??"C",bpm:a.bpm??120,timeSignature:a.timeSignature??"4/4",attribution:{sourceName:"Jazz Standard",sourceUrl:"",license:"unknown",author:a.artist,notes:"",verifiedBy:"auto",...a.attribution??{}},rightsStatus:"restricted",createdAt:a.createdAt??o,updatedAt:a.updatedAt??o,hash:a.hash??s(a.content)}),i=[t({id:"jazz-pack-all-of-me",title:"All of Me",artist:"Gerald Marks & Seymour Simons",tags:["Jazz","Standard","Swing"],key:"C",bpm:120,content:`{title: All of Me}
{artist: Gerald Marks & Seymour Simons}
{key: C}

{start_of_verse}
[C]All of me, why not [E7]take all of me
[Am]Can't you see I'm no [D7]good without you
[F]Take my lips, I want to [Fm]lose them
[C]Take my arms, I'll never [A7]use them

{start_of_chorus}
[Dm]Your goodbye left me with [G7]eyes that cry
[C]How can I go on dear with[F]out you
[C]You took the part that once was [E7]my heart
[Am]So why not take all of [D7]me
[G7]All of me
{end_of_chorus}`}),t({id:"jazz-pack-autumn-leaves",title:"Autumn Leaves",artist:"Joseph Kosma",tags:["Jazz","Standard","Ballad"],key:"Gm",bpm:100,content:`{title: Autumn Leaves}
{artist: Joseph Kosma}
{key: Gm}

{start_of_verse}
[Cm7]The falling leaves drift by the [F7]window
[BbMaj7]The autumn leaves of [EbMaj7]red and gold
[Am7b5]I see your lips, the summer [D7]kisses
[Gm]The sunburned hands I used to [Gm]hold

{start_of_chorus}
[Cm7]Since you went away the days grow [F7]long
[BbMaj7]And soon I'll hear old winter's [EbMaj7]song
[Am7b5]But I miss you most of all my [D7]darling
[Gm]When autumn leaves start to [Gm]fall
{end_of_chorus}`}),t({id:"jazz-pack-blue-bossa",title:"Blue Bossa",artist:"Kenny Dorham",tags:["Jazz","Standard","Bossa Nova"],key:"Cm",bpm:110,content:`{title: Blue Bossa}
{artist: Kenny Dorham}
{key: Cm}

{start_of_intro}
[Cm7]  [Fm7]  [Dm7b5]  [G7]

{start_of_verse}
[Cm7]  [Fm7]
[Dm7b5]  [G7]
[Cm7]  [Fm7]
[Dm7b5]  [G7]

{start_of_chorus}
[EbMaj7]  [DbMaj7]
[Dm7b5]  [G7]
[Cm7]  [Fm7]
[Dm7b5]  [G7]
{end_of_chorus}`}),t({id:"jazz-pack-fly-me-to-the-moon",title:"Fly Me to the Moon",artist:"Bart Howard",tags:["Jazz","Standard","Swing"],key:"C",bpm:140,content:`{title: Fly Me to the Moon}
{artist: Bart Howard}
{key: C}

{start_of_verse}
[Am7]Fly me to the [Dm7]moon
[G7]Let me play among the [Cmaj7]stars
[Fmaj7]Let me see what spring is like on
[Bm7b5]Jupiter and [E7]Mars

{start_of_chorus}
[Am7]In other words, [Dm7]hold my hand
[G7]In other words, [Cmaj7]darling kiss me

{start_of_verse: Verse 2}
[Am7]Fill my heart with [Dm7]song
[G7]And let me sing for [Cmaj7]evermore
[Fmaj7]You are all I long for, all I
[Bm7b5]worship and [E7]adore

{start_of_chorus: Tag}
[Am7]In other words, [Dm7]please be true
[G7]In other words, I [Cmaj7]love you
{end_of_chorus}`}),t({id:"jazz-pack-take-the-a-train",title:"Take the A Train",artist:"Billy Strayhorn",tags:["Jazz","Standard","Swing"],key:"C",bpm:160,content:`{title: Take the A Train}
{artist: Billy Strayhorn}
{key: C}

{start_of_verse}
[C6]You must take the A [D7]train
To go to Sugar Hill way up in [G7]Harlem

{start_of_chorus}
[C6]If you miss the A [D7]train
You'll find you've missed the quickest way to [G7]Harlem

{start_of_bridge}
[E7]Hurry, get on, now it's [A7]coming
Listen to those rails a-thrumming

{start_of_chorus: Tag}
[C6]All aboard, get on the A [D7]train
Soon you'll be on Sugar Hill in [G7]Harlem
{end_of_chorus}`}),t({id:"jazz-pack-satin-doll",title:"Satin Doll",artist:"Duke Ellington",tags:["Jazz","Standard","Swing"],key:"C",bpm:140,content:`{title: Satin Doll}
{artist: Duke Ellington}
{key: C}

{start_of_verse}
[C6]Cigarette holder which wigs me over
Her shoulder, she digs me out

{start_of_chorus}
[F6]Satin doll
[C6]Baby, I'm a poor man
[D7]But I can still afford to buy you
[G7]A satin doll
{end_of_chorus}`}),t({id:"jazz-pack-misty",title:"Misty",artist:"Erroll Garner",tags:["Jazz","Standard","Ballad"],key:"Eb",bpm:70,content:`{title: Misty}
{artist: Erroll Garner}
{key: Eb}

{start_of_verse}
[EbMaj7]Look at me, I'm as helpless as a [Gm7]kitten up a tree
[Fm7]And I feel like I'm clinging to a [Bb7]cloud

{start_of_chorus}
[EbMaj7]I can't understand, I get [Gm7]misty just holding your hand
[Fm7]Walk my way and a thousand [Bb7]violins begin to play
{end_of_chorus}`}),t({id:"jazz-pack-summertime",title:"Summertime",artist:"George Gershwin",tags:["Jazz","Standard","Ballad"],key:"Am",bpm:80,content:`{title: Summertime}
{artist: George Gershwin}
{key: Am}

{start_of_verse}
[Am]Summertime, and the [E7]livin' is easy
[Am]Fish are jumpin', and the [E7]cotton is high

{start_of_chorus}
[Am]Oh, your daddy's rich, and your [E7]ma is good lookin'
[Am]So hush, little baby, [E7]don't you cry
{end_of_chorus}`}),t({id:"jazz-pack-my-funny-valentine",title:"My Funny Valentine",artist:"Richard Rodgers",tags:["Jazz","Standard","Ballad"],key:"C",bpm:90,content:`{title: My Funny Valentine}
{artist: Richard Rodgers}
{key: C}

{start_of_verse}
[Cmaj7]My funny valentine, [Cm6]sweet comic valentine
[Bm7]You make me smile with my [E7]heart

{start_of_chorus}
[Am7]Your looks are laughable, unphotographable
[Dm7]Yet you're my favorite work of [G7]art
{end_of_chorus}`}),t({id:"jazz-pack-round-midnight",title:"'Round Midnight",artist:"Thelonious Monk",tags:["Jazz","Standard","Ballad"],key:"Eb",bpm:80,content:`{title: 'Round Midnight}
{artist: Thelonious Monk}
{key: Eb}

{start_of_intro}
[EbMaj7]  [Edim7]  [Fm7]  [Bb7]

{start_of_verse}
[EbMaj7]It begins to tell

{start_of_chorus}
[Am7b5]  [D7]  [Gm7]  [C7]
[Fm7]  [Bb7]  [EbMaj7]
{end_of_chorus}`}),t({id:"jazz-pack-stella-by-starlight",title:"Stella by Starlight",artist:"Victor Young",tags:["Jazz","Standard"],key:"Bb",bpm:120,content:`{title: Stella by Starlight}
{artist: Victor Young}
{key: Bb}

{start_of_verse}
[BbMaj7]  [Bm7b5]  [E7]  [Am7]
[D7]  [Gm7]  [C7]  [F7]

{start_of_chorus}
[BbMaj7]  [Eb7]  [AbMaj7]  [Db7]
[GbMaj7]  [F7]  [BbMaj7]
{end_of_chorus}`}),t({id:"jazz-pack-all-the-things-you-are",title:"All the Things You Are",artist:"Jerome Kern",tags:["Jazz","Standard"],key:"Ab",bpm:120,content:`{title: All the Things You Are}
{artist: Jerome Kern}
{key: Ab}

{start_of_verse}
[AbMaj7]  [DbMaj7]  [G7]  [Cmaj7]
[Fm7]  [Bb7]  [EbMaj7]  [Am7b5]
[D7]  [Gm7]  [C7]

{start_of_chorus}
[Fm7]  [Bb7]  [EbMaj7]  [AbMaj7]
[DbMaj7]  [G7]  [Cmaj7]
[Fm7]  [Bb7]  [EbMaj7]
{end_of_chorus}`}),t({id:"jazz-pack-billies-bounce",title:"Billie's Bounce",artist:"Charlie Parker",tags:["Jazz","Standard","Blues"],key:"F",bpm:180,content:`{title: Billie's Bounce}
{artist: Charlie Parker}
{key: F}

{start_of_verse}
[F7]  [Bb7]  [F7]  [F7]
[Bb7]  [Bb7]  [F7]  [D7]
[Gm7]  [C7]  [F7]  [C7]
{end_of_verse}`}),t({id:"jazz-pack-blue-monk",title:"Blue Monk",artist:"Thelonious Monk",tags:["Jazz","Standard","Blues"],key:"Bb",bpm:140,content:`{title: Blue Monk}
{artist: Thelonious Monk}
{key: Bb}

{start_of_verse}
[Bb7]  [Eb7]  [Bb7]  [Bb7]
[Eb7]  [Eb7]  [Bb7]  [G7]
[Cm7]  [F7]  [Bb7]  [F7]
{end_of_verse}`}),t({id:"jazz-pack-body-and-soul",title:"Body and Soul",artist:"Johnny Green",tags:["Jazz","Standard","Ballad"],key:"Db",bpm:70,content:`{title: Body and Soul}
{artist: Johnny Green}
{key: Db}

{start_of_verse}
[DbMaj7]  [Dbm6]  [Ab7]  [DbMaj7]
[Fm7]  [Bb7]  [EbMaj7]  [Ab7]
[DbMaj7]  [G7]  [Cm7]  [F7]
{end_of_verse}`}),t({id:"jazz-pack-cheek-to-cheek",title:"Cheek to Cheek",artist:"Irving Berlin",tags:["Jazz","Standard","Swing"],key:"C",bpm:140,content:`{title: Cheek to Cheek}
{artist: Irving Berlin}
{key: C}

{start_of_verse}
[C]Heaven, I'm in heaven
And my heart beats so that I can hardly speak

{start_of_chorus}
[C]And I seem to find the happiness I seek
When we're out together dancing cheek to cheek
{end_of_chorus}`}),t({id:"jazz-pack-cantaloupe-island",title:"Cantaloupe Island",artist:"Herbie Hancock",tags:["Jazz","Standard","Modal"],key:"Fm",bpm:100,content:`{title: Cantaloupe Island}
{artist: Herbie Hancock}
{key: Fm}

{start_of_verse}
[Fm7]  [Db7]  [Fm7]  [Db7]
[Fm7]  [Db7]  [Fm7]  [Db7]
{end_of_verse}`}),t({id:"jazz-pack-caravan",title:"Caravan",artist:"Juan Tizol",tags:["Jazz","Standard","Latin"],key:"Dm",bpm:160,content:`{title: Caravan}
{artist: Juan Tizol}
{key: Dm}

{start_of_verse}
[Dm]  [Dm]  [E7]  [E7]
[Dm]  [Dm]  [A7]  [A7]
[Dm]  [Gm]  [A7]  [Dm]
{end_of_verse}`}),t({id:"jazz-pack-cherokee",title:"Cherokee",artist:"Ray Noble",tags:["Jazz","Standard","Swing"],key:"Bb",bpm:200,content:`{title: Cherokee}
{artist: Ray Noble}
{key: Bb}

{start_of_verse}
[BbMaj7]  [G7]  [Cm7]  [F7]
[BbMaj7]  [G7]  [Cm7]  [F7]

{start_of_chorus}
[EbMaj7]  [Ab7]  [DbMaj7]  [DbMaj7]
[Dm7b5]  [G7]  [Cm7]  [F7]
{end_of_chorus}`}),t({id:"jazz-pack-darn-that-dream",title:"Darn That Dream",artist:"Jimmy Van Heusen",tags:["Jazz","Standard","Ballad"],key:"C",bpm:80,content:`{title: Darn That Dream}
{artist: Jimmy Van Heusen}
{key: C}

{start_of_verse}
[Cmaj7]Darn that dream I dream each night
You say you love me and hold me tight

{start_of_chorus}
[Em7]But when I awaken and you are out of sight
Oh, darn that dream
{end_of_chorus}`}),t({id:"jazz-pack-days-of-wine-and-roses",title:"Days of Wine and Roses",artist:"Henry Mancini",tags:["Jazz","Standard"],key:"F",bpm:100,content:`{title: Days of Wine and Roses}
{artist: Henry Mancini}
{key: F}

{start_of_verse}
[Fmaj7]  [Em7b5]  [A7]  [Dm7]
[Gm7]  [C7]  [Fmaj7]  [Fmaj7]
{end_of_verse}`}),t({id:"jazz-pack-dont-get-around-much-anymore",title:"Don't Get Around Much Anymore",artist:"Duke Ellington",tags:["Jazz","Standard","Swing"],key:"C",bpm:120,content:`{title: Don't Get Around Much Anymore}
{artist: Duke Ellington}
{key: C}

{start_of_verse}
[C]Missed the Saturday dance
Heard they crowded the floor

{start_of_chorus}
[C]Couldn't bear it without you
Don't get around much anymore
{end_of_chorus}`}),t({id:"jazz-pack-equinox",title:"Equinox",artist:"John Coltrane",tags:["Jazz","Standard","Modal"],key:"Cm",bpm:100,content:`{title: Equinox}
{artist: John Coltrane}
{key: Cm}

{start_of_verse}
[Cm7]  [Cm7]  [Fm7]  [Fm7]
[Cm7]  [Cm7]  [Ab7]  [Ab7]
[Dm7b5]  [G7]  [Cm7]  [G7]
{end_of_verse}`}),t({id:"jazz-pack-footprints",title:"Footprints",artist:"Wayne Shorter",tags:["Jazz","Standard","Modal"],key:"Cm",bpm:90,content:`{title: Footprints}
{artist: Wayne Shorter}
{key: Cm}

{start_of_verse}
[Cm7]  [Fm7]  [Cm7]  [Cm7]
[Fm7]  [Fm7]  [Cm7]  [Cm7]
[Db7]  [Db7]  [Cm7]  [Cm7]
{end_of_verse}`}),t({id:"jazz-pack-girl-from-ipanema",title:"The Girl from Ipanema",artist:"Antonio Carlos Jobim",tags:["Jazz","Standard","Bossa Nova"],key:"F",bpm:100,content:`{title: The Girl from Ipanema}
{artist: Antonio Carlos Jobim}
{key: F}

{start_of_verse}
[Fmaj7]Tall and tan and young and lovely
[Fmaj7]The girl from Ipanema goes walking
[Em7]And when she passes each one she passes goes
[A7]Ah

{start_of_chorus}
[Dm7]But I watch her so sadly
[G7]How can I tell her I love her
[Dm7]Yes I would give my heart gladly
[G7]But each day when she walks to the sea
{end_of_chorus}`}),t({id:"jazz-pack-have-you-met-miss-jones",title:"Have You Met Miss Jones?",artist:"Richard Rodgers",tags:["Jazz","Standard"],key:"F",bpm:140,content:`{title: Have You Met Miss Jones?}
{artist: Richard Rodgers}
{key: F}

{start_of_verse}
[Fmaj7]  [Fmaj7]  [Fmaj7]  [Fmaj7]
[Fm7]  [Bb7]  [Am7]  [D7]
[Gm7]  [C7]  [Fmaj7]  [Fmaj7]
{end_of_verse}`}),t({id:"jazz-pack-how-high-the-moon",title:"How High the Moon",artist:"Morgan Lewis",tags:["Jazz","Standard","Swing"],key:"G",bpm:180,content:`{title: How High the Moon}
{artist: Morgan Lewis}
{key: G}

{start_of_verse}
[Gmaj7]  [Gmaj7]  [Gmaj7]  [Gmaj7]
[Gm7]  [C7]  [Fmaj7]  [Fmaj7]
[Fm7]  [Bb7]  [Em7]  [A7]
{end_of_verse}`}),t({id:"jazz-pack-i-got-rhythm",title:"I Got Rhythm",artist:"George Gershwin",tags:["Jazz","Standard","Rhythm Changes"],key:"Bb",bpm:180,content:`{title: I Got Rhythm}
{artist: George Gershwin}
{key: Bb}

{start_of_verse}
[Bb]  [G7]  [Cm7]  [F7]
[Bb]  [G7]  [Cm7]  [F7]

{start_of_bridge}
[D7]  [D7]  [G7]  [G7]
[C7]  [C7]  [F7]  [F7]
{end_of_bridge}`}),t({id:"jazz-pack-ill-remember-april",title:"I'll Remember April",artist:"Gene de Paul",tags:["Jazz","Standard"],key:"G",bpm:160,content:`{title: I'll Remember April}
{artist: Gene de Paul}
{key: G}

{start_of_verse}
[Gmaj7]  [Gmaj7]  [Bm7]  [E7]
[Am7]  [D7]  [Gmaj7]  [Gmaj7]
[Cmaj7]  [Cm7]  [Bm7]  [E7]
{end_of_verse}`}),t({id:"jazz-pack-it-could-happen-to-you",title:"It Could Happen to You",artist:"Jimmy Van Heusen",tags:["Jazz","Standard"],key:"Eb",bpm:100,content:`{title: It Could Happen to You}
{artist: Jimmy Van Heusen}
{key: Eb}

{start_of_verse}
[Ebmaj7]  [Gm7]  [Fm7]  [Bb7]
[Ebmaj7]  [Gm7]  [Fm7]  [Bb7]
[Am7b5]  [D7]  [Gm7]  [C7]
{end_of_verse}`}),t({id:"jazz-pack-just-friends",title:"Just Friends",artist:"John Klenner",tags:["Jazz","Standard","Swing"],key:"G",bpm:140,content:`{title: Just Friends}
{artist: John Klenner}
{key: G}

{start_of_verse}
[Gmaj7]  [Gmaj7]  [Gmaj7]  [Gmaj7]
[Em7]  [A7]  [Am7]  [D7]
[Gmaj7]  [Gmaj7]  [E7]  [E7]
{end_of_verse}`}),t({id:"jazz-pack-laura",title:"Laura",artist:"David Raksin",tags:["Jazz","Standard","Ballad"],key:"C",bpm:80,content:`{title: Laura}
{artist: David Raksin}
{key: C}

{start_of_verse}
[Cmaj7]  [E7]  [Am7]  [D7]
[Dm7]  [G7]  [Cmaj7]  [Cmaj7]
{end_of_verse}`}),t({id:"jazz-pack-lullaby-of-birdland",title:"Lullaby of Birdland",artist:"George Shearing",tags:["Jazz","Standard","Swing"],key:"F",bpm:140,content:`{title: Lullaby of Birdland}
{artist: George Shearing}
{key: F}

{start_of_verse}
[Fmaj7]  [Gm7]  [Am7]  [Abm7]
[Gm7]  [C7]  [Fmaj7]  [Fmaj7]
{end_of_verse}`}),t({id:"jazz-pack-mack-the-knife",title:"Mack the Knife",artist:"Kurt Weill",tags:["Jazz","Standard","Swing"],key:"C",bpm:120,content:`{title: Mack the Knife}
{artist: Kurt Weill}
{key: C}

{start_of_verse}
[C]Oh, the shark has pretty teeth dear
And he shows them pearly white

{start_of_chorus}
[C]Just a jackknife has old MacHeath, babe
And he keeps it out of sight
{end_of_chorus}`}),t({id:"jazz-pack-my-favorite-things",title:"My Favorite Things",artist:"Richard Rodgers",tags:["Jazz","Standard","Waltz"],key:"E",bpm:100,content:`{title: My Favorite Things}
{artist: Richard Rodgers}
{key: E}

{start_of_verse}
[Em]  [Em]  [Em]  [Em]
[E7]  [E7]  [Am]  [Am]
[F#m7b5]  [B7]  [Em]  [Em]
{end_of_verse}`}),t({id:"jazz-pack-night-and-day",title:"Night and Day",artist:"Cole Porter",tags:["Jazz","Standard"],key:"C",bpm:100,content:`{title: Night and Day}
{artist: Cole Porter}
{key: C}

{start_of_verse}
[C]Night and day, you are the one
Only you beneath the moon and under the sun

{start_of_chorus}
[C]Whether near to me or far
It's no matter darling where you are
{end_of_chorus}`}),t({id:"jazz-pack-oleo",title:"Oleo",artist:"Sonny Rollins",tags:["Jazz","Standard","Rhythm Changes"],key:"Bb",bpm:180,content:`{title: Oleo}
{artist: Sonny Rollins}
{key: Bb}

{start_of_verse}
[Bb]  [G7]  [Cm7]  [F7]
[Bb]  [G7]  [Cm7]  [F7]

{start_of_bridge}
[D7]  [D7]  [G7]  [G7]
[C7]  [C7]  [F7]  [F7]
{end_of_bridge}`}),t({id:"jazz-pack-on-green-dolphin-street",title:"On Green Dolphin Street",artist:"Bronislaw Kaper",tags:["Jazz","Standard"],key:"C",bpm:140,content:`{title: On Green Dolphin Street}
{artist: Bronislaw Kaper}
{key: C}

{start_of_verse}
[Cmaj7]  [Cmaj7]  [Cmaj7]  [Cmaj7]
[Cm7]  [F7]  [Bbmaj7]  [Ebmaj7]
[Am7b5]  [D7]  [Gm7]  [C7]
{end_of_verse}`}),t({id:"jazz-pack-solar",title:"Solar",artist:"Miles Davis",tags:["Jazz","Standard","Modal"],key:"Cm",bpm:140,content:`{title: Solar}
{artist: Miles Davis}
{key: Cm}

{start_of_verse}
[Cm7]  [Fm7]  [Cm7]  [Cm7]
[Ab7]  [Ab7]  [DbMaj7]  [DbMaj7]
[Dm7b5]  [G7]  [Cm7]  [G7]
{end_of_verse}`}),t({id:"jazz-pack-song-for-my-father",title:"Song for My Father",artist:"Horace Silver",tags:["Jazz","Standard","Latin"],key:"Fm",bpm:100,content:`{title: Song for My Father}
{artist: Horace Silver}
{key: Fm}

{start_of_verse}
[Fm7]  [Fm7]  [Fm7]  [Fm7]
[Db7]  [Db7]  [Fm7]  [Fm7]
[Eb7]  [Db7]  [Fm7]  [Fm7]
{end_of_verse}`}),t({id:"jazz-pack-softly-as-in-a-morning-sunrise",title:"Softly, as in a Morning Sunrise",artist:"Sigmund Romberg",tags:["Jazz","Standard"],key:"Cm",bpm:120,content:`{title: Softly, as in a Morning Sunrise}
{artist: Sigmund Romberg}
{key: Cm}

{start_of_verse}
[Cm]  [Cm]  [Fm]  [Fm]
[Cm]  [Cm]  [Ab]  [Ab]
[Dm7b5]  [G7]  [Cm]  [G7]
{end_of_verse}`}),t({id:"jazz-pack-someday-my-prince-will-come",title:"Someday My Prince Will Come",artist:"Frank Churchill",tags:["Jazz","Standard","Waltz"],key:"Bb",bpm:100,content:`{title: Someday My Prince Will Come}
{artist: Frank Churchill}
{key: Bb}

{start_of_verse}
[Bbmaj7]  [Gm7]  [Cm7]  [F7]
[Bbmaj7]  [Gm7]  [Cm7]  [F7]
[Ebmaj7]  [Ab7]  [Dbmaj7]  [Dbmaj7]
{end_of_verse}`}),t({id:"jazz-pack-st-thomas",title:"St. Thomas",artist:"Sonny Rollins",tags:["Jazz","Standard","Calypso"],key:"C",bpm:140,content:`{title: St. Thomas}
{artist: Sonny Rollins}
{key: C}

{start_of_verse}
[C6]  [C6]  [C6]  [C6]
[F6]  [F6]  [C6]  [C6]
[G7]  [F6]  [C6]  [G7]
{end_of_verse}`}),t({id:"jazz-pack-stardust",title:"Stardust",artist:"Hoagy Carmichael",tags:["Jazz","Standard","Ballad"],key:"Eb",bpm:80,content:`{title: Stardust}
{artist: Hoagy Carmichael}
{key: Eb}

{start_of_verse}
[Ebmaj7]  [Gm7]  [Fm7]  [Bb7]
[Ebmaj7]  [Gm7]  [Fm7]  [Bb7]
[Am7b5]  [D7]  [Gm7]  [C7]
{end_of_verse}`}),t({id:"jazz-pack-straight-no-chaser",title:"Straight, No Chaser",artist:"Thelonious Monk",tags:["Jazz","Standard","Blues"],key:"F",bpm:160,content:`{title: Straight, No Chaser}
{artist: Thelonious Monk}
{key: F}

{start_of_verse}
[F7]  [Bb7]  [F7]  [F7]
[Bb7]  [Bb7]  [F7]  [D7]
[Gm7]  [C7]  [F7]  [C7]
{end_of_verse}`}),t({id:"jazz-pack-tenor-madness",title:"Tenor Madness",artist:"Sonny Rollins",tags:["Jazz","Standard","Blues"],key:"Bb",bpm:160,content:`{title: Tenor Madness}
{artist: Sonny Rollins}
{key: Bb}

{start_of_verse}
[Bb7]  [Eb7]  [Bb7]  [Bb7]
[Eb7]  [Eb7]  [Bb7]  [G7]
[Cm7]  [F7]  [Bb7]  [F7]
{end_of_verse}`}),t({id:"jazz-pack-they-cant-take-that-away-from-me",title:"They Can't Take That Away from Me",artist:"George Gershwin",tags:["Jazz","Standard"],key:"C",bpm:120,content:`{title: They Can't Take That Away from Me}
{artist: George Gershwin}
{key: C}

{start_of_verse}
[C]The way you wear your hat
The way you sip your tea

{start_of_chorus}
[C]No, no they can't take that away from me
{end_of_chorus}`}),t({id:"jazz-pack-there-will-never-be-another-you",title:"There Will Never Be Another You",artist:"Harry Warren",tags:["Jazz","Standard","Swing"],key:"Eb",bpm:140,content:`{title: There Will Never Be Another You}
{artist: Harry Warren}
{key: Eb}

{start_of_verse}
[Ebmaj7]  [Gm7]  [Fm7]  [Bb7]
[Ebmaj7]  [Gm7]  [Fm7]  [Bb7]
[Am7b5]  [D7]  [Gm7]  [C7]
{end_of_verse}`}),t({id:"jazz-pack-whats-new",title:"What's New",artist:"Bob Haggart",tags:["Jazz","Standard","Ballad"],key:"G",bpm:90,content:`{title: What's New}
{artist: Bob Haggart}
{key: G}

{start_of_verse}
[Gmaj7]  [Gm7]  [Fmaj7]  [E7]
[Am7]  [D7]  [Gmaj7]  [Gmaj7]
{end_of_verse}`}),t({id:"jazz-pack-yesterdays",title:"Yesterdays",artist:"Jerome Kern",tags:["Jazz","Standard"],key:"F",bpm:100,content:`{title: Yesterdays}
{artist: Jerome Kern}
{key: F}

{start_of_verse}
[Fmaj7]  [Em7b5]  [A7]  [Dm7]
[Gm7]  [C7]  [Fmaj7]  [Fmaj7]
{end_of_verse}`})];export{i as JAZZ_PACK};
