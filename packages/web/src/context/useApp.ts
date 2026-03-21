import { useContext } from 'react';
import { AppContext } from './AppContext';
import type { AppContextType } from './types';

// Hook to access context
export function useApp(): AppContextType {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}