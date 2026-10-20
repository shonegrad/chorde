# Chorde Roadmap

Chorde is a local-first ChordPro songbook. This roadmap says what the app does today, what is
being worked on, and what is deliberately not being done.

## Principles

1. **Correct before clever.** A wrong key signature or a chord that plays the wrong note makes a
   musician distrust the whole app.
2. **Local first.** Your library lives in your browser and works offline. Anything that needs a
   server is optional.
3. **Rights first.** Only public domain material ships in the repository, and it is checked by a
   test rather than claimed in a comment.
4. **The writer is the customer.** Reading songs well matters, but the reason to keep a songbook
   is to write your own.
5. **ChordPro is the format.** The file on disk is plain text that other tools can read.

## Where we are

16 built-in songs, all public domain, plus whatever you import or write.

Working today: ChordPro import from text, files, folders and the web; a chord-over-lyrics reader
that puts each chord above its word; transposition with key-aware spelling; capo with the sounding
key; Nashville numbers; setlists; favourites; tags; sorting; searching inside lyrics; bulk actions;
library backup and restore; light and dark themes; an offline installable app; keyboard control;
and navigation that works on a phone.

## Milestone 1 — Make it true

_Remove every song that is not public domain, and make the documentation match reality._
_Fix the chord lookup so no chord is missing a diagram, and check that every shape in the library
plays the notes it claims to._
_Make the count-in land on the beat, and make the section buttons follow the song._
_Remove the dead code and the duplicated types._

**Done when** every built-in song is public domain, every chord has a correct shape, and the
count-in lands on the beat.

## Milestone 2 — The writing desk

_Transcribing and writing your own songs has to be dependable, because that is what you will do
most._

- A real editor, not a text box: a chord palette, a section palette, and completion for chord
  names as you type.
- Metadata that a song needs to be usable: key, capo, tempo, time signature, duration, notes.
- Nothing lost: autosave, undo and redo, and a history of previous versions.
- A key-aware editor: the chords that fit the key are offered first, chords that do not fit are
  marked, and the key can be detected from what you wrote.
- Transpose what you have written without leaving the editor.
- A metronome and tap tempo, because you write against the beat.
- "My songs", separate from the built-in ones.

**Done when** you can write a whole song without losing anything and without leaving the editor.

## Milestone 3 — Rehearsal and performance

_Setlists carry per-song transposition, capo and notes, and a target key._
_A full-screen performance view: count-in, auto-advance, and the next song without leaving the
screen._
_A printable running order._

**Done when** a setlist can be played from start to finish without touching the library.

## Milestone 4 — Real notation

_Replace the hand-rolled staff with VexFlow (MIT), so key signatures, clef, stems and pitches are
right._
_Render real tablature from the chord shapes we already have._
_Keep our own chord-over-lyrics layout — no library does it better, and it stays selectable and
readable by a screen reader._

**Done when** B♭ renders as two flats and the notes B♭ D F, and the tab view shows a fretboard.

## Milestone 5 — The rest of ChordPro

Comments and playing instructions (`{comment:}`, `{gc:}`), `{define:}`, `{duration:}`, multi-song
files, Jazz Grilles chord grids, real tab blocks, and the original column alignment so a chord
written mid-word keeps its place.

## Milestone 6 — Sound

A metronome, a count-in locked to the tempo, chord progression playback, a guitar tone that is
not a sine wave, and audio preferences.

## Milestone 7 — More ways in

Import OnSong, legacy `.crd` and ZIP folders locally. MusicXML and Guitar Pro are deliberately out
of scope for now.

## Milestone 8 — A smarter library

Key detection when a song has no `{key:}`, the chords that fit a key, scale diagrams, a "songs in
this key" view, and a setlist that knows the running time.

## Milestone 9 — Cloud sync and accounts

Optional, and only if it stays optional. Your library is yours; sync is a convenience, not a
requirement.

## Milestone 10 — Other languages

## Not doing

- **Scraping song sites.** The terms of service and the rights are not ours.
- **Shipping popular commercial songs.** The ChordPro text for them is copyrighted just as much
  as a recording is. Write your own instead — that is what the writing desk is for.
- **VexTab.** Its licence is non-commercial, so we use the MIT-licensed VexFlow core instead.
- **A full notation engraver.** VexFlow renders; it does not typeset pages.
