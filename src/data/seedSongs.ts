import type { Song } from '../types';

export const SEED_SONGS: Song[] = [
    {
        id: 'nirvana-about-a-girl',
        title: 'About a Girl (Unplugged)',
        artist: 'Nirvana',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_intro}
[Em] [G] [Em] [G] [Em] [G] [Em] [G]

{start_of_verse: Verse 1}
[Em]I need an [G]easy friend
[Em]I do... with an [G]ear to lend
[Em]I do... think you [G]fit this shoe
[Em]I do... but you [G]have a clue

{start_of_chorus}
[C#m]I'll take advan[C#m/G#]tage while
[F#]You hang me out to dry
[E]But I can't see you [A]every night
[Em]Free [G] [Em] [G]
[Em]I do [G] [Em] [G]

{start_of_verse: Verse 2}
[Em]I'm standing [G]in your line
[Em]I do... hope you [G]have the time
[Em]I do... pick a [G]number too
[Em]I do... keep a [G]date with you

{start_of_chorus}
[C#m]I'll take advan[C#m/G#]tage while
[F#]You hang me out to dry
[E]But I can't see you [A]every night
[Em]Free [G] [Em] [G]
[Em]I do [G] [Em] [G]`
    },
    {
        id: 'nirvana-man-who-sold',
        title: 'The Man Who Sold the World',
        artist: 'Nirvana',
        tags: ['Grunge', '90s'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[F] [Dm] [F] [Dm]

[Dm]We passed upon the [A]stair, we spoke of was and [Dm]when
[A]Although I wasn't [F]there, he said I was his [C]friend
Which came as a sur[A]prise, I spoke into his [Dm]eyes
I thought you died a[C]lone, a long long time a[C]go

[C]Oh no, not [F]me
[C#]We never lost con[F]trol
[C]You're face to [F]face
[C#]With the man who sold the [A]world [Dm]

[Dm]I laughed and shook his [A]hand, and made my way back [Dm]home
[A]I searched for form and [F]land, for years and years I [C]roamed
I gazed a gazeless [A]stare, we walked a million [Dm]bills
I must have died a[C]lone, a long long time a[C]go

[C]Oh no, not [F]me
[C#]We never lost con[F]trol
[C]You're face to [F]face
[C#]With the man who sold the [A]world [Dm]`
    },
    {
        id: 'aic-nutshell',
        title: 'Nutshell',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Em7] [G] [D] [Cadd9]

[Cadd9]We chase mis[Em7]printed lie[G]s [D]
[Cadd9]We face the [Em7]path of tim[G]e [D]
[Cadd9]And yet I find, and [Em7]yet I find this [G]battle all a[D]lone
[Cadd9]No one to cry to, [Em7]no place to call home

[G]Oooh[D]hh [Cadd9] [Em7]
[G]Oooh[D]hh [Cadd9] [Em7]

[Cadd9]My gift of [Em7]self is rape[G]d [D]
[Cadd9]My privacy [Em7]is rake[G]d [D]
[Cadd9]And yet I find, and [Em7]yet I find re[G]peating in my [D]head
[Cadd9]If I can't be my [Em7]own, I'd feel better dead

[G]Oooh[D]hh [Cadd9] [Em7]
[G]Oooh[D]hh [Cadd9] [Em7]`
    },
    {
        id: 'jazz-autumn-leaves',
        title: 'Autumn Leaves',
        artist: 'Jazz Standard',
        tags: ['Jazz', 'Standard'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Am7]The falling [D7]leaves drift by the [Gmaj7]window
[Cmaj7]The autumn [F#m7b5]leaves of [B7]red and [Em]gold
[Am7]I see your [D7]lips, the summer [Gmaj7]kisses
[Cmaj7]The sunburned [F#m7b5]hands I [B7]used to [Em]hold

[F#m7b5]Since you went a[B7]way the days grow [Em]long
[Am7]And soon I'll [D7]hear old [Gmaj7]winter's song
[Cmaj7]But I miss you [F#m7b5]most of [B7]all, my [Em]darling
[Cmaj7]When autumn [F#m7b5]leaves [B7]start to [Em]fall`
    },
    {
        id: 'pearl-jam-black',
        title: 'Black',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[E] [Asus2] [E] [Asus2]

[E]Sheets of empty [Asus2]canvas, untouched sheets of [E]clay [Asus2]
[E]Were laid spread out be[A]fore me as her body once [E]did
[E]All five hori[Asus2]zons, revolved around her [E]soul [Asus2]
[E]Now the air I [A]tasted and breathed, has taken a [E]turn

[C]Ooh, and all I taught her was [Em]everything
[C]Ooh, I know she gave me all that she [Em]wore

[D]And now my bitter [C]hands
Chafe beneath the [Em]clouds
Of what was every[D]thing
All the pictures [C]have
All been washed in [Em]black
Tattooed every[D]thing`
    },
    {
        id: 'soundgarden-black-hole-sun',
        title: 'Black Hole Sun',
        artist: 'Soundgarden',
        tags: ['Grunge', '90s'],
        key: 'G',
        capo: 4,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[E] [G] [D] [C#m] [C] [B]

[E]In my eyes, indi[G]sposed
[D]In disguises no one [C#m]knows
[C]Hides the face, lies the [B]snake
[E]The sun in my dis[F]grace

[E]Boiling heat, summer [G]stench
[D]'Neath the black the sky looks [C#m]dead
[C]Call my name through the [B]cream
[E]And I'll hear you scream a[F]gain

[C]Black hole [B]sun
Won't you [E]come [D] [G]
And wash away the rain
[C]Black hole [B]sun
Won't you [A]come, won't you [B]come`
    },
    {
        id: 'jazz-fly-me-to-moon',
        title: 'Fly Me to the Moon',
        artist: 'Frank Sinatra',
        tags: ['Jazz', '50s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Am7]Fly me to the [Dm7]moon, let me [G7]play among the [Cmaj7]stars
[Fmaj7]Let me see what [Bm7b5]spring is like on [E7]Jupiter and [Am7]Mars [A7]
[Dm7]In other [G7]words, [Cmaj7]hold my [F7]hand [Em7] [A7]
[Dm7]In other [G7]words, [Cmaj7]baby kiss [E7]me

[Am7]Fill my heart with [Dm7]song, and let me [G7]sing forever[Cmaj7]more
[Fmaj7]You are all I [Bm7b5]long for, all I [E7]worship and a[Am7]dore [A7]
[Dm7]In other [G7]words, [Em7]please be [A7]true
[Dm7]In other [G7]words, [Cmaj7]I love you`
    },
    {
        id: 'jazz-summertime',
        title: 'Summertime',
        artist: 'George Gershwin',
        tags: ['Jazz', '30s', 'Blues'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Am]Summertime, [E7]and the [Am]livin' is easy
[Dm]Fish are jumpin' [F]and the [E7]cotton is [Am]high
[Am]Oh, your daddy's [E7]rich and your [Am]mama's good lookin'
[G]So [A7]hush little [B7]baby, don't you [Em]cry

[Am]One of these [E7]mornings [Am]you're goin' to rise up singing
[Dm]Then you'll spread your [F]wings and you'll [E7]take the [Am]sky
[Am]But 'til that [E7]morning [Am]there's nothin' can harm you
[G]With [A7]daddy and [B7]mammy standing [Em]by`
    },
    {
        id: 'beatles-let-it-be',
        title: 'Let It Be',
        artist: 'The Beatles',
        tags: ['Rock', '60s'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[C]When I find my[G]self in times of [Am]trouble, Mother [F]Mary comes to [C]me
Speaking [G]words of wisdom, let it [F]be [C]
[C]And in my [G]hour of darkness she is [Am]standing right in [F]front of [C]me
Speaking [G]words of wisdom, let it [F]be [C]

[Am]Let it be, let it [G]be, let it [F]be, let it [C]be
Whisper [G]words of wisdom, let it [F]be [C]`
    },
    {
        id: 'pink-floyd-wish-you-were-here',
        title: 'Wish You Were Here',
        artist: 'Pink Floyd',
        tags: ['Rock', '70s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[C]So, so you think you can [D]tell
Heaven from [Am]Hell, blue skies from [G]pain
Can you tell a green [D]field from a cold steel [C]rail?
A smile from a [Am]veil? Do you think you can [G]tell?

[C]Did they get you to [D]trade your heroes for [Am]ghosts?
Hot ashes for [G]trees? Hot air for a [D]cool breeze?
Cold comfort for [C]change? Did you ex[Am]change
A walk on part in the [G]war for a lead role in a cage?

[C]How I wish, how I wish you were [D]here
We're just [Am]two lost souls swimming in a fish [G]bowl
Year after [D]year, running over the [C]same old ground
What have we [Am]found? The same old [G]fears
Wish you were here`
    },
    {
        id: 'cash-hurt',
        title: 'Hurt',
        artist: 'Johnny Cash',
        tags: ['Country', '00s', 'Acoustic'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Am]I hurt my[C]self to[D]day, to see if I still [Am]feel
I [C]focus on the [D]pain, the only thing that's [Am]real
The [C]needle tears a [D]hole, the old familiar [Am]sting
Try to [C]kill it all a[D]way, but I remember every[Am]thing

[Am]What have I be[F]come, my sweetest [C]friend?
Everyone I [G]know goes away in the [Am]end
And you could have it [F]all, my empire of [C]dirt
I will let you [G]down, I will make you [Am]hurt`
    },
    {
        id: 'stp-plush',
        title: 'Plush',
        artist: 'Stone Temple Pilots',
        tags: ['Grunge', '90s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[G]And I [D/F#]feel [F]that time's a [C/G]wasted go
[D#maj7]So where you [F]going to to[G]morrow?
And I [D/F#]see [F]that these are [C/G]lies to come
[D#maj7]Or would you [F]even [D5]care?

And I [C9]feel [D5/B]it [C9] and I [D5]feel [C9]it [D5/B] [C9]

[D#maj7]Where ya going for to[F]morrow?
[D#maj7]Where ya going with that [F]mask I found?
[D#maj7]And I feel, and I feel when the [F]dogs begin to smell her
[D#7]Will she [F]smell alone?`
    },
    {
        id: 'led-zep-stairway',
        title: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        tags: ['Rock', '70s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Am]There's a [E+]lady who's [C]sure all that [D]glitters is [F]gold
And she's [G]buying a stairway to [Am]heaven
[Am]When she [E+]gets there she [C]knows if the [D]stores are all [F]closed
With a [G]word she can get what she [Am]came for

[C]Ooh [D]ooh [F]ooh [Am]ooh and she's [C]buying a stairway to [G]heaven [D]

[C]There's a [D]sign on the [Fmaj7]wall but she [Am]wants to be sure
[C]'Cause you know sometimes [D]words have two [Fmaj7]meanings`
    },
    {
        id: 'eagles-hotel-california',
        title: 'Hotel California',
        artist: 'Eagles',
        tags: ['Rock', '70s'],
        key: 'Bm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Bm]On a dark desert [F#]highway, [A]cool wind in my [E]hair
[G]Warm smell of co[D]litas [Em]rising up through the [F#]air
[Bm]Up ahead in the [F#]distance, [A]I saw a shimmering [E]light
[G]My head grew heavy and my [D]sight grew dim
[Em]I had to stop for the [F#]night

[Bm]Welcome to the Hotel Cali[F#]fornia
[A]Such a lovely place (such a lovely place)
[E]Such a lovely face
[G]Plenty of room at the Hotel Cali[D]fornia
Any [Em]time of year (any time of year)
You can [F#]find it here`
    },
    {
        id: 'oasis-wonderwall',
        title: 'Wonderwall',
        artist: 'Oasis',
        tags: ['Rock', '90s'],
        key: 'Em',
        capo: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Em7]Today is [G]gonna be the day that they're [Dsus4]gonna throw it back to [Asus4]you
[Em7]By now you [G]should've somehow re[Dsus4]alized what you gotta [Asus4]do
[Em7]I don't believe that [G]anybody [Dsus4]feels the way I [Asus4]do
About you [Cadd9]now [Dsus4] [Asus4]

[Cadd9]Back[D]beat, the [Em7]word is on the street
That the [D]fire in your heart is [Asus4]out
[Cadd9]I'm [D]sure you've heard it [Em7]all before
But you [D]never really had a [Asus4]doubt

[Cadd9]I don't believe that [D]anybody [Em7]feels the way I [Asus4]do
About you [Em7]now [G] [Dsus4] [Asus4]

And [Cadd9]all the roads we [Em7]have to walk are [G]winding
And [Cadd9]all the lights that [Em7]lead us there are [G]blinding
[Cadd9]There are many [D]things that I would [Asus4]like to say to you
But I don't know [Cadd9]how [Em7] [G] [Em7]

Because [Cadd9]maybe [Em7] [G]
You're gonna be the one that [Em7]saves me
[Cadd9] [Em7] [G] [Em7]
And after [Cadd9]all [Em7] [G] [Em7]
You're my wonder[Cadd9]wall [Em7] [G] [Em7]`
    },
    {
        id: 'radiohead-creep',
        title: 'Creep',
        artist: 'Radiohead',
        tags: ['Rock', '90s'],
        key: 'G',
        capo: 7,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[G]When you were here be[B]fore
Couldn't look you in the [C]eye
You're just like an [Cm]angel
Your skin makes me [G]cry

You float like a [B]feather
In a beautiful [C]world
I wish I was [Cm]special
You're so fucking [G]special

But I'm a [B]creep
I'm a [C]weirdo
What the hell am I doing [Cm]here?
I don't be[G]long here

I don't care if it [B]hurts
I wanna have [C]control
I want a perfect [Cm]body
I want a perfect [G]soul`
    },
    {
        id: 'simon-garfunkel-sound-of-silence',
        title: 'The Sound of Silence',
        artist: 'Simon & Garfunkel',
        tags: ['Folk', '60s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[Am]Hello darkness, my old [G]friend
I've come to talk with you [Am]again
Because a vision [C]softly [F]creeping
Left its seeds while [C]I was [F]sleeping
And the [F]vision that was planted in my [C]brain
Still re[Am]mains [C]within the [G]sound of [Am]silence

[Am]In restless dreams I walked [G]alone
Narrow streets of [Am]cobblestone
'Neath the halo [C]of a [F]street lamp
I turned my collar [C]to the cold and [F]damp
When my [F]eyes were stabbed by the flash of a neon [C]light
That split the [Am]night [C]and touched the [G]sound of [Am]silence`
    },
    {
        id: 'dylan-knockin-on-heavens-door',
        title: "Knockin' on Heaven's Door",
        artist: 'Bob Dylan',
        tags: ['Rock', '70s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[G]Mama, take this [D]badge off of [Am]me
[G]I can't [D]use it any[C]more
[G]It's gettin' [D]dark, too dark to [Am]see
[G]I feel I'm [D]knockin' on heaven's [C]door

[G]Knock, knock, [D]knockin' on heaven's [Am]door
[G]Knock, knock, [D]knockin' on heaven's [C]door
[G]Knock, knock, [D]knockin' on heaven's [Am]door
[G]Knock, knock, [D]knockin' on heaven's [C]door`
    },
    {
        id: 'clapton-wonderful-tonight',
        title: 'Wonderful Tonight',
        artist: 'Eric Clapton',
        tags: ['Rock', '70s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[G]It's late in the [D]evening, [C]she's wondering what clothes to [D]wear
[G]She puts on her [D]make-up, [C]and brushes her long blonde [D]hair
[C]And then she asks [D]me, "Do I [G]look all [D/F#]right?"
[Em]And I say [C]"Yes, you look [D]wonderful to[G]night" [D] [C] [D]

[G]We go to a [D]party, [C]and everyone turns to [D]see
[G]This beautiful [D]lady [C]that's walking around with [D]me
[C]And then she asks [D]me, "Do you [G]feel all [D/F#]right?"
[Em]And I say [C]"Yes, I [D]feel wonderful to[G]night"`
    },
    {
        id: 'tom-petty-free-fallin',
        title: "Free Fallin'",
        artist: 'Tom Petty',
        tags: ['Rock', '80s'],
        key: 'F',
        capo: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `[F]She's a good [Fsus2]girl, loves her [C]mama
Loves [Bb]Jesus and America [F]too
She's a good [Fsus2]girl, crazy 'bout [C]Elvis
Loves [Bb]horses and her boyfriend [F]too

And I'm [F]free, [Fsus2] [C]free [Bb]fallin'
Yeah I'm [F]free, [Fsus2] [C]free [Bb]fallin'

[F]All the vampires [Fsus2]walkin' through the [C]valley
Move [Bb]west down Ventura Boule[F]vard
And all the bad [Fsus2]boys are standing in the [C]shadows
        And the [Bb] good girls are home with broken [F]hearts`
    },

    // PUBLIC DOMAIN & TRADITIONAL SONGS
    {
        id: 'traditional-amazing-grace',
        title: 'Amazing Grace',
        artist: 'Traditional Hymn',
        tags: ['Gospel', 'Traditional', 'Easy'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Amazing [G7]grace how [C]sweet the [G]sound
That saved a wretch like [D7]me
[G]I once was [G7]lost but [C]now I'm [G]found
Was [Em]blind but [D7]now I [G]see

{start_of_verse: Verse 2}
[G]'Twas [G7]grace that [C]taught my [G]heart to fear
And grace my fears re[D7]lieved
[G]How [G7]precious [C]did that [G]grace appear
The [Em]hour I [D7]first be[G]lieved`
    },
    {
        id: 'traditional-kumbaya',
        title: 'Kumbaya',
        artist: 'Traditional Spiritual',
        tags: ['Gospel', 'Traditional', 'Easy'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Kumbaya my Lord, [F]Kumba[C]ya
Kumbaya my Lord, [G7]Kumba[C]ya
Kumbaya my Lord, [F]Kumba[C]ya
[F]Oh [C]Lord, [G7]Kumba[C]ya

{start_of_verse: Verse 2}
[C]Someone's singing Lord, [F]Kumba[C]ya
Someone's singing Lord, [G7]Kumba[C]ya
Someone's singing Lord, [F]Kumba[C]ya
[F]Oh [C]Lord, [G7]Kumba[C]ya`
    },
    {
        id: 'traditional-oh-susanna',
        title: 'Oh Susanna',
        artist: 'Stephen Foster',
        tags: ['Folk', 'Traditional', 'Easy'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]I come from Alabama with my [G7]banjo on my knee
I'm [C]going to Louisiana, my [G7]true love for to [C]see
It [C]rained all night the day I left, the [G7]weather it was dry
The [C]sun so hot I froze to death, Su[G7]sanna don't you [C]cry

{start_of_chorus}
[C]Oh Susanna, oh [F]don't you cry for [C]me
I come from Alabama with my [G7]banjo on my [C]knee`
    },
    {
        id: 'traditional-will-the-circle-be-unbroken',
        title: 'Will the Circle Be Unbroken',
        artist: 'Traditional Bluegrass',
        tags: ['Folk', 'Traditional'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]I was standing [G7]by my [C]window
On a [G]cold and cloudy [D7]day
When I [G]saw the hearse come [G7]rolling
For to [C]carry my [G]mother [D7]a[G]way

{start_of_chorus}
Will the [G]circle [G7]be un[C]broken
By and [G]by Lord by and [D7]by
There's a [G]better [G7]home a[C]waiting
In the [G]sky Lord [D7]in the [G]sky`
    },
    {
        id: 'traditional-clementine',
        title: 'Oh My Darling Clementine',
        artist: 'Traditional Folk',
        tags: ['Folk', 'Traditional', 'Easy'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]In a cavern, in a canyon
Excavating for a [G7]mine
Dwelt a miner, forty-[C]niner
And his daughter Clemen[G7]tine[C]

{start_of_chorus}
[C]Oh my darling, oh my darling
Oh my darling Clemen[G7]tine
You are lost and gone for[C]ever
Dreadful sorry, Clemen[G7]tine[C]`
    },
    {
        id: 'traditional-greensleeves',
        title: 'Greensleeves',
        artist: 'Traditional English',
        tags: ['Folk', 'Traditional'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]Alas my [G]love you [Am]do me wrong
To [Am]cast me [E7]off dis[Am]courteously
And [Am]I have [G]loved you [Am]oh so long
De[Am]lighting [E7]in your [Am]company

{start_of_chorus}
[C]Greensleeves was [G]all my joy
[Am]Greensleeves was [E7]my delight
[C]Greensleeves was my [G]heart of gold
And [Am]who but my [E7]lady [Am]Greensleeves`
    },
    {
        id: 'traditional-house-of-the-rising-sun',
        title: 'House of the Rising Sun',
        artist: 'Traditional Folk',
        tags: ['Folk', 'Traditional'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
There [Am]is a [C]house in [D]New Or[F]leans
They [Am]call the [C]Rising [E7]Sun
And it's [Am]been the [C]ruin of [D]many a poor [F]boy
And [Am]God I [E7]know I'm [Am]one

{start_of_verse: Verse 2}
My [Am]mother [C]was a [D]tailor [F]
She [Am]sewed my [C]new blue [E7]jeans
My [Am]father [C]was a [D]gamblin' [F]man
[Am]Down in [E7]New Or[Am]leans`
    },
    {
        id: 'traditional-down-in-the-valley',
        title: 'Down in the Valley',
        artist: 'Traditional American Folk',
        tags: ['Folk', 'Traditional', 'Easy'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Down in the valley, valley so [G7]low
Hang your head over, hear the wind [C]blow
Hear the wind blow, dear, hear the wind [G7]blow
Hang your head over, hear the wind [C]blow

{start_of_verse: Verse 2}
[C]Roses love sunshine, violets love [G7]dew
Angels in heaven know I love [C]you
Know I love you, dear, know I love [G7]you
Angels in heaven know I love [C]you`
    },

    // 90s GRUNGE CLASSICS
    {
        id: 'smashing-pumpkins-today',
        title: 'Today',
        artist: 'Smashing Pumpkins',
        tags: ['Grunge', '90s'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Emaj7]Today is the [G6]greatest
[Emaj7]Day I've ever [G6]known
[Emaj7]Can't live for to[G6]morrow
[Emaj7]Tomorrow's much too [G6]long

{start_of_verse: Verse 2}
[Emaj7]I'll burn my [G6]eyes out
[Emaj7]Before I get [G6]out

{start_of_chorus}
[A]I wanted [Asus4]more than [A]life could [Asus4]ever grant me
[A]Bored by the [Asus4]chore of [A]saving [Asus4]face

{start_of_bridge}
[Emaj7]Today is the [G6]greatest
Day I've ever [Emaj7]known [G6]`
    },
    {
        id: 'foo-fighters-everlong',
        title: 'Everlong',
        artist: 'Foo Fighters',
        tags: ['Rock', '90s'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_intro}
[D] [Bm] [G] [D]

{start_of_verse}
[D]Hello, I've waited here for [Bm]you
Ever[G]long [D]
[D]Tonight, I throw myself in[Bm]to
And [G]out of the red, out of her head she [D]sang

{start_of_chorus}
[D]Come down and [Bm]waste away with [G]me
Down with [D]me
[D]Slow how you [Bm]wanted it to [G]be
I'm over my [D]head
Out of her [Bm]head she [G]sang`
    },
    {
        id: 'bush-glycerine',
        title: 'Glycerine',
        artist: 'Bush',
        tags: ['Grunge', '90s'],
        key: 'F#',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F#]Must be your skin I'm sinking [B]in
[F#]Must be for real 'cause now I can [B]feel
And I [F#]didn't mind, it's not my [B]kind
Not my [F#]time to [B]wonder why

{start_of_chorus}
[B]Everything's gonna be [F#]fine
[B]Everything's gonna be all[F#]right
[B]Everything's gonna be al[F#]right

[F#]Glycerine [B]
[F#]Glycerine [B]`
    },
    {
        id: 'silverchair-tomorrow',
        title: 'Tomorrow',
        artist: 'Silverchair',
        tags: ['Grunge', '90s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_intro}
[Am] [C] [G] [F]

{start_of_verse}
It's [Am]twelve o'clock and it's a [C]wonderful day
I [G]know you hate me but I'll [F]ask anyway
[Am]Won't you come with me to a [C]place in a little town
The [G]only way to get there's to [F]go straight down

{start_of_chorus}
There's no [Am]pathway no [C]lights to [G]see the [F]day
[Am]Blinding white [C]you know that's the [G]only [F]way`
    },
    {
        id: 'temple-of-the-dog-hunger-strike',
        title: 'Hunger Strike',
        artist: 'Temple of the Dog',
        tags: ['Grunge', '90s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]I don't mind stealing [C]bread
From the mouths of deca[G]dence
[Am]But I can't feed on the [C]powerless
When my cup's already over[G]filled
[Am]But it's on the table
The [C]fire's cooking
[G]And they're farming babies, the slaves are all working

{start_of_chorus}
[Fmaj7]Blood is on the table, the mouths are all choking
[Am]I'm going hungry [G]
[Am]I'm going hungry [G]`
    },
    {
        id: 'rage-against-the-machine-killing-in-the-name',
        title: 'Killing in the Name',
        artist: 'Rage Against the Machine',
        tags: ['Rock', '90s'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_intro}
[Dm] [Dm] [Dm] [Dm]

{start_of_verse}
Killing in the name of
[Dm]Some of those that work forces
Are the same that burn crosses
[Dm]Some of those that work forces
Are the same that burn crosses

{start_of_chorus}
[Dm]Now you do what they told ya
Now you do what they told ya
Now you do what they told ya
Now you do what they told ya

{start_of_bridge}
And now you do what they told ya
[F]Those who died are justified
For [G]wearing the badge, they're the [Dm]chosen whites`
    },
    {
        id: 'weezer-say-it-aint-so',
        title: "Say It Ain't So",
        artist: 'Weezer',
        tags: ['Rock', '90s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]Oh yeah, [F]all right
[C]Feels good, [G]inside
[Am]Flip on the [F]tele, [C]wrestle with [G]Jimmy

{start_of_verse: Verse 2}
[Am]Something is [F]bubbling
[C]Behind my [G]back
The [Am]bottle is [F]ready to [C]blow [G]

{start_of_chorus}
[Am]Say it ain't [C]so
Your [G]drug is a [D]heartbreaker
[Am]Say it ain't [C]so
My [G]love is a [D]life taker`
    }
    ,


    // NEW EXPANSION PACK (20 Songs)

    // CLASSIC ROCK
    {
        id: 'queen-bohemian-rhapsody',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        tags: ['Rock', '70s'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Bohemian Rhapsody}
{artist: Queen}

{start_of_verse}
[Bb6]Is this the real life?
[C7]Is this just fantasy?
[F7]Caught in a land[Cm7]slide
No es[F7]cape from re[Bb]ality
[Gm]Open your eyes
Look [Bb7]up to the skies and [Eb]see
[Cm]I'm just a poor boy, [F7]I need no sympathy
Because I'm [B]easy [Bb]come, [A]easy [Bb]go
[B]Little [Bb]high, [A]little [Bb]low
[Eb]Any way the [Bb/D]wind blows
[C#dim]Doesn't really [F7/C]matter to [F]me, to me
{end_of_verse}

{start_of_intro: Piano Ballad Section}
[Bb]Mama [Gm]just killed a man
Put a [Cm]gun against his head
Pulled my [cm]trigger, now he's [F]dead
[Bb]Mama, [Gm]life had just begun
But [Cm]now I've gone and [B+]thrown it [Eb/Bb]all [Am7b5]away [D7]
{end_of_intro}`
    },
    {
        id: 'stones-paint-it-black',
        title: 'Paint It, Black',
        artist: 'The Rolling Stones',
        tags: ['Rock', '60s'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Paint It, Black}
{artist: The Rolling Stones}

{start_of_verse}
[Em]I see a red door and I [B7]want it painted black
[Em]No colors anymore I [B7]want them to turn black
[Em]I [D]see the [G]girls walk [D]by dressed [Em]in their summer clothes
[Em]I [D]have to [G]turn my [D]head un[A]til my darkness [B7]goes
{end_of_verse}`
    },
    {
        id: 'hendrix-hey-joe',
        title: 'Hey Joe',
        artist: 'Jimi Hendrix',
        tags: ['Pop', '60s'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Hey Joe}
{artist: Jimi Hendrix}

{start_of_intro}
[C] [G] [D] [A] [E]
{end_of_intro}

{start_of_verse}
[C]Hey [G]Joe, where you [D]goin' with that [A]gun of your [E]hand?
[C]Hey [G]Joe, I said where you [D]goin' with that [A]gun of your [E]hand?
[C]I'm goin' down to [G]shoot my old lady
[D]You know I caught her [A]messin' 'round with another [E]man
{end_of_verse}`
    },
    {
        id: 'lynyrd-sweet-home-alabama',
        title: 'Sweet Home Alabama',
        artist: 'Lynyrd Skynyrd',
        tags: ['Rock', '70s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Sweet Home Alabama}
{artist: Lynyrd Skynyrd}

{start_of_verse}
[D]Big [C]wheels keep on [G]turning
[D]Carry me [C]home to see my [G]kin
[D]Singing [C]songs about the [G]Southland
[D]I miss A[C]labama once a[G]gain and I think it's a sin
{end_of_verse}

{start_of_chorus}
[D]Sweet [C]home Ala[G]bama
[D]Where the [C]skies are so [G]blue
[D]Sweet [C]home Ala[G]bama
[D]Lord I'm [C]coming home to [G]you
{end_of_chorus}`
    },
    {
        id: 'ccr-have-you-ever-seen-rain',
        title: 'Have You Ever Seen the Rain',
        artist: 'CCR',
        tags: ['Rock', '70s'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Have You Ever Seen the Rain}
{artist: Creedence Clearwater Revival}

{start_of_verse}
[C]Someone told me long ago
[C]There's a calm before the storm
[G]I know, it's been comin' for some [C]time
[C]When it's over, so they say
[C]It'll rain a sunny day
[G]I know, shinin' down like [C]water
{end_of_verse}

{start_of_chorus}
[F]I want to [G]know, have you [C]ever [Em/B]seen the [Am]rain? [Am/G]
[F]I want to [G]know, have you [C]ever [Em/B]seen the [Am]rain? [Am/G]
[F]Comin' [G]down on a sunny [C]day
{end_of_chorus}`
    },

    // COUNTRY & FOLK
    {
        id: 'dolly-jolene',
        title: 'Jolene',
        artist: 'Dolly Parton',
        tags: ['Country', '70s'],
        key: 'C#m',
        capo: 4,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Jolene}
{artist: Dolly Parton}
{key: Am}
{capo: 4}

{start_of_chorus}
Jo[Am]lene, Jo[C]lene, Jo[G]lene, Jo[Am]lene
I'm [G]begging of you [Em7]please don't take my [Am]man
Jo[Am]lene, Jo[C]lene, Jo[G]lene, Jo[Am]lene
[G]Please don't take him [Em7]just because you [Am]can
{end_of_chorus}`
    },
    {
        id: 'denver-country-roads',
        title: 'Take Me Home, Country Roads',
        artist: 'John Denver',
        tags: ['Rock', '90s'],
        key: 'G',
        capo: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Take Me Home, Country Roads}
{artist: John Denver}

{start_of_verse}
[G]Almost heaven, [Em]West Virginia
[D]Blue Ridge Mountains, [C]Shenandoah [G]River
[G]Life is old there, [Em]older than the trees
[D]Younger than the mountains, [C]growin' like a [G]breeze
{end_of_verse}

{start_of_chorus}
Country [G]roads, take me [D]home
To the [Em]place I be[C]long
West Vir[G]ginia, mountain [D]mama
Take me [C]home, country [G]roads
{end_of_chorus}`
    },
    {
        id: 'neil-young-heart-of-gold',
        title: 'Heart of Gold',
        artist: 'Neil Young',
        tags: ['Folk', '70s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Heart of Gold}
{artist: Neil Young}

{start_of_verse}
[Em]I want to [C]live, [D]I want to [G]give
[Em]I've been a [C]miner for a [D]heart of [G]gold
[Em]It's these [C]expressions [D]I never [G]give
{end_of_verse}

{start_of_chorus}
[Em]That keep me searching for a [G]heart of gold
[C]And I'm getting old [G]
[Em]Keep me searching for a [G]heart of gold
[C]And I'm getting old [G]
{end_of_chorus}`
    },
    {
        id: 'cat-stevens-wild-world',
        title: 'Wild World',
        artist: 'Cat Stevens',
        tags: ['Folk', '70s'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Wild World}
{artist: Cat Stevens}

{start_of_verse}
[Am]Now that I've [D7]lost everything to [G]you
You say you [Cmaj7]wanna start something [F]new
And it's [Dm]breakin' my heart you're [E]leavin'
Baby, I'm [E7]grievin'
{end_of_verse}

{start_of_chorus}
[Am]Oh, baby, baby, it's a [D7]wild world
[G]It's hard to get by just upon a [Cmaj7]smile...
{end_of_chorus}`
    },
    {
        id: 'fleetwood-landslide',
        title: 'Landslide',
        artist: 'Fleetwood Mac',
        tags: ['Rock', '70s'],
        key: 'Eb',
        capo: 3,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Landslide}
{artist: Fleetwood Mac}
{capo: 3}
{key: C}

{start_of_verse}
[C]I took my [G/B]love, I took it [Am7]down [G/B]
[C]Climbed a [G/B]mountain and I [Am7]turned around [G/B]
[C]And I [G/B]saw my re[Am7]flection in the [G/B]snow covered [C]hills
'Til the [G/B]landslide [Am7]brought me [G/B]down
{end_of_verse}`
    },

    // POP / SOUL CLASSICS
    {
        id: 'ben-e-king-stand-by-me',
        title: 'Stand By Me',
        artist: 'Ben E. King',
        tags: ['Soul', '60s'],
        key: 'A',
        capo: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Stand By Me}
{artist: Ben E. King}
{capo: 2}
{key: G}

{start_of_verse}
When the [G]night has come
[Em]And the land is dark
And the [C]moon is the [D]only light we'll [G]see
[G]No I won't be afraid, no I [Em]won't be afraid
Just as [C]long as you [D]stand, stand by [G]me
{end_of_verse}`
    },
    {
        id: 'elvis-cant-help-falling',
        title: "Can't Help Falling in Love",
        artist: 'Elvis Presley',
        tags: ['Pop', '60s'],
        key: 'D',
        capo: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Can't Help Falling in Love}
{artist: Elvis Presley}
{capo: 2}
{key: C}

{start_of_verse}
[C]Wise [Em]men [Am]say
Only [F]fools [C]rush [G]in
But [F]I [G]can't [Am]help [F]falling in [C]love [G]with [C]you
{end_of_verse}`
    },
    {
        id: 'marley-three-little-birds',
        title: 'Three Little Birds',
        artist: 'Bob Marley',
        tags: ['Reggae', '70s'],
        key: 'A',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Three Little Birds}
{artist: Bob Marley}

{start_of_chorus}
Don't [A]worry about a thing
'Cause [D]every little thing gonna be all [A]right
Singin' don't [A]worry about a thing
'Cause [D]every little thing gonna be all [A]right
{end_of_chorus}`
    },
    {
        id: 'chapman-fast-car',
        title: 'Fast Car',
        artist: 'Tracy Chapman',
        tags: ['Rock', '70s'],
        key: 'A',
        capo: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Fast Car}
{artist: Tracy Chapman}
{capo: 2}
{key: G}

{start_of_verse}
[Cmaj7]You got a fast [G]car
[Em]I want a ticket to [D]anywhere
[Cmaj7]Maybe we make a [G]deal
[Em]Maybe together we can [D]get somewhere
{end_of_verse}`
    },
    {
        id: 'u2-with-or-without-you',
        title: 'With or Without You',
        artist: 'U2',
        tags: ['Rock', '80s'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: With or Without You}
{artist: U2}

{start_of_verse}
[D]See the stone set in your eyes
[A]See the thorn twist in your side
[Bm]I wait for [G]you
[D]Sleight of hand and twist of fate
[A]On a bed of nails she makes me wait
[Bm]And I wait, with[G]out you
{end_of_verse}

{start_of_chorus}
With or with[D]out you
With or with[A]out you
[Bm]I can't [G]live
With or with[D]out you
{end_of_chorus}`
    },
    {
        id: 'rem-losing-my-religion',
        title: 'Losing My Religion',
        artist: 'R.E.M.',
        tags: ['Rock', '90s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Losing My Religion}
{artist: R.E.M.}

{start_of_verse}
[G]Oh [Am]life is bigger
[Em]It's bigger than you
And you are [Am]not me
The lengths that I will [Em]go to
The distance in your [Dm]eyes
[G]Oh no I've said too [Dm]much
[G]I set it up
{end_of_verse}`
    },
    {
        id: 'green-day-good-riddance',
        title: 'Good Riddance (Time of Your Life)',
        artist: 'Green Day',
        tags: ['Rock', '90s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Good Riddance}
{artist: Green Day}

{start_of_verse}
[G]Another turning point, a [C]fork stuck in the [D]road
[G]Time grabs you by the wrist, di[C]rects you where to [D]go
[Em]So make the [D]best of this [C]test, and don't ask [G]why
[Em]It's not a [D]question, but a [C]lesson learned in [G]time
{end_of_verse}

{start_of_chorus}
[Em]It's something unp[G]redictable, but [Em]in the end is [G]right
[Em]I hope you [D]had the time of your [G]life
{end_of_chorus}`
    },
    {
        id: 'rhcp-under-the-bridge',
        title: 'Under the Bridge',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '90s'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Under the Bridge}
{artist: Red Hot Chili Peppers}
{key: E}

{start_of_verse}
[E]Sometimes [B]I feel like I [C#m]don't have a [G#m]partner
[E]Sometimes [B]I feel like [C#m]my only [A]friend
[E]Is the city [B]I live in, the [C#m]City of [G#m]Angels
[E]Lonely as [B]I am, to[C#m]gether we [A]cry
{end_of_verse}`
    },
    {
        id: 'jeff-buckley-hallelujah',
        title: 'Hallelujah',
        artist: 'Jeff Buckley',
        tags: ['Folk', '90s'],
        key: 'C',
        capo: 5,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: Hallelujah}
{artist: Jeff Buckley}
{capo: 5}
{key: G}

{start_of_verse}
I [G]heard there was a [Em]secret chord
That [G]David played and it [Em]pleased the Lord
But [C]you don't really [D]care for music, [G]do you? [D]
It [G]goes like this, the [C]fourth, the [D]fifth
The [Em]minor fall, the [C]major lift
The [D]baffled king com[B7]posing Halle[Em]lujah
{end_of_verse}`
    },
    {
        id: 'don-mclean-american-pie',
        title: 'American Pie',
        artist: 'Don McLean',
        tags: ['Rock', '70s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{title: American Pie}
{artist: Don McLean}

{start_of_verse}
A [G]long, [D]long time a[Em7]go
[Am]I can still re[C]member how that [Em]music used to make me [D]smile
And I [G]knew if I had [D]my [Em7]chance
That [Am]I could make those [C]people dance
And [Em]maybe they'd be [C]happy for a [D]while
{end_of_verse}

{start_of_chorus}
So [G]bye, [D]bye Miss A[Em]merican [C]Pie
Drove my [G]Chevy to the [C]levee but the [G]levee was [D]dry
And them [G]good ole [D]boys were drinking [Em]whiskey and [C]rye
Singin' [G]this'll be the [D]day that I [Em]die [C]
[Am]This'll be the [D]day that I [G]die
{end_of_chorus}`
    }
];
