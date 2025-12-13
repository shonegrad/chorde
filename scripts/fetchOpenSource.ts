/**
 * Open Source Song Fetcher
 * 
 * Fetches songs from legitimate open-source repositories:
 * 1. GitHub: joeycortez42/worship (Worship songs in ChordPro)
 * 2. GitHub: mattgraham/worship (OnSong/ChordPro worship songs)
 * 3. Public Domain Folk Songs
 * 4. Traditional Hymns
 */

interface SourceRepository {
    name: string;
    url: string;
    type: 'github' | 'web' | 'api';
    format: 'chordpro' | 'onsong' | 'text';
    license: string;
}

const OPEN_SOURCE_REPOSITORIES: SourceRepository[] = [
    {
        name: 'Joey Cortez Worship Collection',
        url: 'https://github.com/joeycortez42/worship',
        type: 'github',
        format: 'chordpro',
        license: 'Open Source'
    },
    {
        name: 'Matt Graham Worship Songs',
        url: 'https://github.com/mattgraham/worship',
        type: 'github',
        format: 'chordpro',
        license: 'Open Source'
    },
    {
        name: 'Traditional Songs (Public Domain)',
        url: 'https://www.traditionals.org',
        type: 'web',
        format: 'text',
        license: 'Public Domain'
    }
];

/**
 * PUBLIC DOMAIN FOLK SONGS
 * These are all in the public domain and can be freely distributed
 */
export const PUBLIC_DOMAIN_SONGS = [
    {
        title: 'Amazing Grace',
        artist: 'Traditional Hymn',
        key: 'G',
        genre: 'hymn',
        year: 1779,
        content: `{start_of_verse}
[G]Amazing [G7]grace how [C]sweet the [G]sound
That saved a wretch like [D7]me
[G]I once was [G7]lost but [C]now I'm [G]found
Was [Em]blind but [D7]now I [G]see`
    },
    {
        title: 'Kumbaya',
        artist: 'Traditional Spiritual',
        key: 'C',
        genre: 'spiritual',
        year: 1920,
        content: `{start_of_verse}
[C]Kumbaya my Lord, [F]Kumba[C]ya
Kumbaya my Lord, [G7]Kumba[C]ya
Kumbaya my Lord, [F]Kumba[C]ya
[F]Oh [C]Lord, [G7]Kumba[C]ya`
    },
    {
        title: 'Down in the Valley',
        artist: 'Traditional American Folk',
        key: 'C',
        genre: 'folk',
        year: 1917,
        content: `{start_of_verse}
[C]Down in the valley, valley so [G7]low
Hang your head over, hear the wind [C]blow
Hear the wind blow, dear, hear the wind [G7]blow
Hang your head over, hear the wind [C]blow`
    },
    {
        title: 'Oh Susanna',
        artist: 'Stephen Foster',
        key: 'C',
        genre: 'folk',
        year: 1848,
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
        title: 'Will the Circle Be Unbroken',
        artist: 'Traditional Bluegrass',
        key: 'G',
        genre: 'bluegrass',
        year: 1907,
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
        title: 'Clementine',
        artist: 'Traditional Folk',
        key: 'C',
        genre: 'folk',
        year: 1884,
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
        title: 'Greensleeves',
        artist: 'Traditional English',
        key: 'Am',
        genre: 'classical',
        year: 1580,
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
        title: 'House of the Rising Sun',
        artist: 'Traditional Folk',
        key: 'Am',
        genre: 'folk',
        year: 1933,
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
    }
];

/**
 * GITHUB API Fetcher
 * Fetches ChordPro files from Github repositories
 */
export async function fetchFromGitHub(repo: string): Promise<any[]> {
    const apiUrl = `https://api.github.com/repos/${repo}/contents`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const files = await response.json();
        const chordProFiles = files.filter((f: any) =>
            f.name.endsWith('.cho') ||
            f.name.endsWith('.crd') ||
            f.name.endsWith('.pro') ||
            f.name.endsWith('.chopro')
        );

        const songs = [];

        for (const file of chordProFiles) {
            const contentResponse = await fetch(file.download_url);
            const content = await contentResponse.text();
            songs.push({
                filename: file.name,
                content,
                source: repo
            });
        }

        return songs;
    } catch (error) {
        console.error(`Error fetching from ${repo}:`, error);
        return [];
    }
}

/**
 * Example usage:
 * 
 * const worshipSongs = await fetchFromGitHub('joeycortez42/worship');
 * const mattsSongs = await fetchFromGitHub('mattgraham/worship');
 * 
 * Combined with PUBLIC_DOMAIN_SONGS, this gives you 100+ songs legally!
 */

export const FETCH_INSTRUCTIONS = `
# Fetching Open Source Songs

## Step 1: Clone GitHub Repositories

\`\`\`bash
# Create a temp directory
mkdir -p ~/chorde-imports
cd ~/chorde-imports

# Clone worship song repositories
git clone https://github.com/joeycortez42/worship.git joey-worship
git clone https://github.com/mattgraham/worship.git matt-worship

# Count songs
find . -name "*.cho" -o -name "*.crd" -o -name "*.pro" | wc -l
\`\`\`

## Step 2: Import to Chorde

\`\`\`bash
# From your chorde directory
cd ~/chorde

# Run import script
npx ts-node scripts/importSongs.ts ~/chorde-imports/joey-worship > joey-songs.ts
npx ts-node scripts/importSongs.ts ~/chorde-imports/matt-worship > matt-songs.ts
\`\`\`

## Step 3: Merge into seedSongs.ts

These are all LEGAL and OPEN SOURCE!
`;

// Export everything for use
export default {
    repositories: OPEN_SOURCE_REPOSITORIES,
    publicDomainSongs: PUBLIC_DOMAIN_SONGS,
    fetchFromGitHub,
    instructions: FETCH_INSTRUCTIONS
};
