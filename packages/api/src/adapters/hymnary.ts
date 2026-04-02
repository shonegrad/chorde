import { BaseAdapter } from './base.js';
import type { SearchResult, SongContent } from '../types.js';

interface HymnData {
  id: string;
  title: string;
  author: string;
  year: string;
  lyrics: string;
}

const PUBLIC_DOMAIN_HYMNS: HymnData[] = [
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    author: 'John Newton',
    year: '1779',
    lyrics: `Amazing grace, how sweet the sound,
That saved a wretch like me.
I once was lost, but now am found,
Was blind, but now I see.

'Twas grace that taught my heart to fear,
And grace my fears relieved.
How precious did that grace appear,
The hour I first believed.

Through many dangers, toils and snares
I have already come.
'Twas grace that brought us safe thus far,
And grace will lead us home.

When we've been there ten thousand years,
Bright shining as the sun,
We've no less days to sing God's praise,
Than when we first begun.`,
  },
  {
    id: 'holy-holy-holy',
    title: 'Holy, Holy, Holy',
    author: 'Reginald Heber',
    year: '1826',
    lyrics: `Holy, holy, holy! Lord God Almighty!
Early in the morning our song shall rise to Thee;
Holy, holy, holy, merciful and mighty!
God in three Persons, blessed Trinity!

Holy, holy, holy! All the saints adore Thee,
Casting down their golden crowns around the glassy sea;
Cherubim and seraphim falling down before Thee,
Which wert, and art, and evermore shalt be.

Holy, holy, holy! though the darkness hide Thee,
Though the eye that made by adoration Thy glory may not see,
Only Thou art holy; there is none beside Thee,
Perfect in power, in love, and purity.`,
  },
  {
    id: 'it-is-well',
    title: 'It Is Well With My Soul',
    author: 'Horatio Spafford',
    year: '1873',
    lyrics: `When peace like a river attendeth my way,
When sorrows like sea billows roll;
Whatever my lot, Thou hast taught me to say,
It is well, it is well, with my soul.

Though Satan should buffet, though trials should come,
Let this blest assurance control,
That Christ has regarded my helpless estate,
And hath shed His own blood for my soul.

My sin, oh, the bliss of this glorious thought!
My sin, not in part but the whole,
Is nailed to the cross, and I bear it no more,
Praise the Lord, praise the Lord, O my soul!`,
  },
  {
    id: 'joy-to-the-world',
    title: 'Joy to the World',
    author: 'Isaac Watts',
    year: '1719',
    lyrics: `Joy to the world, the Lord is come!
Let earth receive her King;
Let every heart prepare Him room,
And heaven and nature sing.

Joy to the world, the Savior reigns!
Let men their songs employ;
While fields and floods, rocks, hills and plains
Repeat the sounding joy.

No more let sins and sorrows grow,
Nor thorns infest the ground;
He comes to make His blessings flow
Far as the curse is found.`,
  },
  {
    id: 'o-come-o-come-emmanuel',
    title: 'O Come, O Come, Emmanuel',
    author: 'Traditional (8th Century)',
    year: '1851',
    lyrics: `O come, O come, Emmanuel,
And ransom captive Israel,
That mourns in lonely exile here
Until the Son of God appear.
Rejoice! Rejoice! Emmanuel
Shall come to thee, O Israel.

O come, Thou Wisdom from on high,
And order all things far and nigh;
To us the path of knowledge show,
And teach us in her ways to go.
Rejoice! Rejoice! Emmanuel
Shall come to thee, O Israel.`,
  },
  {
    id: 'be-thou-my-vision',
    title: 'Be Thou My Vision',
    author: 'Traditional Irish (6th Century)',
    year: '1905',
    lyrics: `Be Thou my Vision, O Lord of my heart;
Naught be all else to me, save that Thou art.
Thou my best thought, by day or by night,
Waking or sleeping, Thy presence my light.

Be Thou my Wisdom, and Thou my true Word;
I ever with Thee and Thou with me, Lord.
Thou my great Father, I Thy true son;
Thou in me dwelling, and I with Thee one.

Riches I heed not, nor man's empty praise,
Thou mine inheritance, now and always.
Thou and Thou only, first in my heart,
High King of Heaven, my Treasure Thou art.`,
  },
  {
    id: 'come-thou-fount',
    title: 'Come Thou Fount of Every Blessing',
    author: 'Robert Robinson',
    year: '1758',
    lyrics: `Come, Thou Fount of every blessing,
Tune my heart to sing Thy grace;
Streams of mercy, never ceasing,
Call for songs of loudest praise.
Teach me some melodious sonnet,
Sung by flaming tongues above.
Praise the mount, I'm fixed upon it,
Mount of Thy redeeming love.

Here I raise my Ebenezer;
Hither by Thy help I come.
And I hope, by Thy good pleasure,
Safely to arrive at home.
Jesus sought me when a stranger,
Wandering from the fold of God;
He, to rescue me from danger,
Interposed His precious blood.`,
  },
  {
    id: 'all-hail-the-power',
    title: 'All Hail the Power of Jesus Name',
    author: 'Edward Perronet',
    year: '1779',
    lyrics: `All hail the power of Jesus' name!
Let angels prostrate fall;
Bring forth the royal diadem,
And crown Him Lord of all.

Let highborn seraphs tune the lyre,
And as they tune it, fall
Before His face who tunes their choir,
And crown Him Lord of all.

Crown Him, ye morning stars of light,
Who fixed this floating ball;
Now hail the strength of Israel's might,
And crown Him Lord of all.`,
  },
  {
    id: 'a-mighty-fortress',
    title: 'A Mighty Fortress Is Our God',
    author: 'Martin Luther',
    year: '1529',
    lyrics: `A mighty fortress is our God,
A bulwark never failing;
Our helper He amid the flood
Of mortal ills prevailing.
For still our ancient foe
Doth seek to work us woe;
His craft and power are great,
And armed with cruel hate,
On earth is not his equal.

Did we in our own strength confide,
Our striving would be losing,
Were not the right Man on our side,
The Man of God's own choosing.
Dost ask who that may be?
Christ Jesus, it is He;
Lord Sabaoth His name,
From age to age the same,
And He must win the battle.`,
  },
  {
    id: 'blessed-assurance',
    title: 'Blessed Assurance',
    author: 'Fanny Crosby',
    year: '1873',
    lyrics: `Blessed assurance, Jesus is mine!
O what a foretaste of glory divine!
Heir of salvation, purchase of God,
Born of His Spirit, washed in His blood.

This is my story, this is my song,
Praising my Savior all the day long;
This is my story, this is my song,
Praising my Savior all the day long.

Perfect submission, perfect delight,
Visions of rapture now burst on my sight;
Angels descending bring from above
Echoes of mercy, whispers of love.`,
  },
];

