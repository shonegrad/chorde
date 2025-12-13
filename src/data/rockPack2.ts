import type { Song } from '../types';

export const ROCK_PACK_2: Song[] = [
    // SOUNDGARDEN
    {
        id: 'sg-black-hole-sun',
        title: 'Black Hole Sun',
        artist: 'Soundgarden',
        tags: ['grunge', '90s', 'psychedelic'],
        key: 'G', // Actually Drop D usually, but G works for acoustic
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G6]In my eyes, [Bb]indisposed
[F]In disguises [Gm]no one knows
[Eb]Hides the face, [Bb]lies the snake
[D]The sun in my dis[D7]grace
[G6]Boiling heat, [Bb]summer stench
[F]'Neath the black the [Gm]sky looks dead
[Eb]Call my name [Bb]through the cream
And [D]I'll hear you [D7]scream again`
    },
    {
        id: 'sg-fell-on-black-days',
        title: 'Fell On Black Days',
        artist: 'Soundgarden',
        tags: ['grunge', '90s', 'dark'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]Whatsoever I've [B]feared has [Em]come to life
[Em]Whatsoever I've [B]fought off be[Em]came my life
[Em]Just when everyday [B]seemed to greet [Em]me with a smile
[Em]Sunspots have faded and [B]now I'm doing [Em]time`
    },
    {
        id: 'sg-spoonman',
        title: 'Spoonman',
        artist: 'Soundgarden',
        tags: ['grunge', '90s', 'rock'],
        key: 'D', // Drop D
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]Feel the rhythm with your hands
[D](Steal the rhythm while you can)
[D]Spoonman
[D]Speak the rhythm on your own
[D](Speak the rhythm all alone)
[D]Spoonman`
    },
    {
        id: 'sg-burden-in-my-hand',
        title: 'Burden In My Hand',
        artist: 'Soundgarden',
        tags: ['grunge', '90s', 'alternative'],
        key: 'C', // Open C tuning usually
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Follow me into the desert
[Bb]As thirsty as you are
[F]Crack a smile and cut your mouth
[Ab]And drown in alco[Bb]hol`
    },
    {
        id: 'sg-outshined',
        title: 'Outshined',
        artist: 'Soundgarden',
        tags: ['grunge', '90s', 'heavy'],
        key: 'Dm', // Drop D
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]I got up feeling so down
[D]I got off being sold out
[D]I've kept the movie rolling
[D]But the story's getting old now`
    },

    // STONE TEMPLE PILOTS
    {
        id: 'stp-plush',
        title: 'Plush',
        artist: 'Stone Temple Pilots',
        tags: ['grunge', '90s', 'rock'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]And I [D]feel that [C]time's a [C/B]wasted [C/A]go
[G]So where [D]ya going to [C]tomorrow?
[G]And I [D]see that [C]these are [C/B]lies to [C/A]come
[G]So would [D]you even [C]care?`
    },
    {
        id: 'stp-interstate-love-song',
        title: 'Interstate Love Song',
        artist: 'Stone Temple Pilots',
        tags: ['grunge', '90s', 'road-trip'],
        key: 'E', // C#m / E
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C#m]Waiting [G#/C]on a [A]Sunday afternoon
[E]For what I [B]read between the [C#m]lines,
[G#/C]Your [A]lies.
[C#m]Feelin' [G#/C]like a [A]hand in rusted shame
[E]So do you [B]laugh or does it [C#m]cry?
[G#/C]Rep[A]ly?`
    },
    {
        id: 'stp-creep',
        title: 'Creep',
        artist: 'Stone Temple Pilots',
        tags: ['grunge', '90s', 'acoustic'],
        key: 'Em', // G / Em
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[C]Take [Em7]time with a [C]wounded [Em7]hand
[C]'Cause it [Em7]likes to [C]heal [Em7]
[C]Take [Em7]time with a [C]wounded [Em7]hand
[C]'Cause I [Em7]like to [D]steal
[D]I'm half the man I used to be`
    },
    {
        id: 'stp-vasoline',
        title: 'Vasoline',
        artist: 'Stone Temple Pilots',
        tags: ['grunge', '90s', 'rock'],
        key: 'A',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[A]One time a thing occurred to me
[A]What's real and what's for sale?
[A]Blew a kiss and tried to take it home
[A]It isn't you, isn't me, search for things that you can't see`
    },
    {
        id: 'stp-big-empty',
        title: 'Big Empty',
        artist: 'Stone Temple Pilots',
        tags: ['grunge', '90s', 'bluesy'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em7]Driving faster in my [C]car [Cmaj7]
[Em7]Falling farther from [C]what I am [Cmaj7]
[Em7]Smoke a cigarette and [C]lie some more [Cmaj7]
[Em7]These conversations kill [C] [Cmaj7]`
    },

    // FOO FIGHTERS
    {
        id: 'foo-everlong',
        title: 'Everlong',
        artist: 'Foo Fighters',
        tags: ['rock', '90s', 'classic'],
        key: 'D', // Drop D
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dmaj7]Hello
[Dmaj7]I've waited here for you
[Bmj7/D]Everlong
[Bmj7/D]Tonight
[G]I throw myself in[D]to
[A]And out of the [G]red, out of her [D]head she sang`
    },
    {
        id: 'foo-my-hero',
        title: 'My Hero',
        artist: 'Foo Fighters',
        tags: ['rock', '90s', 'anthem'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[E]Too ordinary to [C#m7]be
[E]too deep`
    },
    {
        id: 'foo-best-of-you',
        title: 'Best of You',
        artist: 'Foo Fighters',
        tags: ['rock', '00s', 'anthem'],
        key: 'C#m',
        capo: 4, // Am shapes
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]I've got another confession to [F]make
[C]I'm your [G]fool
[Am]Everyone's got their chains to [F]break
[C]Holdin' [G]you`
    },
    {
        id: 'foo-learn-to-fly',
        title: 'Learn to Fly',
        artist: 'Foo Fighters',
        tags: ['rock', '90s', 'pop-rock'],
        key: 'B',
        capo: 4, // G shapes
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Run and tell all of the [Am]angels
[Em]This could take all [C]night
[G]Think I need a devil to [Am]help me get things [Em]right [C]
[G]Hook me up a new revo[Am]lution
[Em]'Cause this one is a [C]lie`
    },
    {
        id: 'foo-times-like-these',
        title: 'Times Like These',
        artist: 'Foo Fighters',
        tags: ['rock', '00s', 'uplifting'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]I, I'm a one way [Am]motorway
I'm the one that [C]drives away, follows you back [Em]home [D]
[D]I, I'm a streetlight [Am]shining
I'm a wild light [C]blinding bright, burning off a[Em]lone [D]`
    },

    // GREEN DAY
    {
        id: 'gd-basket-case',
        title: 'Basket Case',
        artist: 'Green Day',
        tags: ['punk', '90s', 'rock'],
        key: 'Eb', // Usually Eb tuning, play in E
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[E]Do you have the [B]time
To [C#m]listen to me [G#m]whine
A[A]bout nothing and [E]everything
All at [B]once
[E]I am one of [B]those
Me[C#m]lodramatic [G#m]fools
Neu[A]rotic to the [E]bone
No doubt a[B]bout it`
    },
    {
        id: 'gd-good-riddance',
        title: 'Good Riddance (Time of Your Life)',
        artist: 'Green Day',
        tags: ['punk', '90s', 'acoustic'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Another turning point, a [C]fork stuck in the [D]road
[G]Time grabs you by the wrist, di[C]rects you where to [D]go
[Em]So make the [D]best of this [C]test, and don't ask [G]why
[Em]It's not a [D]question, but a [C]lesson learned in [G]time`
    },
    {
        id: 'gd-when-i-come-around',
        title: 'When I Come Around',
        artist: 'Green Day',
        tags: ['punk', '90s', 'rock'],
        key: 'Gb',
        capo: 2, // Play in E likely, or G shapes
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]I heard you [D]crying [Em]loud, [C]
[G]All the [D]way a[Em]cross the [C]town
[G]Cause you've been [D]searching [Em]for that [C]someone
[G]And it's [D]me out [Em]on the [C]prowl`
    },
    {
        id: 'gd-boulevard',
        title: 'Boulevard of Broken Dreams',
        artist: 'Green Day',
        tags: ['punk', '00s', 'ballad'],
        key: 'Fm',
        capo: 1, // Em shapes
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]I walk a [G]lonely road
The [D]only one that [A]I have ever [Em]known
Don't know [G]where it goes
[D]But it's home to [A]me and I walk a[Em]lone`
    },
    {
        id: 'gd-wake-me-up',
        title: 'Wake Me Up When September Ends',
        artist: 'Green Day',
        tags: ['punk', '00s', 'acoustic'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Summer has [G/F#]come and passed
[Em]The innocent can [C]never last
[G]Wake me up [D]when September [G]ends`
    },

    // WEEZER
    {
        id: 'weezer-say-it-aint-so',
        title: 'Say It Ain\'t So',
        artist: 'Weezer',
        tags: ['rock', '90s', 'alternative'],
        key: 'Eb', // Half step down
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Cm]Oh [G]yeah. [Ab]Alright [Eb]
[Cm]Someone's [G]Heine' [Ab]is crowdin' my [Eb]icebox
[Cm]Somebody's [G]cold [Ab]one is givin' me [Eb]chills
[Cm]Guess I'll just [G]close my [Ab]eyes [Eb]`
    },
    {
        id: 'weezer-island-in-the-sun',
        title: 'Island in the Sun',
        artist: 'Weezer',
        tags: ['rock', '00s', 'pop'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]Hip [Am]hip [D] [G]
[Em]Hip [Am]hip [D] [G]
[Em]When you're [Am]on a [D]holiday [G]
[Em]You can't [Am]find the [D]words to say [G]
[Em]All the [Am]things that [D]come to you [G]
[Em]And I [Am]wanna [D]feel it too [G]`
    },
    {
        id: 'weezer-buddy-holly',
        title: 'Buddy Holly',
        artist: 'Weezer',
        tags: ['rock', '90s', 'power-pop'],
        key: 'F#',
        capo: 2, // E shapes
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[A]What's with these [E]homies dissing my [F#m]girl?
[A]Why do they [E]gotta front? [F#m]
[A]What did we [E]ever do to these [F#m]guys
[A]That made them [E]so violent? [F#m]`
    },
    {
        id: 'weezer-undone',
        title: 'Undone - The Sweater Song',
        artist: 'Weezer',
        tags: ['rock', '90s', 'alternative'],
        key: 'F#', // Half step down G
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]I'm me, [C]me be
[D]Goddamn, [C]I am
[G]I can, [C]sing and
[D]Hear me, [C]know me`
    },

    // RADIOHEAD
    {
        id: 'radiohead-creep',
        title: 'Creep',
        artist: 'Radiohead',
        tags: ['rock', '90s', 'classic'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]When you were here be[B]fore
Couldn't look you in the [C]eye
You're just like an [Cm]angel
Your skin makes me cry`
    },
    {
        id: 'radiohead-karma-police',
        title: 'Karma Police',
        artist: 'Radiohead',
        tags: ['rock', '90s', 'alternative'],
        key: 'Am', // Starts Am D F G
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]Karma police, [D/F#]arrest this [Em]man
[G]He talks in [Am]maths
He buzzes like a [F]fridge
He's [Em]like a de[G]tuned ra[Am]dio`
    },
    {
        id: 'radiohead-high-and-dry',
        title: 'High and Dry',
        artist: 'Radiohead',
        tags: ['rock', '90s', 'acoustic'],
        key: 'E', // F#m11 A E
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F#m]Two jumps in a week
I bet you [A]think that's pretty clever
Don't you [E]boy?
[F#m]Flying on your motorcycle
[A]Watching all the ground beneath you [E]drop`
    },
    {
        id: 'radiohead-fake-plastic-trees',
        title: 'Fake Plastic Trees',
        artist: 'Radiohead',
        tags: ['rock', '90s', 'acoustic'],
        key: 'A',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[A]Her green [F#m]plastic watering [D]can
For her [A]fake chi[F#m]nese rubber [D]plant
In the [A]fake [F#m]plas[D]tic earth`
    },
    {
        id: 'radiohead-no-surprises',
        title: 'No Surprises',
        artist: 'Radiohead',
        tags: ['rock', '90s', 'lullaby'],
        key: 'F', // Capo 1 E
        capo: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]A heart that's [F#m]full up like a [Em]landfill
A job that [A]slowly kills you
[D]Bruises that [F#m]won't heal [Em] [A]`
    },

    // OASIS (Requested 90s context usually implies britpop too)
    {
        id: 'oasis-wonderwall',
        title: 'Wonderwall',
        artist: 'Oasis',
        tags: ['rock', '90s', 'britpop'],
        key: 'F#m',
        capo: 2, // Em shapes
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em7]Today is [G]gonna be the day
That they're [D]gonna throw it back to [A7sus4]you
[Em7]By now you [G]should've somehow
Rea[D]lized what you gotta [A7sus4]do`
    },
    {
        id: 'oasis-dont-look-back',
        title: 'Don\'t Look Back in Anger',
        artist: 'Oasis',
        tags: ['rock', '90s', 'britpop'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Slip inside the [G]eye of your [Am]mind
Don't you [E]know you might [F]find
[G]A better place to [C]play [Am] [G]
[C]You said that [G]you'd never [Am]been
But all the [E]things that you've [F]seen
[G]Slowly fade a[C]way`
    },
    {
        id: 'oasis-champagne-supernova',
        title: 'Champagne Supernova',
        artist: 'Oasis',
        tags: ['rock', '90s', 'britpop'],
        key: 'A',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Asus2]How many special people change?
[Asus2/G]How many lives are living strange?
[Asus2/F#]Where were you while we were getting [Asus2/E]high?
[Asus2]Slowly walking down the hall
[Asus2/G]Faster than a cannonball
[Asus2/F#]Where were you while we were getting [Asus2/E]high?`
    },
    {
        id: 'oasis-live-forever',
        title: 'Live Forever',
        artist: 'Oasis',
        tags: ['rock', '90s', 'britpop'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Maybe [D]I don't really wanna [Am]know
How your garden [C]grows
'Cause I [D]just wanna [G]fly`
    },
    {
        id: 'oasis-supersonic',
        title: 'Supersonic',
        artist: 'Oasis',
        tags: ['rock', '90s', 'britpop'],
        key: 'F#m',
        capo: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F#m]I need to be myself
[A]I can't be no one else
[B]I'm feeling supersonic
[C#m]Give me gin and tonic`
    }
];
