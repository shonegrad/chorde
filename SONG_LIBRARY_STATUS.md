# 🎸 Chorde - Song Library Status & Expansion Plan

## Current Library Status

### ✅ What We Have Now: **28 Songs**

**Original Collection (20 songs):**
- Nirvana, Oasis, Bob Dylan, Johnny Cash, Eagles, etc.
- Mix of rock, folk, country, pop
- High quality, manually curated

**New Public Domain Songs (8 songs):**
- Amazing Grace (traditional hymn)
- Kumbaya (spiritual)
- Oh Susanna (Stephen Foster)
- Will the Circle Be Unbroken (bluegrass)
- Oh My Darling Clementine (folk)
- Greensleeves (English traditional)
- House of the Rising Sun (folk/blues)
- Down in the Valley (American folk)

## What We Discovered

### 🔍 Open Source Research Results:

**Worship Songs Found (NOT IMPORTED per user request):**
- Joey Cortez: 178 ChordPro worship songs
- Matt Graham: 695 OnSong worship songs
- **Status**: Downloaded but NOT imported to respect user preference

**Copyright Reality:**
- Beatles, most classic rock: Still under copyright until 2060s-2070s
- Ultimate Guitar, Songsterr: Proprietary databases, scraping prohibited
- Most "free" tabs online: Legally gray area

**Legitimate Sources:**
- ✅ Public domain (pre-1928): FREE and legal
- ✅ Traditional folk songs: FREE and legal
- ✅ User-created tabs (with permission): FREE
- ❌ Modern copyrighted songs: Requires licensing

## Recommended Path Forward

### Option 1: Quality Curated Library (50-100 songs)
**Focus on player needs, not quantity**

**What to add:**
- 30 more classic rock songs (manual curation)
- 20 popular country songs
- 20 folk/acoustic favorites
- Ensure accuracy and playability

**Estimated effort:** 2-3 days of careful curation

### Option 2: User Import Feature
**Let users build their own library**

**Implementation:**
```typescript
// New component: SongImporter
function PasteChordProImporter() {
    const [chordProText, setText] = useState('');
    
    const handleImport = () => {
        const parsed = parseChordPro(chordProText);
        saveSongToLocalStorage(parsed);
    };
    
    return (
        <div>
            <textarea 
                placeholder="Paste ChordPro format here..."
                value={chordProText}
                onChange={e => setText(e.target.value)}
            />
            <button onClick={handleImport}>Import Song</button>
        </div>
    );
}
```

**Benefits:**
- Users can add ANY song they legally have
- Unlimited library growth
- No copyright concerns for us
- Users control their content

### Option 3: Premium API Integration
**Partner with legal tab providers**

**Potential partners:**
- Songsterr API (paid)
- Ultimate Guitar API (paid)
- MuseScore API (free tier available)

**Pros:** Instant access to 1M+ songs  
**Cons:** Requires API keys, possible costs, legal agreements

## What I Recommend

### **Hybrid Approach:**

1. **Immediate (Today):**
   - ✅ Keep 28 current songs (done!)
   - Build user import feature
   - Add 20 more manually curated classics

2. **Short Term (This Week):**
   - Add file upload for .cho/.crd files
   - Create "My Songs" vs "Library Songs" sections
   - Implement localStorage persistence

3. **Long Term (Future):**
   - Community tab sharing (optional)
   - API integration for premium users
   - Crowd-sourced accuracy ratings

## Legal & Ethical Considerations

### ✅ What's Safe:
- Public domain songs (pre-1928)
- Traditional/folk songs
- User-generated content
- Songs with explicit permission

### ❌ What to Avoid:
- Scraping commercial sites
- Bulk importing copyrighted material
- Distributing without licenses

## Next Steps - Your Choice

**I can proceed with:**

**A)** Add 20 more classic songs manually (quality over quantity)
   - I'll carefully select most requested songs
   - Verify accuracy
   - Takes ~2 hours

**B)** Build the "Paste ChordPro" import feature
   - Users can add unlimited songs
   - Takes ~1 hour to implement

**C)** Both A + B
   - Best of both worlds
   - Takes ~3 hours total

**D)** Focus on other features instead
   - Chord diagrams improvements
   - Practice mode enhancements
   - Better UI/UX

**Which would you prefer?** Let me know and I'll proceed accordingly!

---

## Technical Notes

**Current Status:**
- ✅ App running: http://localhost:5173
- ✅ 28 songs working perfectly
- ✅ All features functional (tabs, notation, Nashville, etc.)
- ⚠️ Minor lint warnings (cosmetic, non-blocking)

**Storage:**
- Worship songs repo cloned to: `~/.chorde-temp-imports/`
- Can be safely deleted if not needed
- Size: ~5MB

**Import Scripts Ready:**
- `scripts/importSongs.ts` - ChordPro converter
- `scripts/fetchOpenSource.ts` - GitHub fetcher
- `scripts/fetch-opensong.sh` - Automated downloader
