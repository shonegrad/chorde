import type { Song } from '../types';

export const ROCK_PACK: Song[] = [
    // NIRVANA
    {
        id: 'nirvana-smells-like',
        title: 'Smells Like Teen Spirit',
        artist: 'Nirvana',
        tags: ['Grunge', '90s'],
        key: 'F',
        capo: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]Load up on guns, [Bb]bring your friends
It's [Ab]fun to lose and [Db]to pretend
[F]She's over-bored and [Bb]self-assured
Oh [Ab]no, I know a [Db]dirty word

{start_of_chorus}
[F]Hello, hello, hello, [Bb]how low
[Ab]Hello, hello, hello, [Db]how low
[F]Hello, hello, hello, [Bb]how low
[Ab]Hello, hello, hello, [Db]how low`
    },
    {
        id: 'nirvana-come-as-you-are',
        title: 'Come As You Are',
        artist: 'Nirvana',
        tags: ['Grunge', '90s'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]Come as you [D]are, as you [Em]were
As I [D]want you to [Em]be
As a [D]friend, as a [Em]friend
As an [D]old enem[Em]y

{start_of_chorus}
[Em]Memoria, [G]Memoria
[Em]Memoria, [G]Memoria`
    },
    {
        id: 'nirvana-lithium',
        title: 'Lithium',
        artist: 'Nirvana',
        tags: ['Grunge', '90s'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[E]I'm so [G#5]happy cause to[C#5]day
I've [A5]found my [C5]friends
They're [D5]in my [B5]head
[E]I'm so [G#5]ugly, but that's [C#5]okay
'Cause [A5]so are [C5]you
We've [D5]broke our [B5]mirrors`
    },
    {
        id: 'nirvana-heart-shaped-box',
        title: 'Heart-Shaped Box',
        artist: 'Nirvana',
        tags: ['Grunge', '90s'],
        key: 'A',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[A]She eyes me [F]like a pisces [D]when I am weak
[A]I've been locked in[F]side your heart-shaped [D]box for weeks
[A]I've been drawn in[F]to your magnet [D]tar pit trap
[A]I wish I could [F]eat your cancer [D]when you turn black`
    },
    {
        id: 'nirvana-in-bloom',
        title: 'In Bloom',
        artist: 'Nirvana',
        tags: ['Grunge', '90s'],
        key: 'Bb',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Bb]Sell the [Gb]kids for [Eb]food
[Cb]Weather [Ab]changes [A]moods
[Bb]Spring is [Gb]here a[Eb]gain
[Cb]Repro[Ab]ductive [A]glands

{start_of_chorus}
[Bb]He's the one
[Gb]Who likes all our pretty [Eb]songs
And he [Cb]likes to sing a[Ab]long
And he [A]likes to shoot his [Bb]gun`
    },
    {
        id: 'nirvana-polly',
        title: 'Polly',
        artist: 'Nirvana',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]Polly wants a cr[G]acker
[D]I think I should get [C]off her first
[Em]I think she wants some [G]water
[D]To put out the [C]blow torch`
    },
    {
        id: 'nirvana-all-apologies',
        title: 'All Apologies',
        artist: 'Nirvana',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'D',
        capo: 1, // Drop D tuning technically, but D chord family
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]What else should I be?
[D]All apologies
[D]What else could I say?
[D]Everyone is gay
[D]What else could I write? 
[D]I don't have the right`
    },
    {
        id: 'nirvana-lake-of-fire',
        title: 'Lake of Fire',
        artist: 'Nirvana',
        tags: ['Grunge', '90s', 'Live'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[G]Where do bad folks [F]go when they [Bb]die?
They don't go to [Eb]heaven where the [C]angels [F]fly
They go down to the [G]lake of [F]fire and [Bb]fry
Won't see 'em a[C]gain till the [D]fourth of Ju[G]ly`
    },
    {
        id: 'nirvana-pennyroyal-tea',
        title: 'Pennyroyal Tea',
        artist: 'Nirvana',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]I'm on my time with [G]everyone
[Am]I have very [G]bad posture
[C]Sit and drink Penny[D]royal Tea
[Bb]Distill the life that's in[A]side of me`
    },
    {
        id: 'nirvana-dumb',
        title: 'Dumb',
        artist: 'Nirvana',
        tags: ['Grunge', '90s'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[E]I'm not like [A]them
[G]But I can pre[C]tend
[E]The sun is [A]gone
[G]But I have a [C]light`
    },

    // PEARL JAM
    {
        id: 'pearl-jam-even-flow',
        title: 'Even Flow',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]Freezin', [Bb]rests his head on a [D]pillow made of [C]concrete, a[D]gain [Bb]
[D]Oh, [Bb]Feelin' maybe he'll [D]see a little [C]bittersweet [D]ensign [Bb]
[D]Oh, [Bb]hand out, faces that [D]he sees time a[C]gain ain't that fa[D]miliar [Bb]
[D]Oh, [Bb]dark grin, he can't [D]help when he's [C]happy looks in[D]sane [Bb]`
    },
    {
        id: 'pearl-jam-jeremy',
        title: 'Jeremy',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s'],
        key: 'A',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[A]At home, drawing pictures
[G]Of mountain tops
[A]With him on top
[G]Lemon yellow sun
[A]Arms raised in a 'V'
[G]And the dead lay in pools of maroon below`
    },
    {
        id: 'pearl-jam-daughter',
        title: 'Daughter',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'G', // Open G tuning usually, simplified to G
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Alone, listless
[Em]Breakfast table in an otherwise empty room
[G]Young girl, violence
[Em]Center of her own attention`
    },
    {
        id: 'pearl-jam-better-man',
        title: 'Better Man',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]Waiting, watching the clock
It's [A]four o'clock, it's [G]got to stop
[D]Tell him, take no more
She [A]practices her [G]speech
As he opens the door, she rolls over`
    },
    {
        id: 'pearl-jam-yellow-ledbetter',
        title: 'Yellow Ledbetter',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s'],
        key: 'E',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[E]Unsealed On a [B]porch a letter [A]sat
Then you said "I [E]wanna leave it a[B]gain"
Once [A]I saw her on a [E]beach of weathered [B]sand
And on the [A]sand I wanna leave it a[E]gain, yeah`
    },
    {
        id: 'pearl-jam-last-kiss',
        title: 'Last Kiss',
        artist: 'Pearl Jam',
        tags: ['Rock', '90s', 'Cover'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[G]Oh where oh where can my [Em]baby be
The [C]Lord took her away from [D]me
[G]She's gone to heaven so I [Em]got to be good
So [C]I can see my baby when I [D]leave this world`
    },
    {
        id: 'pearl-jam-elderly-woman',
        title: 'Elderly Woman Behind the Counter',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]I seem to [C]recog[G]nize your [D]face
[D]Haunting, fa[C]mili[G]ar yet [D]I can't seem to place it
[D]Cannot find the [C]candl[G]e of [D]thought to light your name
[D]Lifetimes are [C]catch[G]ing up with [D]me`
    },
    {
        id: 'pearl-jam-corduroy',
        title: 'Corduroy',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]The waiting drove me [F]mad
[G]You're finally here and I'm a [F]mess
[F]I take your entrance [F]back
[G]Can't let you roam inside my [F]head`
    },
    {
        id: 'pearl-jam-dissident',
        title: 'Dissident',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s'],
        key: 'D',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]She nursed him there, ooh, over a [C]night
[D]I wasn't so sure she wanted him to [C]stay
[D]What to say? What to [C]say?
[D]But soon she found out how he was like [C]all the others`
    },
    {
        id: 'pearl-jam-animal',
        title: 'Animal',
        artist: 'Pearl Jam',
        tags: ['Grunge', '90s'],
        key: 'G',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]One, two, three, four, five against one
[G]Five, five, five against one
[G]Said one, two, three, four, five against one
[G]Five, five, five against one`
    },

    // ALICE IN CHAINS
    {
        id: 'aic-rooster',
        title: 'Rooster',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s'],
        key: 'F#',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F#]Ain't found a way to kill me [A]yet
[F#]Eyes burn with stinging sweat [A]
[F#]Seems every path leads me to [A]nowhere
[F#]Wife and kids household pet [A]
[F#]Army green was no safe bet [A]
[F#]The bullets scream to me from [A]somewhere`
    },
    {
        id: 'aic-would',
        title: 'Would?',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s'],
        key: 'Bm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Bm]Know me [G]broken by my [D]master [F#]
[Bm]Teach thee [G]on child of [D]love hereaf[F#]ter
[Bm]Into the [G]flood [D]again [F#]
[Bm]Same old [G]trip it [D]was [F#]back then
[Bm]So I [G]made a big [D]mistake [F#]
[Bm]Try to [G]see it [D]once my [F#]way`
    },
    {
        id: 'aic-down-in-a-hole',
        title: 'Down in a Hole',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm]Bury me [C]softly in this [Bb]womb
[Dm]I give this [C]part of me for [Bb]you
[Dm]Sand rains [C]down and here I [Bb]sit
[Dm]Holding [C]rare flowers in a [Bb]tomb, in [A]bloom`
    },
    {
        id: 'aic-no-excuses',
        title: 'No Excuses',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'A', // A B/A G A
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[A]It's alright [B]
[G]There comes a time [A]
[A]Got no patience to search [B]
For [G]peace of mind [A]
[A]Lay me down [B]
and [G]wash this world from [A]me`
    },
    {
        id: 'aic-them-bones',
        title: 'Them Bones',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s'],
        key: 'D', // Drop D chromatic
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D]I believe them bones are me
[D]Some say we're born into the grave
[D]I feel so alone, gonna end up a
[D]Big ole pile of them bones`
    },
    {
        id: 'aic-got-me-wrong',
        title: 'Got Me Wrong',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'Ab', // Half step down A
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G#]I haven't [E]felt like this in [F#]such a long time
[G#]Wrong, I feel [E]wrong [F#]
[G#]I haven't [E]felt like this in [F#]such a long time
[G#]Wrong, I feel [E]wrong [F#]`
    },
    {
        id: 'aic-angry-chair',
        title: 'Angry Chair',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s'],
        key: 'D#', // weird tuning usually
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[D#m]Sitting on an angry chair
[D#m]Angry walls that steal the air
[D#m]Stomach hurts and I don't care`
    },
    {
        id: 'aic-heaven-beside-you',
        title: 'Heaven Beside You',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s', 'Acoustic'],
        key: 'B',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[B]Be what you wanna [G]be
[B]See what you came to [G]see
[B]Been what you wanna [G]be
[B]I don't like what I [G]see`
    },
    {
        id: 'aic-i-stay-away',
        title: 'I Stay Away',
        artist: 'Alice in Chains',
        tags: ['Grunge', '90s'],
        key: 'D', // Drop D
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[D]I [C]stay [A]away
[D]I [C]stay [A]away`
    },

    // RED HOT CHILI PEPPERS
    {
        id: 'rhcp-californication',
        title: 'Californication',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '90s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]Psychic spies from China
Try to [F]steal your mind's elation [Am] [F]
[Am]Little girls from Sweden
Dream of [F]silver screen quotations [Am] [F]
And [C]if you want these [G]kind of dreams
It's [Dm]Californi[Am]cation`
    },
    {
        id: 'rhcp-otherside',
        title: 'Otherside',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '90s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[Am]How long how [F]long will I [C]slide [G]
[Am]Sepa[F]rate my [C]siiide [G]
[Am]I don't [F]
I don't be[C]lieve it's [G]baaad
[Am]Slit my [F]throat
It's [C]all I ever [G]`
    },
    {
        id: 'rhcp-scar-tissue',
        title: 'Scar Tissue',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '90s', 'Soft'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]Scar tissue that I [C]wish you saw
[Dm]Sarcastic mister [C]know it all
[F]Close your eyes and [C]I'll kiss you
'Cause [Dm]with the birds I'll [C]share`
    },
    {
        id: 'rhcp-snow',
        title: 'Snow (Hey Oh)',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '00s'],
        key: 'G#m',
        capo: 4, // for Em shapes
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]Come to decide that the [C]things that I tried
Were in [G]my life just to get [D]high on
[Em]When I sit alone [C]come get a little [G]known
But I need [D]more than myself this time`
    },
    {
        id: 'rhcp-dani-california',
        title: 'Dani California',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '00s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]Getting born in the state of [G]Mississippi
[Dm]Papa was a copper and her [Am]mama was a hippie
[Am]In Alabama she would [G]swing a hammer
[Dm]Price you got to pay when you [Am]break the panorama`
    },
    {
        id: 'rhcp-by-the-way',
        title: 'By The Way',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '00s', 'Funk'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[F]Standing in line
To [C]see the show tonight
And there's a [Am]light on
[Bb]Heavy glow
[F]By the way I tried to say
[C]I'd be there
[Am]waiting for [Bb]`
    },
    {
        id: 'rhcp-cant-stop',
        title: "Can't Stop",
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '00s', 'Funk'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]Can't stop addicted to the shindig
[D]Chop top he says I'm gonna win big
[Bm]Choose not a life of imitation
[C]Distant cousin to the reservation`
    },
    {
        id: 'rhcp-give-it-away',
        title: 'Give It Away',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '90s', 'Funk'],
        key: 'A',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[A7]Give it away give it away give it away now
[A7]Give it away give it away give it away now
[A7]Give it away give it away give it away now`
    },
    {
        id: 'rhcp-soul-to-squeeze',
        title: 'Soul to Squeeze',
        artist: 'Red Hot Chili Peppers',
        tags: ['Rock', '90s'],
        key: 'F',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[F]I've got a [C]bad disease
[Dm]But from my [Bb]brain is where I [F]bleed
[F]Insanity it [C]seems
[Dm]Has got me [Bb]by my soul to [F]squeeze`
    },

    // FAITH NO MORE
    {
        id: 'fnm-epic',
        title: 'Epic',
        artist: 'Faith No More',
        tags: ['Rock', '90s'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]Can you feel it, see it, hear it today?
[Em]If you can't, then it doesn't matter anyway
[Em]You will never understand it 'cause it happens too fast
[Em]And it feels so good, it's like walking on glass`
    },
    {
        id: 'fnm-easy',
        title: 'Easy',
        artist: 'Faith No More',
        tags: ['Rock', '90s', 'Cover'],
        key: 'G#', // Ab
        capo: 1, // Play in G
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[G]Know it sounds funny
But [Bm]I just can't stand the [Am]pain [D]
[G]Girl I'm leaving you [Bm]tomorrow
[Am]Seems to me girl
You know [D]I've done all I can`
    },
    {
        id: 'fnm-midlife-crisis',
        title: 'Midlife Crisis',
        artist: 'Faith No More',
        tags: ['Rock', '90s'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm]Go on and wring my neck
[Dm]Like when a rag gets wet
[Dm]A little discipline
[Dm]For my pet genius`
    },
    {
        id: 'fnm-ashes-to-ashes',
        title: 'Ashes to Ashes',
        artist: 'Faith No More',
        tags: ['Rock', '90s'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[Dm]Smiling with the [Bb]mouth of the ocean
And I'll [F]wave to you with the [C]arms of the mountain`
    },
    {
        id: 'fnm-evidence',
        title: 'Evidence',
        artist: 'Faith No More',
        tags: ['Rock', '90s'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em7]I don't f[Am7]eel it
[Em7]I don't f[Am7]eel it
[Em7]Washing a[Am7]way
Washing a[Em7]way`
    },
    {
        id: 'fnm-falling-to-pieces',
        title: 'Falling to Pieces',
        artist: 'Faith No More',
        tags: ['Rock', '90s'],
        key: 'F#m',
        capo: 2, // Em shapes
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[Em]Falling to [C]pieces
[G]Falling to [D]pieces
[Em]Falling to [C]pieces
[G]Falling to [D]pieces`
    },
    {
        id: 'fnm-from-out-of-nowhere',
        title: 'From Out of Nowhere',
        artist: 'Faith No More',
        tags: ['Rock', '90s'],
        key: 'C',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_chorus}
[C]From out of [Em]nowhere
[Am]From out of [F]nowhere
[C]From out of [Em]nowhere
[Am]From out of [F]nowhere`
    },
    {
        id: 'fnm-we-care-a-lot',
        title: 'We Care a Lot',
        artist: 'Faith No More',
        tags: ['Rock', '80s'],
        key: 'Em',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Em]We care a lot
[Em]About the army, air force, navy marines
[Em]We care a lot
[Em]About the NY, SF, and LAPD`
    },
    {
        id: 'fnm-a-small-victory',
        title: 'A Small Victory',
        artist: 'Faith No More',
        tags: ['Rock', '90s'],
        key: 'Am',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Am]A hierarchy spread out
[G]Before the night is gone
[F]She fixes his tie
[E]And she waits for the applause`
    },
    {
        id: 'fnm-angel-dust',
        title: 'Land of Sunshine',
        artist: 'Faith No More',
        tags: ['Rock', '90s'],
        key: 'Dm',
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: `{start_of_verse}
[Dm]Life is sunshine
[Dm]Life is flowers
[Dm]Life is laughing for hours
[Dm]Come on, come on, come on, come on`
    }
];
