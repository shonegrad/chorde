import { BaseAdapter } from './base.js';
import { SearchResult, SongContent } from '../types.js';

// OpenHymnal adapter - fetches from GitHub repo
// Repo: https://github.com/Open-Hymnal-Project/Open-Hymnal-Project
export class OpenHymnalAdapter extends BaseAdapter {
  id = 'openhymnal';
  name = 'OpenHymnal';
  
  private baseUrl = 'https://raw.githubusercontent.com/Open-Hymnal-Project/Open-Hymnal-Project/master';
  private indexCache: Map<string, any> = new Map();
  
  async search(query: string): Promise<SearchResult[]> {
    // For MVP, we'll use a simple in-memory index
    // In production, this could be a pre-built index or database
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Sample hymns from OpenHymnal (this would be expanded with actual index)
    const sampleHymns = [
      { id: 'AmazingGrace', title: 'Amazing Grace', artist: 'John Newton', key: 'G' },
      { id: 'AllHailThePower', title: 'All Hail the Power of Jesus\' Name', artist: 'Edward Perronet', key: 'F' },
      { id: 'BeThOuMyVision', title: 'Be Thou My Vision', artist: 'Traditional Irish', key: 'D' },
      { id: 'ComeThOuFount', title: 'Come Thou Fount of Every Blessing', artist: 'Robert Robinson', key: 'G' },
      { id: 'HolyHolyHoly', title: 'Holy, Holy, Holy', artist: 'Reginald Heber', key: 'D' },
      { id: 'ItIsWell', title: 'It Is Well With My Soul', artist: 'Horatio Spafford', key: 'C' },
      { id: 'JoyToTheWorld', title: 'Joy to the World', artist: 'Isaac Watts', key: 'D' },
      { id: 'OComOComeEmmanuel', title: 'O Come, O Come Emmanuel', artist: 'Traditional', key: 'Em' },
    ];
    
    for (const hymn of sampleHymns) {
      if (hymn.title.toLowerCase().includes(lowerQuery) || 
          hymn.artist.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: hymn.id,
          source: this.id,
          title: hymn.title,
          artist: hymn.artist,
          key: hymn.key,
        });
      }
    }
    
    return results;
  }
  
  async fetchSong(id: string): Promise<SongContent> {
    // For MVP, return sample ChordPro content
    // In production, this would fetch from GitHub
    const sampleSongs: Record<string, string> = {
      'AmazingGrace': `{title: Amazing Grace}
{artist: John Newton}
{key: G}

{start_of_verse}
A[G]mazing [C]grace how [G]sweet the sound
That [G]saved a [D]wretch like [G]me
I [G]once was [C]lost but [G]now am found
Was [G]blind but [D]now I [G]see
{end_of_verse}

{start_of_verse}
'Twas [G]grace that [C]taught my [G]heart to fear
And [G]grace my [D]fears re[G]lieved
How [G]precious [C]did that [G]grace appear
The [G]hour I [D]first be[G]lieved
{end_of_verse}`,
      
      'BeThOuMyVision': `{title: Be Thou My Vision}
{artist: Traditional Irish}
{key: D}

{start_of_verse}
Be [D]Thou my [A]Vision O [Bm]Lord of my [G]heart
[D]Naught be all [A]else to me [Em]save that Thou [A]art
[D]Thou my best [G]thought by [D]day or by [A]night
[Bm]Waking or [G]sleeping Thy [A]presence my [D]light
{end_of_verse}`,
    };
    
    const chordPro = sampleSongs[id] || `{title: Song Not Found}\n{artist: Unknown}\n\nSong content not available.`;
    const metadata = this.extractMetadata(chordPro);
    
    return {
      chordPro: this.normalizeChordPro(chordPro),
      metadata,
    };
  }
}
