import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FILTER_CONFIG, PARAMETER_NAMES } from '../constants/filterConstants';
import { toastUtils } from '../utils/toastUtils';
import type { FilterDropdownProps, FilterDropdownState, FilterDropdownActions } from '../types/filter';

export const useFilterDropdown = ({ 
  availableParameters, 
  activeFilters, 
  onAddFilter 
}: Omit<FilterDropdownProps, 'onRemoveFilter'>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get parameter display name
  const getParameterName = useCallback((param: string) => {
    return PARAMETER_NAMES[param] || param;
  }, []);

  // Calculate derived state
  const state: FilterDropdownState = useMemo(() => ({
    isOpen,
    canAddFilter: activeFilters.length < FILTER_CONFIG.MAX_FILTERS,
    availableFilters: availableParameters.filter(param => !activeFilters.includes(param)),
    maxFilters: FILTER_CONFIG.MAX_FILTERS
  }), [isOpen, activeFilters, availableParameters]);

  // Actions
  const handleFilterSelect = useCallback((parameter: string) => {
    if (state.canAddFilter) {
      onAddFilter(parameter);
      setIsOpen(false);
    } else {
      toastUtils.filter.maxReached();
    }
  }, [state.canAddFilter, onAddFilter]);

  const toggleDropdown = useCallback(() => {
    if (!state.canAddFilter && !isOpen) {
      toastUtils.filter.maxReached();
      return;
    }
    setIsOpen(!isOpen);
  }, [isOpen, state.canAddFilter]);

  const actions: FilterDropdownActions = {
    toggleDropdown,
    handleFilterSelect,
    setIsOpen
  };

  return {
    state,
    actions,
    dropdownRef,
    getParameterName
  };
}; 