export class HymnaryAdapter extends BaseAdapter {
  id = 'hymnary';
  name = 'Hymnary.org';
  
  async search(query: string): Promise<SearchResult[]> {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];

    return PUBLIC_DOMAIN_HYMNS
      .filter(hymn => 
        hymn.title.toLowerCase().includes(lowerQuery) ||
        hymn.author.toLowerCase().includes(lowerQuery)
      )
      .map(hymn => ({
        id: hymn.id,
        source: this.id,
        title: hymn.title,
        artist: hymn.author,
        preview: hymn.lyrics.split('\n')[0],
        hasChords: false,
      }));
  }

  async fetchSong(id: string): Promise<SongContent> {
    const hymn = PUBLIC_DOMAIN_HYMNS.find(h => h.id === id);
    
    if (!hymn) {
      return {
        chordPro: `{title: Hymn Not Found}\n{artist: Unknown}\n\nHymn content not available.`,
        metadata: { title: 'Hymn Not Found', artist: 'Unknown' },
      };
    }

    const chordPro = this.convertLyricsToChordPro(hymn);
    const metadata = this.extractMetadata(chordPro);
    
    return {
      chordPro,
      metadata,
    };
  }

  private convertLyricsToChordPro(hymn: HymnData): string {
    const lines = hymn.lyrics.split('\n');
    const chordProLines: string[] = [];
    
    chordProLines.push(`{title: ${hymn.title}}`);
    chordProLines.push(`{artist: ${hymn.author}}`);
    chordProLines.push(`{subtitle: Public Domain (${hymn.year})}`);
    chordProLines.push(`{comment: Lyrics only -- no chords. Add chords using the editor.}`);
    chordProLines.push('');
    chordProLines.push('{start_of_verse}');
    
    for (const line of lines) {
      if (!line.trim()) {
        chordProLines.push('');
        continue;
      }
      chordProLines.push(line);
    }
    
    chordProLines.push('{end_of_verse}');
    
    return chordProLines.join('\n');
  }
}
