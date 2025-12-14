import React, { useState } from 'react';
import { getChord } from '../data/chordLibrary';
import { ChordDiagram } from './ChordDiagram';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    ToggleButton,
    ToggleButtonGroup,
    useMediaQuery,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ChordModalProps {
    chordName: string;
    onClose: () => void;
}

export const ChordModal: React.FC<ChordModalProps> = ({ chordName, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const chord = getChord(chordName);
    const [selectedVariation, setSelectedVariation] = useState(0);

    const handleVariationChange = (_: React.MouseEvent<HTMLElement>, newVariation: number | null) => {
        if (newVariation !== null) {
            setSelectedVariation(newVariation);
        }
    };

    if (!chord) {
        return (
            <Dialog open={true} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {chordName}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                        No diagram available for this chord yet.
                    </Typography>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={true}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: fullScreen ? 0 : 2 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                    {chord.fullName}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <Box sx={{ mb: 4, minHeight: 280, display: 'flex', alignItems: 'center' }}>
                    <ChordDiagram
                        variation={chord.variations[selectedVariation]}
                        chordName={chord.name}
                    />
                </Box>

                {chord.variations.length > 1 && (
                    <ToggleButtonGroup
                        value={selectedVariation}
                        exclusive
                        onChange={handleVariationChange}
                        aria-label="chord variation"
                        size="small"
                        sx={{
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 0.5,
                            '& .MuiToggleButton-root': {
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                px: 2,
                                py: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.soft',
                                    color: 'primary.main',
                                    fontWeight: 'bold'
                                }
                            }
                        }}
                    >
                        {chord.variations.map((v, i) => (
                            <ToggleButton key={i} value={i} disableRipple>
                                {v.suffix || `Var ${i + 1}`}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                )}
            </DialogContent>
        </Dialog>
    );
};
