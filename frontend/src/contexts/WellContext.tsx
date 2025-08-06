import React, { createContext, useContext, useReducer, useCallback, useRef, useMemo } from 'react';
import { uploadWellData } from '../api/uploadApi';
import { toastUtils } from '../utils/toastUtils';
import type { WellData } from '../types/well';

interface WellState {
  wells: WellData[];
  selectedWell: WellData | null;
  selectedDepth: number | null;
  selectedParameter: string | null;
  isLoading: boolean;
  error: string | null;
  hasUploadData: boolean;
  activeFilters: string[];
  zoomLevel: number; 
}

type WellAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WELLS'; payload: WellData[] }
  | { type: 'SELECT_WELL'; payload: WellData | null }
  | { type: 'SET_SELECTED_DEPTH'; payload: number | null }
  | { type: 'SET_SELECTED_PARAMETER'; payload: string | null }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_HAS_UPLOAD_DATA'; payload: boolean }
  | { type: 'ADD_FILTER'; payload: string }
  | { type: 'REMOVE_FILTER'; payload: string }
  | { type: 'CLEAR_ALL_FILTERS' }
  | { type: 'SET_ZOOM_LEVEL'; payload: number }; 

interface WellContextType {
  state: WellState;
  uploadFile: (file: File) => Promise<void>;
  selectWell: (wellId: string) => void;
  setSelectedDepth: (depth: number | null) => void;
  setSelectedParameter: (parameter: string | null) => void;
  clearSelection: () => void;
  clearUploadData: () => void;
  selectedDepthData: any;
  shouldShowDepthDetails: boolean;
  shouldShowNoDataMessage: boolean;
  addFilter: (parameter: string) => void;
  removeFilter: (parameter: string) => void;
  clearAllFilters: () => void;
  availableParameters: string[];
  setZoomLevel: (level: number) => void; 
  increaseZoom: () => void; 
  decreaseZoom: () => void;
  staticWells: WellData[];
  displayWells: WellData[];
}

const WellContext = createContext<WellContextType | undefined>(undefined);
const uploadCache = new Map<string, WellData[]>();
const wellCache = new Map<string, WellData>();

const STATIC_WELLS: WellData[] = [
  {
    id: 'static-well-a',
    name: 'Well A',
    depth: 5000,
    data: []
  },
  {
    id: 'static-well-aa',
    name: 'Well AA',
    depth: 4500,
    data: []
  },
  {
    id: 'static-well-aaa',
    name: 'Well AAA',
    depth: 5200,
    data: []
  },
  {
    id: 'static-well-b',
    name: 'Well B',
    depth: 4800,
    data: []
  }
];

const initialState: WellState = {
  wells: [],
  selectedWell: null,
  selectedDepth: null,
  selectedParameter: null,
  isLoading: false,
  error: null,
  hasUploadData: false,
  activeFilters: [],
  zoomLevel: 1, 
};

function wellReducer(state: WellState, action: WellAction): WellState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_WELLS':
      return { ...state, wells: action.payload };
    case 'SELECT_WELL':
      return { ...state, selectedWell: action.payload };
    case 'SET_SELECTED_DEPTH':
      return { ...state, selectedDepth: action.payload };
    case 'SET_SELECTED_PARAMETER':
      return { ...state, selectedParameter: action.payload };
    case 'CLEAR_SELECTION':
      return { 
        ...state, 
        selectedDepth: null, 
        selectedParameter: null 
      };
    case 'SET_HAS_UPLOAD_DATA':
      return { ...state, hasUploadData: action.payload };
    case 'ADD_FILTER':
      return {
        ...state,
        activeFilters: state.activeFilters.includes(action.payload)
          ? state.activeFilters
          : [...state.activeFilters, action.payload]
      };
    case 'REMOVE_FILTER':
      return {
        ...state,
        activeFilters: state.activeFilters.filter(filter => filter !== action.payload)
      };
    case 'CLEAR_ALL_FILTERS':
      return {
        ...state,
        activeFilters: []
      };
    case 'SET_ZOOM_LEVEL': 
      return {
        ...state,
        zoomLevel: action.payload
      };
    default:
      return state;
  }
}

