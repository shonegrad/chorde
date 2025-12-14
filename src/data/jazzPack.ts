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
    }
];
