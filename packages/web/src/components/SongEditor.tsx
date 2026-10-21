import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Song } from '../types';
import { createId } from '../lib/id';
import { extractMetadata, parseChordPro } from '../lib/chordPro';
import { readDuration } from '../lib/duration';
import { transposeChordProContent, keyPrefersFlats } from '../lib/music';
import { keyShift } from '../lib/keys';
import { chordsOutsideKey, suggestChords } from '../lib/chordSuggestions';
import { detectKey } from '../lib/keyDetection';
import {
  commit,
  createHistory,
  redo as redoHistory,
  undo as undoHistory,
  canRedo,
  canUndo,
  type EditorSnapshot,
} from '../lib/editorHistory';
import { TagEditor } from './TagEditor';
import { SongBody } from './SongBody';
import { ChordPalette } from './editor/ChordPalette';
import { Metronome } from './editor/Metronome';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import HistoryIcon from '@mui/icons-material/History';
import TuneIcon from '@mui/icons-material/Tune';

const KEYS = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
  'Cm',
  'C#m',
  'Dm',
  'D#m',
  'Ebm',
  'Em',
  'Fm',
  'F#m',
  'Gm',
  'G#m',
  'Am',
  'A#m',
  'Bbm',
  'Bm',
];

const SECTION_DIRECTIVES = [
  { label: 'Intro', directive: 'start_of_intro' },
  { label: 'Verse', directive: 'start_of_verse' },
  { label: 'Chorus', directive: 'start_of_chorus' },
  { label: 'Bridge', directive: 'start_of_bridge' },
  { label: 'Solo', directive: 'start_of_solo' },
  { label: 'Outro', directive: 'start_of_outro' },
];

