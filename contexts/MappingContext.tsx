
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Mapping } from '../types';

interface MappingContextType {
  mappings: Mapping[];
  addMapping: (path: string, targetUrl: string) => void;
  removeMapping: (id: string) => void;
}

const MappingContext = createContext<MappingContextType | undefined>(undefined);

export const MappingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mappings, setMappings] = useState<Mapping[]>([
      { id: '1', path: '/example', targetUrl: 'https://example.com' },
      { id: '2', path: '/react-docs', targetUrl: 'https://react.dev' },
  ]);

  const addMapping = useCallback((path: string, targetUrl: string) => {
    const newPath = path.startsWith('/') ? path : `/${path}`;
    const newMapping: Mapping = { id: Date.now().toString(), path: newPath, targetUrl };
    setMappings(prev => [newMapping, ...prev.filter(m => m.path !== newPath)]);
  }, []);
  
  const removeMapping = useCallback((id: string) => {
    setMappings(prev => prev.filter(m => m.id !== id));
  }, []);

  return (
    <MappingContext.Provider value={{ mappings, addMapping, removeMapping }}>
      {children}
    </MappingContext.Provider>
  );
};

export const useMappings = (): MappingContextType => {
  const context = useContext(MappingContext);
  if (!context) {
    throw new Error('useMappings must be used within a MappingProvider');
  }
  return context;
};
