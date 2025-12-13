import React, { useMemo } from 'react';
import { getChordNotes } from '../lib/staffNotation';

interface ChordStaffProps {
    chord: string;
    width?: number;
    height?: number;
}

export const ChordStaff: React.FC<ChordStaffProps> = React.memo(({ chord, width = 60 }) => {
    // Memoize notes calculation to prevent unnecessary recalculations
    const notes = useMemo(() => {
        if (!chord) return [];
        try {
            return getChordNotes(chord);
        } catch (error) {
            console.warn(`Failed to get notes for chord: ${chord}`, error);
            return [];
        }
    }, [chord]);

    // Early return if no valid notes
    if (!notes || notes.length === 0) return null;

    // Staff metrics
    // Formula: Y = Line1_Y - ( (Pos - 2) * (Spacing / 2) )
    const lineSpacing = 8; // Tighter, but still readable (compromise)
    const staffTop = 10;
    const staffBottom = staffTop + (lineSpacing * 4); // 10 + 32 = 42
    const totalHeight = staffBottom + 10; // 52px total height

    // Y position calculation
    const getNoteY = (pos: number): number => {
        if (typeof pos !== 'number' || isNaN(pos)) return staffBottom;
        return staffBottom - ((pos - 2) * (lineSpacing / 2));
    };

    return (
        <svg
            width={width}
            height={totalHeight}
            viewBox={`0 0 ${width} ${totalHeight}`}
            style={{ overflow: 'visible', verticalAlign: 'bottom' }} // align bottom
        >
            {/* Staff Lines */}
            {[0, 1, 2, 3, 4].map(i => (
                <line
                    key={`line-${i}`}
                    x1={0}
                    y1={staffBottom - (i * lineSpacing)}
                    x2={width}
                    y2={staffBottom - (i * lineSpacing)}
                    stroke="#666"
                    strokeWidth="1.5"
                />
            ))}

            {/* Notes */}
            {notes.map((note, idx) => {
                const y = getNoteY(note.position);
                const x = width / 2; // Center in the width provided

                if (isNaN(y) || isNaN(x)) return null;

                const showLedger = note.position <= 0 || note.position >= 12;
                const accSymbol = note.accidental === 'sharp' ? '♯' : (note.accidental === 'flat' ? '♭' : '');

                return (
                    <g key={`note-${idx}`}>
                        {showLedger && (
                            <line
                                x1={x - 9}
                                y1={y}
                                x2={x + 9}
                                y2={y}
                                stroke="#888"
                                strokeWidth="1.5"
                            />
                        )}
                        <ellipse
                            cx={x}
                            cy={y}
                            rx={3.5}
                            ry={2.5}
                            fill="var(--text-primary)"
                            stroke="none"
                        />

                        {accSymbol && (
                            <text
                                x={x - 12}
                                y={y + 4}
                                fontSize={12}
                                fill="var(--primary-color)"
                                fontWeight="bold"
                            >{accSymbol}</text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
});