interface SongEditorProps {
  initialSong?: Song;
  /** Persists the song. Called while typing as well as when the user saves. */
  onSave: (song: Song) => void | Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const toSnapshot = (song: Song): EditorSnapshot => ({
  content: song.content,
  title: song.title,
  artist: song.artist,
  key: song.key,
  capo: song.capo,
  bpm: song.bpm,
  timeSignature: song.timeSignature,
  duration: song.duration,
  notes: song.notes,
  tags: song.tags ?? [],
});

export const SongEditor: React.FC<SongEditorProps> = ({
  initialSong,
  onSave,
  onCancel,
  onDelete,
}) => {
  const songId = useRef(initialSong?.id ?? createId());
  const isNew = !initialSong;

  const [history, setHistory] = useState(() =>
    createHistory(toSnapshot(initialSong ?? blankSong()))
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [transposeOpen, setTransposeOpen] = useState(false);
  const [transposeTarget, setTransposeTarget] = useState('');
  const [autocomplete, setAutocomplete] = useState<{ query: string; from: number } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draft = history.present;

  /*
   * A change to the song.
   *
   * The group says what was changed, so that typing a word is one change to
   * undo rather than a dozen, and changing the title is a change of its own.
   */
  const update = useCallback((changes: Partial<EditorSnapshot>) => {
    const group = Object.keys(changes).join(',');
    setHistory((current) =>
      commit(current, { ...current.present, ...changes }, undefined, { group })
    );
  }, []);

  /*
   * Saving happens a moment after the user stops typing, so nothing is lost if
   * the browser goes away.
   */
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      void persist(draft);
    }, 1200);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.present]);

  const persist = useCallback(
    async (snapshot: EditorSnapshot) => {
      if (!snapshot.title.trim() && !snapshot.content.trim()) return;

      setSaving(true);
      try {
        const metadata = extractMetadata(snapshot.content);
        await onSave({
          id: songId.current,
          title: snapshot.title.trim() || metadata.title || 'Untitled',
          artist: snapshot.artist.trim() || metadata.artist || 'Unknown Artist',
          content: snapshot.content,
          format: 'chordpro',
          capo: snapshot.capo,
          key: snapshot.key ?? metadata.key,
          bpm: snapshot.bpm,
          timeSignature: snapshot.timeSignature ?? '4/4',
          duration: snapshot.duration ?? readDuration(metadata.duration),
          notes: snapshot.notes,
          tags: snapshot.tags,
          favorite: initialSong?.favorite,
          origin: initialSong?.origin ?? 'user',
          attribution: initialSong?.attribution ?? {
            sourceName: 'Your own song',
            sourceUrl: '',
            license: 'custom',
            author: snapshot.artist.trim(),
            notes: 'Written in Chorde.',
            verifiedBy: 'manual',
          },
          rightsStatus: initialSong?.rightsStatus ?? 'open',
          createdAt: initialSong?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          hash: initialSong?.hash ?? createId(),
        });
        setSavedAt(new Date().toLocaleTimeString());
      } finally {
        setSaving(false);
      }
    },
    [onSave, initialSong]
  );

  const handleUndo = useCallback(() => {
    setHistory((current) => undoHistory(current));
  }, []);

  const handleRedo = useCallback(() => {
    setHistory((current) => redoHistory(current));
  }, []);

  // The usual shortcuts for undo and redo.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier) return;

      const key = event.key.toLowerCase();
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      } else if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  /** Put text into the song at the caret. */
  const insertAtCaret = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        update({ content: draft.content + text });
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const next = draft.content.slice(0, start) + text + draft.content.slice(end);

      update({ content: next });

      // Put the caret after what was inserted.
      requestAnimationFrame(() => {
        const position = start + text.length;
        textarea.focus();
        textarea.setSelectionRange(position, position);
      });
    },
    [draft.content, update]
  );

  const handleContentChange = (value: string, caret: number) => {
    update({ content: value });

    // Typing "[" offers the chords that match what has been typed since.
    const before = value.slice(0, caret);
    const open = before.lastIndexOf('[');
    if (open === -1) {
      setAutocomplete(null);
      return;
    }

    const query = before.slice(open + 1);
    if (query.includes(']') || query.includes('\n') || query.length > 12) {
      setAutocomplete(null);
      return;
    }

    setAutocomplete({ query, from: open });
  };

  const suggestions = useMemo(
    () => (autocomplete ? suggestChords(autocomplete.query, draft.key, 8) : []),
    [autocomplete, draft.key]
  );

  const chooseChord = (chord: string) => {
    if (!autocomplete) return;

    const textarea = textareaRef.current;
    const caret = textarea?.selectionStart ?? draft.content.length;
    const before = draft.content.slice(0, autocomplete.from);
    const after = draft.content.slice(caret);
    const next = `${before}[${chord}]${after}`;

    update({ content: next });
    setAutocomplete(null);

    requestAnimationFrame(() => {
      const position = autocomplete.from + chord.length + 2;
      textarea?.focus();
      textarea?.setSelectionRange(position, position);
    });
  };

  const handleKeyDownInContent = (event: React.KeyboardEvent) => {
    if (!autocomplete || suggestions.length === 0) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setAutocomplete(null);
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      chooseChord(suggestions[0]);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // The list is a convenience; the arrow keys move the caret as usual.
      setAutocomplete(null);
    }
  };

  const outsideKey = useMemo(
    () => chordsOutsideKey(draft.content, draft.key),
    [draft.content, draft.key]
  );

  /* The song as it will read, so that writing is not writing blind. */
  const previewLines = useMemo(() => parseChordPro(draft.content), [draft.content]);

  const suggestedKey = useMemo(() => {
    if (draft.key) return undefined;
    const chords = Array.from(draft.content.matchAll(/\[([^\]]+)\]/g)).map((match) => match[1]);
    if (chords.length < 2) return undefined;
    return detectKey(chords);
  }, [draft.content, draft.key]);

  const applyTranspose = () => {
    const target = transposeTarget.trim();
    if (!target) return;

    const from = draft.key ?? '';
    const shift = keyShift(from, target);
    if (shift === 0) {
      update({ key: target });
      setTransposeOpen(false);
      return;
    }

    const preferFlats = keyPrefersFlats(target);
    update({
      content: transposeChordProContent(draft.content, shift, { preferFlats }),
      key: target,
    });
    setTransposeOpen(false);
  };

  const statusLabel = saving ? 'Saving…' : savedAt ? `Saved at ${savedAt}` : 'Not saved yet';

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" component="h2" fontWeight="bold">
          {isNew ? 'New Song' : 'Edit Song'}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {statusLabel}
          </Typography>
          <Tooltip title="Undo">
            <span>
              <IconButton onClick={handleUndo} disabled={!canUndo(history)} aria-label="Undo">
                <UndoIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo">
            <span>
              <IconButton onClick={handleRedo} disabled={!canRedo(history)} aria-label="Redo">
                <RedoIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Earlier versions">
            <IconButton onClick={() => setHistoryOpen(true)} aria-label="Earlier versions">
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          gap: 3,
          bgcolor: 'background.paper',
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Title"
            value={draft.title}
            onChange={(event) => update({ title: event.target.value })}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Artist"
            value={draft.artist}
            onChange={(event) => update({ artist: event.target.value })}
            fullWidth
            variant="outlined"
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            label="Key"
            value={draft.key ?? ''}
            onChange={(event) => update({ key: event.target.value || undefined })}
            variant="outlined"
            sx={{ minWidth: 170, flex: '1 1 170px' }}
            helperText={
              suggestedKey && !draft.key
                ? `This looks like ${suggestedKey.key}`
                : 'The key the song is in'
            }
          >
            <MenuItem value="">Not set</MenuItem>
            {KEYS.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Capo"
            type="number"
            value={draft.capo ?? ''}
            onChange={(event) =>
              update({ capo: event.target.value === '' ? undefined : Number(event.target.value) })
            }
            inputProps={{ min: 0, max: 12 }}
            variant="outlined"
            sx={{ width: 100 }}
          />
          <TextField
            label="Tempo"
            type="number"
            value={draft.bpm ?? ''}
            onChange={(event) =>
              update({ bpm: event.target.value === '' ? undefined : Number(event.target.value) })
            }
            inputProps={{ min: 20, max: 320 }}
            variant="outlined"
            sx={{ width: 100 }}
          />
          <TextField
            label="Time"
            value={draft.timeSignature ?? ''}
            onChange={(event) => update({ timeSignature: event.target.value || undefined })}
            placeholder="4/4"
            variant="outlined"
            sx={{ width: 100 }}
          />
          <TextField
            label="Length"
            value={draft.duration ?? ''}
            onChange={(event) => update({ duration: event.target.value || undefined })}
            placeholder="4:28"
            variant="outlined"
            sx={{ width: 110 }}
          />
        </Stack>

        {suggestedKey && !draft.key && (
          <Alert
            severity="info"
            action={
              <Button size="small" onClick={() => update({ key: suggestedKey.key })}>
                Use {suggestedKey.key}
              </Button>
            }
          >
            These chords look like they are in {suggestedKey.key}
            {suggestedKey.alternatives.length > 0 && <> (or {suggestedKey.alternatives[0].key})</>}.
          </Alert>
        )}

        {outsideKey.length > 0 && (
          <Alert severity="warning">
            {outsideKey.length === 1
              ? `${outsideKey[0]} is not a chord in ${draft.key}.`
              : `${outsideKey.join(', ')} are not chords in ${draft.key}.`}{' '}
            That may be on purpose.
          </Alert>
        )}

        <Box sx={{ position: 'relative' }}>
          <TextField
            label="Song"
            placeholder="[Am]Type your song [C]here..."
            value={draft.content}
            onChange={(event) =>
              handleContentChange(event.target.value, event.target.selectionStart ?? 0)
            }
            onKeyDown={handleKeyDownInContent}
            onBlur={() => setAutocomplete(null)}
            inputRef={textareaRef}
            multiline
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '100%',
                minHeight: 220,
                alignItems: 'flex-start',
                fontFamily: 'monospace',
              },
            }}
            InputProps={{ sx: { fontFamily: 'monospace' } }}
          />

          {autocomplete && suggestions.length > 0 && (
            <Paper
              elevation={6}
              sx={{
                position: 'absolute',
                left: 16,
                top: 72,
                zIndex: 10,
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                minWidth: 220,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                Press Enter to use
              </Typography>
              {suggestions.map((chord) => (
                <Button
                  key={chord}
                  size="small"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    chooseChord(chord);
                  }}
                  sx={{ justifyContent: 'flex-start', fontFamily: 'monospace' }}
                >
                  {chord}
                </Button>
              ))}
            </Paper>
          )}
        </Box>

        {/* The song as it will read, so that writing is not writing blind. */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            As it will read
          </Typography>
          <Box
            sx={{
              p: 2,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              minHeight: 120,
              fontSize: '18px',
            }}
          >
            {draft.content.trim() ? (
              <SongBody lines={previewLines} displayMode="chords" songKey={draft.key ?? 'C'} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                The song will read like this as you write it.
              </Typography>
            )}
          </Box>
        </Box>

        <Divider />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sections
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 0.75 }}>
              {SECTION_DIRECTIVES.map((section) => (
                <Chip
                  key={section.directive}
                  label={section.label}
                  size="small"
                  variant="outlined"
                  onClick={() => insertAtCaret(`{${section.directive}}\n`)}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Transpose
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => {
                setTransposeTarget(draft.key ?? '');
                setTransposeOpen(true);
              }}
            >
              Move the song to another key
            </Button>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Metronome bpm={draft.bpm} onTempoChange={(bpm) => update({ bpm })} />
          </Box>
        </Stack>

        <Divider />

        <ChordPalette songKey={draft.key} onPick={(chord) => insertAtCaret(`[${chord}]`)} />

        <Divider />

        <TagEditor tags={draft.tags} onChange={(tags) => update({ tags })} />

        <TextField
          label="Notes"
          value={draft.notes ?? ''}
          onChange={(event) => update({ notes: event.target.value || undefined })}
          placeholder="Anything to remember when playing this"
          multiline
          minRows={2}
          variant="outlined"
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={onCancel}>
              Cancel
            </Button>

            {initialSong && onDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            )}
          </Stack>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            onClick={() => {
              void persist(draft);
            }}
          >
            Save Song
          </Button>
        </Stack>
      </Paper>

      {/* Delete confirmation */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth="xs">
        <DialogTitle>Delete this song?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            &ldquo;{draft.title}&rdquo; will be removed from your library. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmDelete(false);
              onDelete?.(songId.current);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Earlier versions */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Earlier versions</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {[...history.past].reverse().map((version, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {version.content.slice(0, 400) || '(empty)'}
                </Typography>
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    update({ content: version.content });
                    setHistoryOpen(false);
                  }}
                >
                  Use this version
                </Button>
              </Paper>
            ))}
            {history.past.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                There are no earlier versions yet.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Transpose the whole song */}
      <Dialog open={transposeOpen} onClose={() => setTransposeOpen(false)} maxWidth="xs">
        <DialogTitle>Move the song to another key</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="New key"
            value={transposeTarget}
            onChange={(event) => setTransposeTarget(event.target.value)}
            sx={{ mt: 1 }}
          >
            {KEYS.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransposeOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={applyTranspose}>
            Move it
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const blankSong = (): Song => ({
  id: '',
  title: '',
  artist: '',
  content: '',
  format: 'chordpro',
  tags: [],
  attribution: {
    sourceName: 'Your own song',
    sourceUrl: '',
    license: 'custom',
    verifiedBy: 'manual',
  },
  rightsStatus: 'open',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