export function WellProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wellReducer, initialState);
  
  const depthTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastDepthRef = useRef<number | null>(null);
  const displayWells = useMemo(() => {
    return state.hasUploadData ? state.wells : STATIC_WELLS;
  }, [state.hasUploadData, state.wells]);

  const selectedDepthData = useMemo(() => {
    if (!state.selectedWell || !state.selectedDepth) return null;
    return state.selectedWell.data.find(point => point.depth === state.selectedDepth) || null;
  }, [state.selectedWell, state.selectedDepth]);

  const shouldShowDepthDetails = useMemo(() => 
    Boolean(state.selectedDepth && selectedDepthData), 
    [state.selectedDepth, selectedDepthData]
  );

  const shouldShowNoDataMessage = useMemo(() => 
    Boolean(!state.selectedWell && !state.isLoading),
    [state.selectedWell, state.isLoading]
  );

  const availableParameters = useMemo(() => {
    if (!state.selectedWell || state.selectedWell.data.length === 0) return [];
    
    const firstPoint = state.selectedWell.data[0];
    return Object.keys(firstPoint).filter(key => 
      key !== 'depth' && 
      typeof firstPoint[key as keyof typeof firstPoint] === 'number'
    );
  }, [state.selectedWell]);

  const setZoomLevel = useCallback((level: number) => {
    dispatch({ type: 'SET_ZOOM_LEVEL', payload: level });
  }, []);

  const increaseZoom = useCallback(() => {
    const currentZoom = state.zoomLevel;
    if (currentZoom === 1) {
      setZoomLevel(1.5);
      toastUtils.zoom.increased('1.5x');
    } else if (currentZoom === 1.5) {
      setZoomLevel(2);
      toastUtils.zoom.increased('2x');
    } else {
      toastUtils.zoom.maxReached();
    }
  }, [state.zoomLevel, setZoomLevel]);

  const decreaseZoom = useCallback(() => {
    const currentZoom = state.zoomLevel;
    if (currentZoom === 2) {
      setZoomLevel(1.5);
      toastUtils.zoom.decreased('1.5x');
    } else if (currentZoom === 1.5) {
      setZoomLevel(1);
      toastUtils.zoom.decreased('1x');
    } else {
      toastUtils.zoom.minReached();
    }
  }, [state.zoomLevel, setZoomLevel]);

  const uploadFile = useCallback(async (file: File) => {
    if (!file) return;

    uploadCache.clear();
    wellCache.clear();
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await uploadWellData(file);
      
      if (response.success && response.wells) {
        response.wells.forEach(well => {
          wellCache.set(well.id, well);
        });
        
        dispatch({ type: 'SET_WELLS', payload: response.wells });
        dispatch({ type: 'SET_HAS_UPLOAD_DATA', payload: true });
        if (response.wells.length > 0) {
          dispatch({ type: 'SELECT_WELL', payload: response.wells[0] });
        }
        toastUtils.upload.success();
      } else {
        throw new Error(response.message || 'Upload error');
      }
    } catch (err) {
      console.error(' Upload error:', err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Error uploading file' });
      toastUtils.upload.error();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const selectWell = useCallback((wellId: string) => {
    // Se não há dados de upload, não permite selecionar wells estáticos
    if (!state.hasUploadData) {
      toastUtils.well.uploadRequired();
      return;
    }

    const cachedWell = wellCache.get(wellId);
    if (cachedWell) {
      dispatch({ type: 'SELECT_WELL', payload: cachedWell });
      toastUtils.well.selected(cachedWell.name);
      return;
    }
    
    const currentWell = state.wells.find(well => well.id === wellId);
    if (currentWell) {
      wellCache.set(wellId, currentWell);
      dispatch({ type: 'SELECT_WELL', payload: currentWell });
      toastUtils.well.selected(currentWell.name);
    } else {
      toastUtils.well.notFound();
    }
  }, [state.wells, state.hasUploadData]);

  const setSelectedDepth = useCallback((depth: number | null) => {
    if (lastDepthRef.current === depth) {
      return;
    }
    
    lastDepthRef.current = depth;
    
    if (depthTimeoutRef.current) {
      clearTimeout(depthTimeoutRef.current);
    }
    
    depthTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'SET_SELECTED_DEPTH', payload: depth });
    }, 300);
  }, []);

  const setSelectedParameter = useCallback((parameter: string | null) => {
    dispatch({ type: 'SET_SELECTED_PARAMETER', payload: parameter });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const addFilter = useCallback((parameter: string) => {
    dispatch({ type: 'ADD_FILTER', payload: parameter });
    toastUtils.filter.added(parameter);
  }, []);

  const removeFilter = useCallback((parameter: string) => {
    dispatch({ type: 'REMOVE_FILTER', payload: parameter });
    toastUtils.filter.removed(parameter);
  }, []);

  const clearAllFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_FILTERS' });
    toastUtils.filter.allRemoved();
  }, []);

  const clearUploadData = useCallback(() => {
    dispatch({ type: 'SET_WELLS', payload: [] });
    dispatch({ type: 'SELECT_WELL', payload: null });
    dispatch({ type: 'SET_SELECTED_DEPTH', payload: null });
    dispatch({ type: 'SET_SELECTED_PARAMETER', payload: null });
    dispatch({ type: 'CLEAR_ALL_FILTERS' });
    dispatch({ type: 'SET_HAS_UPLOAD_DATA', payload: false });
    dispatch({ type: 'SET_ERROR', payload: null });
    uploadCache.clear();
    wellCache.clear();
    toastUtils.upload.dataCleared();
  }, []);

  const value = {
    state,
    uploadFile,
    selectWell,
    setSelectedDepth,
    setSelectedParameter,
    clearSelection,
    clearUploadData,
    selectedDepthData,
    shouldShowDepthDetails,
    shouldShowNoDataMessage,
    addFilter,
    removeFilter,
    clearAllFilters,
    availableParameters,
    setZoomLevel, 
    increaseZoom, 
    decreaseZoom,
    staticWells: STATIC_WELLS,
    displayWells,
  };

  return (
    <WellContext.Provider value={value}>
      {children}
    </WellContext.Provider>
  );
}

export function useWellContext() {
  const context = useContext(WellContext);
  if (context === undefined) {
    throw new Error('useWellContext must be used within a WellProvider');
  }
  return context;
}
