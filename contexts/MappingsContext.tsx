import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Mapping } from '../types';

interface MappingsContextType {
  mappings: Mapping[];
  addMapping: (mapping: Mapping) => void;
  basePath: string;
  isLoading: boolean;
}

const MappingsContext = createContext<MappingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'content-embedder-mappings';

export const MappingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [basePath, setBasePath] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedMappings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedMappings) {
        setMappings(JSON.parse(storedMappings));
      }
    } catch (error) {
      console.error("Failed to load mappings from local storage", error);
    } finally {
      setIsLoading(false);
    }
    
    setBasePath(`${window.location.origin}${window.location.pathname}#`);
  }, []);

  useEffect(() => {
    if (!isLoading) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mappings));
        } catch (error) {
            console.error("Failed to save mappings to local storage", error);
        }
    }
  }, [mappings, isLoading]);

  const addMapping = useCallback((newMapping: Mapping) => {
    const sanitizedPath = newMapping.path.replace(/^\/|\/$/g, '');
    
    if(!sanitizedPath) {
        alert("Path cannot be empty.");
        return;
    }
    
    setMappings(prevMappings => {
      const existingMappingIndex = prevMappings.findIndex(m => m.path === sanitizedPath);
      const mappingToAdd = { ...newMapping, path: sanitizedPath };
      if (existingMappingIndex > -1) {
        const updatedMappings = [...prevMappings];
        updatedMappings[existingMappingIndex] = mappingToAdd;
        return updatedMappings;
      }
      return [...prevMappings, mappingToAdd];
    });
  }, []);

  return (
    <MappingsContext.Provider value={{ mappings, addMapping, basePath, isLoading }}>
      {children}
    </MappingsContext.Provider>
  );
};

export const useMappings = (): MappingsContextType => {
  const context = useContext(MappingsContext);
  if (context === undefined) {
    throw new Error('useMappings must be used within a MappingsProvider');
  }
  return context;
};
