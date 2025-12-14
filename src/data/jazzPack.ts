import type { Song } from '../types';

export const JAZZ_PACK: Song[] = [
    {
        id: 'jazz-fly-me-to-the-moon',
        title: 'Fly Me To The Moon',
        artist: 'Frank Sinatra',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'Am', // C major / Am
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am7]Fly me to the [Dm7]moon
And let me [G7]play among the [Cmaj7]stars [C7]
[Fmaj7]Let me see what [Bm7b5]spring is like
On [E7]Jupiter and [Am7]Mars [A7]
[Dm7]In other [G7]words, [Cmaj7]hold my [A7]hand
[Dm7]In other [G7]words, [Cmaj7]baby, [Bm7b5]kiss [E7]me`
    },
    {
        id: 'jazz-all-of-me',
        title: 'All of Me',
        artist: 'Jazz Standard',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Cmaj7]All of me
Why not take [E7]all of me
[A7]Can't you see
I'm no good with[Dm7]out you
[E7]Take my lips
I want to [Am7]lose them
[D7]Take my arms
I'll never [Dm7]use [G7]them`
    },
    {
        id: 'jazz-take-the-a-train',
        title: 'Take the "A" Train',
        artist: 'Duke Ellington',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Cmaj7]You must take the A Train
[D7b5]To go to Sugar Hill way up in Harlem
[Dm7]If you miss the A [G7]Train
[Cmaj7]You'll find you've missed the [C#dim7]quickest [Dm7]way to [G7]Harlem`
    },
    {
        id: 'jazz-blue-bossa',
        title: 'Blue Bossa',
        artist: 'Kenny Dorham',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'Cm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Cm7] | [Cm7] | [Fm7] | [Fm7] |
| [Dm7b5] | [G7alt] | [Cm7] | [Cm7] |
| [Ebm7] | [Ab7] | [Dbmaj7] | [Dbmaj7] |
| [Dm7b5] | [G7alt] | [Cm7] | [Dm7b5] [G7] |`
    },
    {
        id: 'jazz-girl-from-ipanema',
        title: 'The Girl From Ipanema',
        artist: 'Jobim',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Fmaj7]Tall and tan and young and lovely
The [G7]girl from Ipanema goes walking
And [Gm7]when she passes
[Gb7]Each one she passes goes [Fmaj7] "aaah"`
    },
    {
        id: 'jazz-satin-doll',
        title: 'Satin Doll',
        artist: 'Duke Ellington',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm7]Cigarette [G7]holder
[Dm7]Which wigs [G7]me
[Em7]Over her [A7]shoulder
[Em7]He digs [A7]me
[Am7]Out cattin' [D7]my satin [G7]doll`
    },
    {
        id: 'jazz-misty',
        title: 'Misty',
        artist: 'Erroll Garner',
        tags: ['Jazz', 'Standard', 'Ballad'],
        key: 'Eb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Ebmaj7]Look at me, [Bbm7]I'm as [Eb7]helpless as a [Abmaj7]kitten up a [Abm7]tree
And I [Ebmaj7]feel like I'm [Cm7]clingin' to a [Fm7]cloud
I [Bb7]can't under[Gm7]stand
I get [C7]misty, just [Fm7]holding your [Bb7]hand`
    },
    {
        id: 'jazz-georgia',
        title: 'Georgia on My Mind',
        artist: 'Ray Charles',
        tags: ['Jazz', 'Standard', 'Blues'],
        key: 'F', // G or F usually
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]Georgia, [A7]Georgia
[Dm7]The whole day [Gm7]through [Bdim7]
Just an [F]old sweet [D7]song
Keeps [G7]Georgia on my [C7]mind`
    },
    {
        id: 'jazz-someday-my-prince',
        title: 'Someday My Prince Will Come',
        artist: 'Jazz Waltz',
        tags: ['Jazz', 'Standard', 'Waltz'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Bbmaj7]Someday my [D7alt]prince will come
[Ebmaj7]Someday I'll [G7alt]find my love
[Cm7]And how [G7alt]thrilling that moment will [Cm7]be
When the [F7]prince of my dreams comes to [Bbmaj7]me`
    },
    {
        id: 'jazz-my-funny-valentine',
        title: 'My Funny Valentine',
        artist: 'Chet Baker',
        tags: ['Jazz', 'Standard', 'Ballad'],
        key: 'Cm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Cm]My funny [Cm7]valentine
[Cm6]Sweet comic [Abmaj7]valentine
[Fm7]You make me [Dm7b5]smile with my [G7]heart
[Cm]Your looks are [Cm7]laughable
[Cm6]Unphot[Abmaj7]ographable
[Fm7]Yet you're my [Fm6]favor[G7]ite work of [Cm]art`
    },
    {
        id: 'jazz-what-a-wonderful-world',
        title: 'What a Wonderful World',
        artist: 'Louis Armstrong',
        tags: ['Jazz', 'Standard'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]I see [Am]trees of [Bb]green, [Am]red roses [Gm7]too
[F]I see them [A7]bloom, for [Dm]me and [Db]you
And I [F]think to my[C7sus4]self
[C7]What a wonderful [F]world`
    },
    {
        id: 'jazz-mack-the-knife',
        title: 'Mack the Knife',
        artist: 'Bobby Darin',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'Bb', // Modulates often
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Bb6]Oh the shark has, [Cm7]pretty teeth dear
[F9]And he [F7]shows'em, [Bb6]pearly white
[Gm7]Just a jack-knife, [Cm7]has Macheath dear
[F9]And he [F7]keeps it, [Bb6]out of sight`
    },
    {
        id: 'jazz-dont-get-around-much',
        title: 'Don\'t Get Around Much Anymore',
        artist: 'Duke Ellington',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Missed the Saturday [D7]dance
[F]Heard they crowded the [C]floor [A7]
[D7]Couldn't bear it with[G7]out you
[C]Don't get around much any[C7]more`
    },
    {
        id: 'jazz-take-five',
        title: 'Take Five',
        artist: 'Dave Brubeck',
        tags: ['Jazz', 'Standard'],
        key: 'Ebm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
Vamp: | [Ebm7] [Bbm7] | [Ebm7] [Bbm7] |
[Ebm7]Won't you [Bbm7]stop and [Ebm7]take
A [Bbm7]little time [Ebm7]out with [Bbm7]me
Just [Ebm7]take [Bbm7]five
[Ebm7]Stop your [Bbm7]busy [Ebm7]day
And [Bbm7]take the time [Ebm7]out to [Bbm7]see
I'm [Ebm7]a[Bbm7]live`
    },
    {
        id: 'jazz-so-what',
        title: 'So What',
        artist: 'Miles Davis',
        tags: ['Jazz', 'Standard'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Dm7] | [Dm7] | [Dm7] | [Dm7] |
| [Dm7] | [Dm7] | [Dm7] | [Dm7] |
| [Ebm7] | [Ebm7] | [Ebm7] | [Ebm7] |
| [Dm7] | [Dm7] | [Dm7] | [Dm7] |`
    },
    {
        id: 'jazz-cantaloupe-island',
        title: 'Cantaloupe Island',
        artist: 'Herbie Hancock',
        tags: ['Jazz', 'Standard', 'Funk'],
        key: 'Fm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Fm7] | [Fm7] | [Fm7] | [Fm7] |
| [Db7] | [Db7] | [Db7] | [Db7] |
| [Dm7] | [Dm7] | [Dm7] | [Dm7] |
| [Fm7] | [Fm7] | [Fm7] | [Fm7] |`
    },
    {
        id: 'jazz-black-orpheus',
        title: 'Manha De Carnaval (Black Orpheus)',
        artist: 'Luiz Bonfa',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]I'll sing to the [Bm7b5]sun [E7]in the [Am]sky
