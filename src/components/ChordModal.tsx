import React, { useState } from 'react';
import { getChord } from '../data/chordLibrary';
import { ChordDiagram } from './ChordDiagram';

interface ChordModalProps {
    chordName: string;
    onClose: () => void;
}

export const ChordModal: React.FC<ChordModalProps> = ({ chordName, onClose }) => {
    const chord = getChord(chordName);
    const [selectedVariation, setSelectedVariation] = useState(0);

    if (!chord) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{chordName}</h2>
                        <button onClick={onClose} className="modal-close">&times;</button>
                    </div>
                    <div className="modal-body">
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                            No diagram available for this chord yet.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{chord.fullName}</h2>
                    <button onClick={onClose} className="modal-close">&times;</button>
                </div>

                <div className="modal-body">
                    <ChordDiagram
                        variation={chord.variations[selectedVariation]}
                        chordName={chord.name}
                    />

                    {chord.variations.length > 1 && (
                        <div className="variation-selector">
                            {chord.variations.map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedVariation(i)}
                                    className={selectedVariation === i ? 'active' : ''}
                                >
                                    {v.suffix || `Position ${i + 1}`}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
