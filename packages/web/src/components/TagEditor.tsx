import React, { useState } from 'react';
import { Box, Chip, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface TagEditorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  /** Shown under the field, e.g. to explain where tags come from. */
  helperText?: string;
  label?: string;
}

/**
 * Edit the tags on a song.
 *
 * Tags are free text, normalised to lower case so "Worship" and "worship" are
 * the same tag.
 */
export const TagEditor: React.FC<TagEditorProps> = ({
  tags,
  onChange,
  helperText,
  label = 'Tags',
}) => {
  const [draft, setDraft] = useState('');

  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-');

  const addTag = (value: string) => {
    const tag = normalize(value);
    if (!tag || tags.includes(tag)) {
      setDraft('');
      return;
    }
    onChange([...tags, tag]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((existing) => existing !== tag));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === 'Backspace' && !draft && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            onDelete={() => removeTag(tag)}
            deleteIcon={
              <IconButton
                size="small"
                aria-label={`Remove tag ${tag}`}
                sx={{ p: 0.25, color: 'inherit' }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            }
          />
        ))}
        {tags.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No tags yet.
          </Typography>
        )}
      </Box>
      <TextField
        size="small"
        fullWidth
        placeholder="Add a tag and press Enter"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
        inputProps={{ 'aria-label': 'Add a tag' }}
        helperText={helperText}
      />
    </Box>
  );
};