[Dm7]I'll sing till the [G7]sun [Cmaj7]rises [Fmaj7]high
[Bm7b5]Carnival [E7]time is [Am]here
[Am]Magical [Bm7b5]time [E7]of [Am]year`
    },
    {
        id: 'jazz-dream-a-little-dream',
        title: 'Dream a Little Dream of Me',
        artist: 'Ella Fitzgerald',
        tags: ['Jazz', 'Standard', 'Ballad'],
        key: 'C', // often C or G
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Stars [B7]shining bright [Ab7]above [G7]you
[C]Night [B7]breezes seem to [A7]whisper "I love you"
[F]Birds singing in the [Fm]sycamore tree
[C]Dream a little [Ab7]dream [G7]of [C]me [G7]`
    },
    {
        id: 'jazz-blue-monk',
        title: 'Blue Monk',
        artist: 'Thelonious Monk',
        tags: ['Jazz', 'Standard', 'Blues'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Bb7] | [Eb7] | [Bb7] | [Bb7] |
| [Eb7] | [Edim7] | [Bb7] | [D7alt] [G7alt] |
| [Cm7] | [F7] | [Bb7] | [F7alt] |`
    },
    {
        id: 'jazz-straight-no-chaser',
        title: 'Straight, No Chaser',
        artist: 'Thelonious Monk',
        tags: ['Jazz', 'Standard', 'Blues'],
        key: 'Bb', // Actually F or Bb usually
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Bb7] | [Eb7] | [Bb7] | [Bb7] |
| [Eb7] | [Eb7] | [Bb7] | [Dm7] [G7] |
| [Cm7] | [F7] | [Bb7] | [F7] |`
    },
    {
        id: 'jazz-tenor-madness',
        title: 'Tenor Madness',
        artist: 'Sonny Rollins',
        tags: ['Jazz', 'Standard', 'Blues'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Bb7] | [Eb7] | [Bb7] | [Bb7] |
| [Eb7] | [Edim7] | [Bb7] | [D7] [G7] |
| [Cm7] | [F7] | [Bb7] | [F7] |`
    },
    {
        id: 'jazz-doxy',
        title: 'Doxy',
        artist: 'Sonny Rollins',
        tags: ['Jazz', 'Standard', 'Bebop'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Bb7] [Ab7] | [G7] | [C7] | [F7] |
| [Bb7] [Ab7] | [G7] | [C7] [F7] | [Bb7] |`
    },
    {
        id: 'jazz-st-thomas',
        title: 'St. Thomas',
        artist: 'Sonny Rollins',
        tags: ['Jazz', 'Standard', 'Latin'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [C] | [Am7] | [Dm7] | [G7] |
| [C] | [Am7] | [Dm7] | [G7] |
| [Em7] | [A7] | [Dm7] | [G7] |
| [C] [C/Bb] | [F/A] [Fm/Ab] | [C/G] [G7] | [C] |`
    },
    {
        id: 'jazz-giant-steps',
        title: 'Giant Steps',
        artist: 'John Coltrane',
        tags: ['Jazz', 'Standard'],
        key: 'B', // Coltrane changes
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Bmaj7] [D7] | [Gmaj7] [Bb7] | [Ebmaj7] | [Am7] [D7] |
| [Gmaj7] [Bb7] | [Ebmaj7] [F#7] | [Bmaj7] | [Fm7] [Bb7] |
| [Ebmaj7] | [Am7] [D7] | [Gmaj7] | [C#m7] [F#7] |
| [Bmaj7] | [Fm7] [Bb7] | [Ebmaj7] | [C#m7] [F#7] |`
    },
    {
        id: 'jazz-blues-for-alice',
        title: 'Blues for Alice',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Standard', 'Blues'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Fmaj7] | [Em7b5] [A7] | [Dm7] [G7] | [Cm7] [F7] |
| [Bb7] | [Bbm7] [Eb7] | [Am7] [D7] | [Abm7] [Db7] |
| [Gm7] | [C7] | [Fmaj7] [D7] | [Gm7] [C7] |`
    },
    {
        id: 'jazz-scrapple-from-the-apple',
        title: 'Scrapple From The Apple',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Standard'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Gm7]Honey [C7]suckle [Gm7]Rose [C7]changes
With [Fmaj7]Rhythm [Bb7]Bridge [Fmaj7]chords`
    },
    {
        id: 'jazz-ornithology',
        title: 'Ornithology',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Standard'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
Based on [G]How [Gmaj7]High [Gm7]The [C7]Moon`
    },
    {
        id: 'jazz-body-and-soul',
        title: 'Body and Soul',
        artist: 'Coleman Hawkins',
        tags: ['Jazz', 'Standard', 'Ballad'],
        key: 'Db',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Ebm7]My heart is [Bb7]sad and [Ebm7]lonely [Ab7]
[Dbmaj7]For you I [Gb7]sigh, for [Fm7]you dear [Edim7]only
[Ebm7]Why haven't [Ebm7/Ab]you [Ddim7]seen [Dbmaj7]it
[Cm7b5]I'm all for [F7alt]you [Bbm7]body and [Eb9]soul`
    },
    {
        id: 'jazz-cheek-to-cheek',
        title: 'Cheek to Cheek',
        artist: 'Irving Berlin',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Heaven, [Cmaj7]I'm in [Dm7]heaven [G7]
And my [C]heart beats [Cmaj7]so that [Dm7]I can hardly [G7]speak
And I [C]seem to [E7]find the [Am]happiness I [D7]seek
[Dm7]When we're out [G7]together dancing [C]cheek to [C#dim]cheek [Dm7] [G7]`
    },
    {
        id: 'jazz-moon-river',
        title: 'Moon River',
        artist: 'Henry Mancini',
        tags: ['Jazz', 'Standard', 'Waltz'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Moon [Am]river, [F]wider than a [C]mile
I'm [F]crossing you in [C]style some[Dm]day [E7]
Oh, [Am]dream [C7/G]maker, you [F]heart [Fm]breaker
Where[Am]ver you're [D7]goin', I'm [Dm7]goin' your [G7]way`
    },
    {
        id: 'jazz-bye-bye-blackbird',
        title: 'Bye Bye Blackbird',
        artist: 'Ray Henderson',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]Pack up all my [Gm7]care and [F]woe
[Gm7]Here I go, [C7]singing low
[F]Bye [Db7]Bye [F]Black[D7]bird`
    },
    {
        id: 'jazz-sweet-georgia-brown',
        title: 'Sweet Georgia Brown',
        artist: 'Jazz Standard',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'F', // actually Cycle of 5ths: D7 G7 C7 F
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D7]No gal made has got a shade on [D7]Sweet Georgia Brown
[G7]Two left feet, but oh, so neat has [G7]Sweet Georgia Brown
[C7]They all sigh and wanna die for [C7]Sweet Georgia Brown
[F]I'll tell you just [D7]why, [G7]you know I don't [C7]lie (not [F]much)`
    },
    {
        id: 'jazz-on-the-sunny-side',
        title: 'On the Sunny Side of the Street',
        artist: 'Jimmy McHugh',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Cmaj7]Grab your [E7]coat and [Fmaj7]get your [G7]hat
[Cmaj7]Leave your [E7]worry [Fmaj7]on the [G7]doorstep
[Am7]Just direct your [D7]feet
[Dm7]To the [G7]sunny side of the [C]street [G7]`
    },
    {
        id: 'jazz-my-favorite-things',
        title: 'My Favorite Things',
        artist: 'John Coltrane / Sound of Music',
        tags: ['Jazz', 'Standard', 'Waltz'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em7]Raindrops on roses and [Cmaj7]whiskers on kittens
[Em7]Bright copper kettles and [Cmaj7]warm woolen mittens
[Am7]Brown paper [D7]packages [Gmaj7]tied up with [Cmaj7]strings
[F#m7b5]These are a [B7]few of my [Em]favorite [Em]things`
    },
    {
        id: 'jazz-take-the-coltrane',
        title: 'Take The Coltrane',
        artist: 'Duke Ellington',
        tags: ['Jazz', 'Standard', 'Blues'],
        key: 'F', // F blues
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [F7] | [Bb7] | [F7] | [F7] |
| [Bb7] | [Bb7] | [F7] | [D7] |
| [Gm7] | [C7] | [F7] | [C7] |`
    },
    {
        id: 'jazz-in-a-sentimental-mood',
        title: 'In a Sentimental Mood',
        artist: 'Duke Ellington',
        tags: ['Jazz', 'Standard', 'Ballad'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm]In a [A7]senti[Dm]mental [Dm7]mood
I can [Gm7]see the [C7]stars come [Fmaj7]through my [A7]room
While [Dm]your [A7]loving [Dm]atti[Dm7]tude
Is [Gm7]like a [C7]flame that [Fmaj7]lights the [A7]gloom`
    },
    {
        id: 'jazz-cry-me-a-river',
        title: 'Cry Me a River',
        artist: 'Julie London',
        tags: ['Jazz', 'Standard', 'Ballad'],
        key: 'Cm', // or Em
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Cm]Now you [CmMaj7]say you're [Cm7]lonely [Cm6]
[Abmaj7]You cried the [G7]long night [Cm]through
[Fm7]Well, you can [Bb7]cry me a [Ebmaj7]river [Abmaj7]
[D7]Cry me a [G7]river
I [Cm]cried a [Am7b5]river [D7]over [Gm7]you [G7]`
    },
    {
        id: 'jazz-nature-boy',
        title: 'Nature Boy',
        artist: 'Nat King Cole',
        tags: ['Jazz', 'Standard'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm]There was a [Em7b5]boy [A7]
A very [Dm]strange enchanted [Dm7]boy
[Gm7]They say he [C7]wandered very [Fmaj7]far
[Em7b5]Very [A7]far, over [Dm]land and [D7]sea`
    },
    {
        id: 'jazz-black-coffee',
        title: 'Black Coffee',
        artist: 'Peggy Lee',
        tags: ['Jazz', 'Standard', 'Blues'],
        key: 'C', // Bluesy C, often G
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C7]I'm feeling mighty lonesome
[C7]Haven't slept a wink
[F7]I walk the floor and watch the door
And [C7]in between I drink
[G7]Black coffee`
    },
    {
        id: 'jazz-fever',
        title: 'Fever',
        artist: 'Peggy Lee',
        tags: ['Jazz', 'Standard', 'Blues'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]Never know how much I love you
[Am]Never know how much I care
[Am]When you put your arms around me
[Am]I get a fever that's so hard to bear
[Am]You give me [F]fever [E7]
When you kiss [Am]me`
    },
    {
        id: 'jazz-swing-low',
        title: 'Swing Low, Sweet Chariot',
        artist: 'Traditional',
        tags: ['Jazz', 'Spiritual', 'Swing'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[F]Swing low, sweet [Bb]chari[F]ot
Comin' for to carry me [C7]home
[F]Swing low, sweet [Bb]chari[F]ot
Comin' for to [C7]carry me [F]home`
    },
    {
        id: 'jazz-when-the-saints',
        title: 'When The Saints Go Marching In',
        artist: 'Traditional',
        tags: ['Jazz', 'Traditional', 'Spiritual'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
Oh when the [F]saints, go marching in
Oh when the [F]saints go marching [C7]in
[F]Oh Lord I [F7]want to [Bb]be in that [Bdim]number
When the [F]saints go [C7]marching [F]in`
    },
    {
        id: 'jazz-st-james-infirmary',
        title: 'St. James Infirmary Blues',
        artist: 'Traditional',
        tags: ['Jazz', 'Blues', 'Traditional'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm]I went down to [A7]St. James In[Dm]firary
[Dm]Saw my [Gm]baby [A7]there
[Dm]She was stretched out [A7]on a long [Dm]white table
[Bb7]So sweet, [A7]so cold, [Dm]so fair`
    },
    {
        id: 'jazz-careless-love',
        title: 'Careless Love',
        artist: 'Traditional',
        tags: ['Jazz', 'Blues', 'Traditional'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]Love, oh [C7]love, oh [F]careless love
[F]Love, oh [C7]love, oh [F]careless love
[F]Love, oh [F7]love, oh [Bb]careless [Bdim]love
Oh [F]you can [C7]see what [F]love has done to me`
    },
    {
        id: 'jazz-frankie-and-johnny',
        title: 'Frankie and Johnny',
        artist: 'Traditional',
        tags: ['Jazz', 'Blues', 'Traditional'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[C]Frankie and Johnny were lovers
[C]Oh Lordy how they could love
[F]Swore to be true to each other
[F]Just as true as the stars a[C]bove
[G7]He was her man, [F7]but he done her [C]wrong`
    },
    {
        id: 'jazz-sweet-lorraine',
        title: 'Sweet Lorraine',
        artist: 'Nat King Cole',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Just found [E7]joy
[Am7]I'm as happy as a [D7]baby boy
[G]With another brand [E7]new choo-choo [A7]toy [D7]
[G]When I met my [Am7]sweet [D7]Lor[G]raine`
    },
    {
        id: 'jazz-it-dont-mean-a-thing',
        title: 'It Don\'t Mean a Thing (If It Ain\'t Got That Swing)',
        artist: 'Duke Ellington',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'Gm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[Gm]It don't mean a thing, if it ain't got that swing
(Doo - ah, doo - ah, doo - ah, doo - ah, doo - ah, doo - ah, doo - ah, doo - ah)
[Gm]It don't mean a thing, all you got to do is sing
(Doo - ah, doo - ah, doo - ah, doo - ah, doo - ah, doo - ah, doo - ah, doo - ah)`
    },
    {
        id: 'jazz-minor-swing',
        title: 'Minor Swing',
        artist: 'Django Reinhardt',
        tags: ['Jazz', 'Gypsy'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
| [Am6] | [Am6] | [Dm6] | [Dm6] |
| [E7] | [E7] | [Am6] | [Am6] |
| [Dm6] | [Dm6] | [Am6] | [Am6] |
| [Bb7] | [E7] | [Am6] | [E7] |`
    },
    {
        id: 'jazz-stella-by-starlight',
        title: 'Stella by Starlight',
        artist: 'Victor Young',
        tags: ['Jazz', 'Standard'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em7b5]The song [A7]a robin [Cm7]sings [F7]
[Fm7]Through years [Bb7]of endless [Ebmaj7]springs [Ab7]
[Bbmaj7]The murmur [Em7b5]of a [A7]brook at [Dm7]even[Bb7]tide
[Ebmaj7]That ripples [Ab7]by a [Bb]nook [Em7]where [A7]two lovers [Dm7]hide [F7]

[Em7b5]That great [A7]symphonic [Cm7]theme [F7]
[Fm7]That's Stella [Bb7]by star[Ebmaj7]light [Ab7]
[Bbmaj7]And not a [Em7b5]dream [A7]
[Dm7]My [Bb7]heart and [Ebmaj7]I agree
[Ebmaj7]She's [Em7b5]every[A7]thing on [Dm7]earth [Bdim7]to [Bbmaj7]me`
    },
    {
        id: 'jazz-there-will-never-be',
        title: 'There Will Never Be Another You',
        artist: 'Harry Warren',
        tags: ['Jazz', 'Standard'],
        key: 'Eb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Ebmaj7]There will be many[D7alt]other nights like this
    [Gm7]And I'll be standing [C7]here with someone [Fm7]new
    [Bb7]There will be other songs to[Ebmaj7]sing, another[Ab7]fall, another[G7]spring
    [C7]But there will[F7]never be a[Fm7]nother[Bb7]you

    [Ebmaj7]There will be other[D7alt]lips that I may kiss
    [Gm7]But they won't thrill me [C7]like yours used to [Fm7]do [Abm7] [Db7]
    [Ebmaj7]Yes, I may[Gm7]dream a[C7]million[Fm7]dreams
But[Abm7]how can[Db7]they come[Ebmaj7]true
If there will[Fm7]never[Bb7]be a[Ebmaj7]nother you`
    },
    {
        id: 'jazz-have-you-met-miss-jones',
        title: 'Have You Met Miss Jones?',
        artist: 'Rodgers & Hart',
        tags: ['Jazz', 'Standard', 'Swing'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Fmaj7]Have you [D7]met Miss [Gm7]Jones? [C7]
[Am7]Someone [Dm7]said as we [Gm7]shook [C7]hands
[Am7]She was [Dm7]just Miss [Gm7]Jones [C7]to [Fmaj7]me [E7]

[Am7]Then I [D7]said Miss [Gm7]Jones [C7]
[Am7]You're a [Dm7]girl who [Gm7]under[C7]stands
[Am7]I'm a [Abm7]man who [Gm7]must [C7]be [Fmaj7]free

[Cm7]And [F7]all at [Bbmaj7]once I lost my [Gm7]breath
And [Cm7]all at [F7]once was [Bbmaj7]scared to [Dm7]death
And [G7]all at [Cmaj7]once I [Am7]owned the [Dm7]earth and [G7]sky

[Am7]Now I've [D7]met Miss [Gm7]Jones [C7]
[Am7]And we'll [Dm7]keep on [Gm7]meeting [C7]till we [Fmaj7]die`
    },
    {
        id: 'jazz-green-dolphin-street',
        title: 'On Green Dolphin Street',
        artist: 'Bronislau Kaper',
        tags: ['Jazz', 'Standard'],
        key: 'Eb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Ebmaj7]On Green [Ebmaj7]Dolphin Street
[Gbmaj7]The world [Gbmaj7]is filled with love
[Fmaj7]For near [Fmaj7]or far apart
[Emaj7]I keep [Emaj7]you in my heart

[Ebmaj7]And when [Cm7]I recall
[Fm7]The love [Bb7]we found on
[Ebmaj7]I could [Cm7]kiss the ground on
[Fm7]Green [Bb7]Dolphin [Ebmaj7]Street`
    },
    {
        id: 'jazz-softly-morning-sunrise',
        title: 'Softly, as in a Morning Sunrise',
        artist: 'Romberg/Hammerstein',
        tags: ['Jazz', 'Standard'],
        key: 'Cm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Cm]Softly, [Am7b5] as in a[D7]morning[Gm]sunrise[G7]
    [Cm]The light of[Am7b5]love comes[D7]stealing
    [Gmaj7]Into a[Am7]newborn[D7]day

    [Cm]Oh, softly, [Am7b5]brings in a[D7]morning[Gm]sunrise[G7]
    [Cm]A golden[Am7b5]glow is[D7]waking
    [Gmaj7]Into a[Am7]newborn[D7]day

    [Cm7]And for the[F7]glow may[Bbmaj7]fade
    [Cm7]Within the[F7]noon day[Bbmaj7]sun
    [Am7]And unto[D7]evening[Gmaj7]shade[Am7]
    [A7]Will wither[D7]when the day is done

    [Cm]Softly, [Am7b5] as in a[D7]morning[Gm]sunrise[G7]
    [Cm]The light of[Am7b5]love comes[D7]stealing
    [Gmaj7]Into a[Am7]newborn[D7]day`
    },
    {
        id: 'jazz-just-friends',
        title: 'Just Friends',
        artist: 'John Klenner',
        tags: ['Jazz', 'Standard'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Cmaj7]Just friends, [Cm7]lovers no[F7]more
    [Gmaj7]Just friends, [Bbm7]but not like be[Eb7]fore
    [Am7]To think of what we've [D7]been, and [Bm7]not to kiss a[E7]gain
    [Am7]Seems like pretending, [D7]it isn't the ending

    [Cmaj7]Two friends, [Cm7]drifting a[F7]part
    [Gmaj7]Two friends, [Bbm7]but one broken[Eb7]heart
    [Am7]We loved, we laughed, we[D7]cried
    [Bm7]And suddenly love[E7]died
    [Am7]The story ends, [D7]and we're just [Gmaj7]friends`
    },
    {
        id: 'jazz-alone-together',
        title: 'Alone Together',
        artist: 'Arthur Schwartz',
        tags: ['Jazz', 'Standard'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em7b5]Alone [A7]together, [Dm6]beyond the crowd
[Em7b5]Above [A7]the world, [Dm6]we're not too proud
[Bm7b5]To cling [E7]together, [Am6]we're strong
[Em7b5]As long [A7]as we're [Dm6]together

[Em7b5]Alone [A7]together, [Dm6]the blinding rain
[Em7b5]The star [A7]scattered night, [Dm6]were made for vain
[Bm7b5]For us [E7]together, [Am6]I pray
[Em7b5]For us [A7]together, [Dm6]to stay

[Am7]But our [D7]love is as [Gm7]deep as the [C7]sea
[Gm7]Our love is as [C7]great as a [Fmaj7]love can be
[Em7b5]And we can [A7]weather the [Dm]great un[Dm/C]known
[Bm7b5]If we're a[E7]lone to[Am6]gether`
    },
    {
        id: 'jazz-night-and-day',
        title: 'Night and Day',
        artist: 'Cole Porter',
        tags: ['Jazz', 'Standard'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Abmaj7]Night and day, [G7]you are the[Cmaj7]one
    [Abmaj7]Only you beneath the[G7]moon and under the[Cmaj7]sun
    [Fm7]Whether near to me or[Bb7]far, no matter[Cmaj7]where you are
    [D7]I think of you[G7]night and[C]day

    [Abmaj7]Day and night, [G7]why is it[Cmaj7]so
    [Abmaj7]That this longing for you[G7]follows wherever I[Cmaj7]go
    [Fm7]In the roaring traffic's [Bb7]boom, in the silence [Cmaj7]of my lonely room
    [D7]I think of you[G7]night and[C]day

    [Ebmaj7]Night and day, [G7]under the[Cmaj7]hide of me
    [Ebmaj7]There's an oh such a hungry [G7]yearning burning in[Cmaj7]side of me
    [Fm7]And its torment won't be [Bb7]through
    [Fm7]Until you let me spend my [Bb7]life making love to [Em7]you [A7] [Dm7] [G7]
Day and[C]night, night and day`
    },
    {
        id: 'jazz-how-high-the-moon',
        title: 'How High the Moon',
        artist: 'Morgan Lewis',
        tags: ['Jazz', 'Standard'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Gmaj7]Somewhere there's music, [Gmaj7]how faint the tune
[Gm7]Somewhere there's heaven, [C7]how high the [Fmaj7]moon
[Fm7]There is no [Bb7]moon above, [Ebmaj7]when love is far away too
[Am7b5]Til it comes [D7]true, [Gmaj7]that you love me as I love you

[Gmaj7]Somewhere there's music, [Gmaj7]it's where you are
[Gm7]Somewhere there's heaven, [C7]how near, how [Fmaj7]far
[Fm7]The darkest [Bb7]night would shine, [Ebmaj7]if you would come to me soon
[Am7b5]Until you [D7]will, how still [Bm7]my [E7]heart, [Am7]how high [D7]the [Gmaj7]moon`
    },
    {
        id: 'jazz-i-fall-in-love',
        title: 'I Fall in Love Too Easily',
        artist: 'Jule Styne',
        tags: ['Jazz', 'Standard', 'Ballad'],
        key: 'Eb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Fm7]I fall in [Bb7]love too[Ebmaj7]easily
    [Fm7]I fall in [Bb7]love too[Ebmaj7]fast
    [Fm7]I fall in [Bb7]love too[Ebmaj7]terribly[Ab7]hard
    [Gm7]For love to[C7]ever[Fm7]last[Bb7]

    [Fm7]My heart should[Bb7]be well - [Ebmaj7]schooled
    'Cause I've been[Am7b5]fooled[D7] in the[Gm7]past
    [Abm7]But still[Db7]I fall in [Gm7]love so[C7]easily
    [Fm7]I fall in [Bb7]love too[Ebmaj7]fast`
    },
    {
        id: 'jazz-my-romance',
        title: 'My Romance',
        artist: 'Rodgers & Hart',
        tags: ['Jazz', 'Standard'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Bbmaj7]My romance[Cm7]doesn't have to [F7]have a [Bbmaj7]moon in the sky
    [Bbmaj7]My romance[Cm7]doesn't need a [F7]blue la[Bbmaj7]goon standing by
    [Gm7]No month of[C7]May, [Fmaj7]no twinkling[Bbmaj7]stars
    [Am7b5]No hide a[D7]way, [Gm7]no soft gui[C7]tars[F7]

    [Bbmaj7]My romance[Cm7]doesn't need a [F7]castle [Bbmaj7]rising in Spain
    [Bbmaj7]Nor a dance[Cm7]to a constantly[F7]surprising[Dm7b5]refrain[G7]
    [Cm7]Wide awake I can[C#dim7]make my most[Dm7]fantastic dreams come[G7]true
    [Cm7]My romance[F7]doesn't need a [Bb]thing but you`
    },
    {
        id: 'jazz-days-of-wine',
        title: 'Days of Wine and Roses',
        artist: 'Henry Mancini',
        tags: ['Jazz', 'Standard'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Fmaj7]The days of [Eb7]wine and [D7]roses
[Gm7]Laugh and run a[Bbm7]way [Eb7]like a [Am7]child at [D7]play
[Gm7]Through the meadow [C7]land towards a [Am7]closing [D7]door
[Gm7]A door marked never[C7]more

[Fmaj7]The lonely [Eb7]night dis[D7]closes
[Gm7]Just a passing [Bbm7]breeze [Eb7]filled with [Am7]memories [D7]
[Gm7]Of the golden [Bbm7]smile [Eb7]that intro[Am7]duced me [D7]to
[Gm7]The days of [C7]wine and [Fmaj7]roses and you`
    },
    {
        id: 'jazz-corcovado',
        title: 'Corcovado (Quiet Nights)',
        artist: 'Jobim',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Am6]Quiet nights of quiet stars
    [Abdim7]Quiet chords from my guitar
    [Gm7]Floating on the[C7]silence that sur[Fmaj7]rounds us

    [Fm7]Quiet thoughts and[Bb7]quiet dreams
    [Em7]Quiet walks by[A7]quiet streams
    [Am7]And a window[D7]looking on the[Dm7]mountains and the[G7]sea, how lovely

    [Am6]This is where I want to be
    [Abdim7]Here with you so close to me
    [Gm7]Until the[C7]final flicker[Fmaj7]of life's ember

    [Fm7]I who was[Bb7]lost and[Em7]lonely
    [Am7]Believing[Dm7]life was[G7]only
    [Em7]A bitter[Am7]tragic[Dm7]joke, have[G7]found with [C]you
    [Dm7]The meaning[G7]of ex[C]istence, oh my love`
    },
    {
        id: 'jazz-desafinado',
        title: 'Desafinado',
        artist: 'Jobim',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Fmaj7]Se você disser que eu desa[G7]fino amor
[Gm7]Saiba que isso em mim provoca [C7]imensa dor
[Am7b5]Só privilegia[D7]dos têm ou[Gm7]vido igual ao [C7]seu
[Fmaj7]Eu possuo apenas o que [G7]Deus me deu

[Fmaj7]Se você insiste em classi[G7]ficar
[Gm7]Meu comportamento de anti-[C7]musical
[Am7b5]Eu, mesmo men[D7]tindo devo [Gm7]argu[C7]mentar
[Fmaj7]Que isto é bossa nova, isto é [G7]muito natural

[Bbmaj7]O que você não sabe nem se[Bbm7]quer pressente
[Am7]É que os desafina[D7]dos também [Abm7]têm um cora[Db7]ção
[Gm7]Fotografei você na [C7]minha Rolleiflex
[Am7]Revelou-se a [D7]sua enorme in[G7]gratidão [C7]

[Fmaj7]Só não poderá falar as[G7]sim do meu amor
[Gm7]Ele é o maior [C7]que você [Am7b5]pode encon[D7]trar, viu?
[Gm7]Você com a sua [Bbm6]música es[Am7]queceu o princi[D7]pal
[Gm7]Que no peito dos [G7]desafinados
[Gm7]No fundo do peito [C7]bate calado
[Am7b5]Que no peito dos [D7]desafinados
[Gm7]Também bate [C7]um cora[Fmaj7]ção`
    },
    {
        id: 'jazz-wave',
        title: 'Wave',
        artist: 'Jobim',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Dmaj7]Vou te con[B7b13]tar
    Os[Emaj7]olhos já não podem[Bb7]ver
    [Am7]Coisas que[D7]só o co[Gmaj7]ração pode en[Gm6]tender
    [F#7]Fundamental é[B7b9]mesmo o amor
    [E7]É impos[Bb7]sível ser fe[A7]liz so[Dmaj7]zinho

    [Dmaj7]O resto é[B7b13]mar
    É[Emaj7]tudo que eu não sei[Bb7]contar
    [Am7]São coisas[D7]lindas que eu[Gmaj7]tenho pra te[Gm6]dar
    [F#7]Vem de man[B7b9]sinho à bri[E7]sa e me[A7]diz
    [Am7]É impos[D7]sível ser fe[Gmaj7]liz so[C7]zinho

    [F#m7]Da primeira[Fdim7]vez era a ci[Em7]dade[A7]
    [F#m7]Da segunda, o[Fdim7]cais e a eterni[Em7]dade[A7]
    [F#m7]Agora eu já[B7]sei
    [E7]Da onda que se ergueu no mar
    [E7]E das estrelas que esquecemos de contar

    [Dmaj7]O amor se[B7b13]deixa sur[Emaj7]preen[Bb7]der
    [Am7]Enquanto a[D7]noite vem nos[Gmaj7]envol[Gm6]ver
    [F#7]Doce ines[B7b9]perado o a[E7]mor
    [A7]É impos[Dmaj7]sível ser feliz sozinho`
    },
    {
        id: 'jazz-how-insensitive',
        title: 'How Insensitive',
        artist: 'Jobim',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm9]How insensitive [Dbdim7]I must have seemed
[Cm6]When she told me that [G7/B]she loved me
[Bbmaj7]How unmoved and [Ebmaj7]cold I must have been
[Em7b5]When she told me so [A7alt]sincerely

[Dm9]Why, she must have [Dbdim7]asked
[Cm6]Did I just turn and [G7/B]stare in icy silence?
[Bbmaj7]What was I to [Ebmaj7]say?
[Em7b5]What can you say [A7alt]when a love affair is [Dm]over?`
    },
    {
        id: 'jazz-meditation',
        title: 'Meditation',
        artist: 'Jobim',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [Cmaj7]In my loneliness
    [B7]When you're gone and I'm all by myself
    [Dm7]And I need your ca[G7]ress
    [Cmaj7]I just think of you

    [Cmaj7]And the thought of you
    [B7]Holding me, looking into my eyes
    [Dm7]Is all I need to[G7]sigh
    [Cmaj7]I just think of you

    [Gm7]Yes, I[C7]love you[Fmaj7]so
    [Fm7]And that for [Bb7]me is all I[Ebmaj7]need to know[G7]
    [Cmaj7]I will wait for you
    [B7]Till the sun falls from out of the sky
    [Dm7]For what else can I[G7]do
        [Cmaj7]I will wait for you`
    },
    {
        id: 'jazz-triste',
        title: 'Triste',
        artist: 'Jobim',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
        [Bbmaj7]Sad is to live in [Gbmaj7]solitude
        [B7]Far from your[Bbmaj7]tranquil altitude
        [Gm7]Sad is to know that[C7]no one ever can[Am7]live on a[D7]dream
        [Gm7]That never can[C7]be, will never[Cm7]be[F7]

        [Bbmaj7]Dreamer awake, [Gbmaj7]wake up and see
        [B7]Your beauty is[Bbmaj7]an aerie
        [Gm7]High above this[C7]lane where lonely[Am7]lovers walk[D7]by
        [Gm7]Sad as a[C7]sigh, sad as a[Bbmaj7]sigh`
    },
    {
        id: 'jazz-one-note-samba',
        title: 'One Note Samba',
        artist: 'Jobim',
        tags: ['Jazz', 'Bossa Nova'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm7]This is just a little samba [Db7]built upon a single note
[Cm7]Other notes are bound to follow [B7]but the root is still that note
[Bbmaj7]Now this new note is the consequence [Bbm6]of the one we've just been through
[Am7]As I'm bound to be the [D7]unavoidable conse[G7]quence of [C7]you

[Fm7]There's so many people [Bb7]who can talk and talk and talk
[Ebmaj7]And just say nothing, [Abmaj7]or nearly nothing
[Dm7]I have used up all the [G7]scale I know and at the end
[Cmaj7]I've come to nothing, [C#dim7]or nearly nothing

[Dm7]So I came back to my first note [Db7]as I must come back to you
[Cm7]I will pour into that one note [B7]all the love I feel for you
[Bbmaj7]Anyone who wants the [Bbm6]whole show, Re Mi Fa Sol La Ti Do
[Am7]He will find himself with [D7]no show, [G7]better play the note you [C7]know`
    },
    {
        id: 'jazz-solar',
        title: 'Solar',
        artist: 'Miles Davis',
        tags: ['Jazz', 'Standard'],
        key: 'Cm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Cm6] | [Cm6] | [Gm7] | [C7] |
| [Fmaj7] | [Fmaj7] | [Fm7] | [Bb7] |
| [Ebmaj7] | [Ebmaj7] | [Ebm7] | [Ab7] |
| [Dbmaj7] | [G7alt] | [Cm6] | [G7alt] | `
    },
    {
        id: 'jazz-four',
        title: 'Four',
        artist: 'Miles Davis',
        tags: ['Jazz', 'Bebop'],
        key: 'Eb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Ebmaj7] | [Ebm7][Ab7] | [Fm7] | [Edim7] |
| [Ebmaj7] | [A7] | [Abmaj7] | [Abm7][Db7] |
| [Ebmaj7] | [Gbdim7] | [Fm7] | [Bb7] |
| [Ebmaj7] | [Fm7][Bb7] | `
    },
    {
        id: 'jazz-tune-up',
        title: 'Tune Up',
        artist: 'Miles Davis',
        tags: ['Jazz', 'Bebop'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Em7] | [A7] | [Dmaj7] | [Dmaj7] |
| [Dm7] | [G7] | [Cmaj7] | [Cmaj7] |
| [Cm7] | [F7] | [Bbmaj7] | [Ebmaj7] |
| [Em7] | [A7] | [Dmaj7] | [Dmaj7] | `
    },
    {
        id: 'jazz-oleo',
        title: 'Oleo',
        artist: 'Sonny Rollins',
        tags: ['Jazz', 'Bebop'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
Rhythm Changes in Bb(A Section)
        | [Bb][Gm7] | [Cm7][F7] | [Bb][Gm7] | [Cm7][F7] |
| [Bb][Bb7] | [Eb][Edim] | [Bb][F7] | [Bb] | `
    },
    {
        id: 'jazz-anthropology',
        title: 'Anthropology',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Bebop'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
Rhythm Changes in Bb(A Section)
        | [Bb][G7] | [Cm7][F7] | [Bb][G7] | [Cm7][F7] |
| [Fm7][Bb7] | [Eb][Ebm] | [Bb][F7] | [Bb] | `
    },
    {
        id: 'jazz-donna-lee',
        title: 'Donna Lee',
        artist: 'Charlie Parker / Miles Davis',
        tags: ['Jazz', 'Bebop'],
        key: 'Ab',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Ab] | [F7] | [Bb7] | [Bb7] |
| [Eb7] | [Eb7] | [Ab] | [Eb7] |
| [Ab] | [F7] | [Bb7] | [Bb7] |
| [C7] | [C7] | [Fm] | [C7b9] | `
    },
    {
        id: 'jazz-confirmation',
        title: 'Confirmation',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Bebop'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Fmaj7] | [Em7b5][A7] | [Dm7] | [Cm7][F7] |
| [Bb7] | [Am7][D7] | [G7] | [Gm7][C7] |
| [Fmaj7] | [Em7b5][A7] | [Dm7] | [Cm7][F7] |
| [Bb7] | [Am7][D7] | [Gm7][C7] | [F] | `
    },
    {
        id: 'jazz-yardbird-suite',
        title: 'Yardbird Suite',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Bebop'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [C] | [Fm] | [C] | [Gm7][C7] |
| [F] | [Fm6] | [C][Bb7] | [A7] |
| [D7] | [D7] | [G7] | [G7] |
| [C] | [C] | [C] | [C] | `
    },
    {
        id: 'jazz-au-privave',
        title: 'Au Privave',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Blues', 'Bebop'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [F7] | [Gm7][Am7] | [Cm7][F7] | [Bb7] |
| [Bb7] | [Bdim] | [F][Am7] | [D7] |
| [Gm7] | [C7] | [F][D7] | [Gm7][C7] | `
    },
    {
        id: 'jazz-billies-bounce',
        title: 'Billie\'s Bounce',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Blues', 'Bebop'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [F7] | [Bb7] | [F7] | [Cm7][F7] |
| [Bb7] | [Bdim] | [F7] | [Am7][D7] |
| [Gm7] | [C7] | [F7][D7] | [Gm7][C7] | `
    },
    {
        id: 'jazz-nows-the-time',
        title: 'Now\'s the Time',
        artist: 'Charlie Parker',
        tags: ['Jazz', 'Blues', 'Bebop'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [F7] | [Bb7] | [F7] | [F7] |
| [Bb7] | [Bdim] | [F7] | [Am7][D7] |
| [Gm7] | [C7] | [F7] | [C7] | `
    },
    {
        id: 'jazz-night-in-tunisia',
        title: 'A Night in Tunisia',
        artist: 'Dizzy Gillespie',
        tags: ['Jazz', 'Bebop', 'Latin'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    A:
| [Eb7] | [Dm6] | [Eb7] | [Dm6] |
| [Eb7] | [Dm6] | [Em7b5] | [A7alt] |
        Interlude:
| [Em7b5] | [Eb7] | [Dm6] | [Dm6] | `
    },
    {
        id: 'jazz-joy-spring',
        title: 'Joy Spring',
        artist: 'Clifford Brown',
        tags: ['Jazz', 'Bebop'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
    [F] | [G7] | [Gm7][C7] | [F] |
        [Fm7][Bb7] | [Eb] | [Abm7][Db7] | [Gb] |
        [Am7][D7] | [G] | [Gm7][C7] | [F] | `
    },
    {
        id: 'jazz-stolen-moments',
        title: 'Stolen Moments',
        artist: 'Oliver Nelson',
        tags: ['Jazz', 'Minor Blues'],
        key: 'Cm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Cm7] | [Cm7] | [Cm7] | [Cm7] |
| [Fm7] | [Fm7] | [Cm7] | [Cm7] |
| [Dm7b5] | [G7alt] | [Cm7] | [Cm7] | `
    },
    {
        id: 'jazz-footprints',
        title: 'Footprints',
        artist: 'Wayne Shorter',
        tags: ['Jazz', 'Modal', 'Blues'],
        key: 'Cm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Cm11] | [Cm11] | [Cm11] | [Cm11] |
| [Fm11] | [Fm11] | [Cm11] | [Cm11] |
| [D7alt] | [Db7alt] | [Cm11] | [Cm11] | `
    },
    {
        id: 'jazz-maiden-voyage',
        title: 'Maiden Voyage',
        artist: 'Herbie Hancock',
        tags: ['Jazz', 'Modal'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [D9sus4] | [D9sus4] | [D9sus4] | [D9sus4] |
| [F9sus4] | [F9sus4] | [F9sus4] | [F9sus4] |
| [Eb9sus4] | [Eb9sus4] | [Eb9sus4] | [Eb9sus4] |
| [Db9sus4] | [Db9sus4] | [D9sus4] | [D9sus4] | `
    },
    {
        id: 'jazz-watermelon-man',
        title: 'Watermelon Man',
        artist: 'Herbie Hancock',
        tags: ['Jazz', 'Funk', 'Blues'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [F7] | [F7] | [F7] | [F7] |
| [Bb7] | [Bb7] | [F7] | [F7] |
| [C7] | [Bb7] | [F7] | [C7] | `
    },
    {
        id: 'jazz-song-for-my-father',
        title: 'Song for My Father',
        artist: 'Horace Silver',
        tags: ['Jazz', 'Latin', 'Hard Bop'],
        key: 'Fm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Fm9] | [Fm9] | [Eb9] | [Eb9] |
| [Db9] | [C7alt] | [Fm9] | [Fm9] | `
    },
    {
        id: 'jazz-nicas-dream',
        title: 'Nica\'s Dream',
        artist: 'Horace Silver',
        tags: ['Jazz', 'Hard Bop', 'Latin'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Bbm(maj7)] | [Abm7][Db7] | [Gbmaj7] | [F7alt] |
| [Bbm(maj7)] | [Abm7][Db7] | [Gbmaj7] | [F7alt] | `
    },
    {
        id: 'jazz-whisper-not',
        title: 'Whisper Not',
        artist: 'Benny Golson',
        tags: ['Jazz', 'Hard Bop'],
        key: 'Cm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Cm] | [Cm][A7b5] | [Dm7b5] | [G7alt] |
| [Cm][C7] | [Fm][Bb7] | [Ebmaj7][Ab7] | [Dm7b5][G7] | `
    },
    {
        id: 'jazz-moanin',
        title: 'Moanin\'',
        artist: 'Bobby Timmons',
        tags: ['Jazz', 'Hard Bop', 'Soul Jazz'],
        key: 'Fm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Fm] | [Fm] | [Fm] | [Fm] |
| [Bbm] | [Bbm] | [Fm] | [Fm] |
| [C7] | [Bb7] | [Fm] | [C7] | `
    },
    {
        id: 'jazz-dat-dere',
        title: 'Dat Dere',
        artist: 'Bobby Timmons',
        tags: ['Jazz', 'Soul Jazz'],
        key: 'Cm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Cm7] | [Bb7] | [Am7][Ab7] | [G7] |
| [Cm7] | [Bb7] | [Am7][Ab7] | [G7] | `
    },
    {
        id: 'jazz-work-song',
        title: 'Work Song',
        artist: 'Nat Adderley',
        tags: ['Jazz', 'Soul Jazz'],
        key: 'Fm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Fm7] | [Fm7] | [Fm7] | [Fm7] |
| [Fm7] | [Fm7] | [G7alt] | [C7alt] | `
    },
    {
        id: 'jazz-mercy-mercy-mercy',
        title: 'Mercy, Mercy, Mercy',
        artist: 'Joe Zawinul',
        tags: ['Jazz', 'Soul Jazz'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Bb] | [Eb/Bb] | [Bb] | [Eb/Bb] |
| [Bb] | [Cm7] | [Dm7] | [Eb][F] |
| [Bb] | [Bb] | [Bb] | [Bb] | `
    },
    {
        id: 'jazz-the-sidewinder',
        title: 'The Sidewinder',
        artist: 'Lee Morgan',
        tags: ['Jazz', 'Soul Jazz', 'Blues'],
        key: 'Eb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Eb7] | [Eb7] | [Eb7] | [Eb7] |
| [Ab7] | [Ab7] | [Eb7] | [Eb7] |
| [Fm7] | [Bb7] | [Eb7] | [Eb7] | `
    },
    {
        id: 'jazz-chitlins-con-carne',
        title: 'Chitlins Con Carne',
        artist: 'Kenny Burrell',
        tags: ['Jazz', 'Blues', 'Latin'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [C7] | [C7] | [C7] | [C7] |
| [F7] | [F7] | [C7] | [C7] |
| [Ab7] | [G7] | [C7] | [G7] | `
    },
    {
        id: 'jazz-midnight-blue',
        title: 'Midnight Blue',
        artist: 'Kenny Burrell',
        tags: ['Jazz', 'Blues'],
        key: 'Fm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Fm7] | [Fm7] | [Fm7] | [Fm7] |
| [Bbm7] | [Bbm7] | [Fm7] | [Fm7] |
| [Cm7] | [Bbm7] | [Fm7] | [C7] | `
    },
    {
        id: 'jazz-in-a-mellow-tone',
        title: 'In a Mellow Tone',
        artist: 'Duke Ellington',
        tags: ['Jazz', 'Swing'],
        key: 'Ab',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Eb7] | [Eb7] | [Ab6] | [Ab6] |
| [C7] | [C7] | [F7] | [F7] |
| [Bb7] | [Bb7] | [Eb7] | [Eb7] |
| [Ab6][Adim] | [Bbm7][Eb7] | [Ab6] | [Ab6] | `
    },
    {
        id: 'jazz-perdido',
        title: 'Perdido',
        artist: 'Juan Tizol',
        tags: ['Jazz', 'Swing'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
B Section:
| [D7] | [D7] | [G7] | [G7] |
| [C7] | [C7] | [F7] | [F7] | `
    },
    {
        id: 'jazz-c-jam-blues',
        title: 'C Jam Blues',
        artist: 'Duke Ellington',
        tags: ['Jazz', 'Blues', 'Swing'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [C7] | [F7] | [C7] | [C7] |
| [F7] | [F7] | [C7] | [C7] |
| [G7] | [F7] | [C7] | [G7] | `
    },
    {
        id: 'jazz-blue-train',
        title: 'Blue Train',
        artist: 'John Coltrane',
        tags: ['Jazz', 'Blues', 'Hard Bop'],
        key: 'Eb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{ start_of_verse }
| [Eb7] | [Eb7] | [Eb7] | [Eb7] |
| [Ab7] | [Ab7] | [Eb7] | [Eb7] |
| [Fm7] | [Bb7] | [Eb7] | [Bb7] | `
    },
];
