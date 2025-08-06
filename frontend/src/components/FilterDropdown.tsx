import React from 'react';
import { useFilterDropdown } from '../hooks/useFilterDropdown';
import { FILTER_CONFIG, FILTER_BUTTON_STYLES, FILTER_MESSAGES } from '../constants/filterConstants';
import type { FilterDropdownProps } from '../types/filter';

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  availableParameters,
  activeFilters,
  onAddFilter
}) => {
  const { state, actions, dropdownRef, getParameterName } = useFilterDropdown({
    availableParameters,
    activeFilters,
    onAddFilter
  });

  const buttonClasses = state.canAddFilter 
    ? FILTER_BUTTON_STYLES.enabled
    : FILTER_BUTTON_STYLES.disabled;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={actions.toggleDropdown}
        className={buttonClasses}
        disabled={!state.canAddFilter}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="hidden lg:inline">Filter</span>
        {activeFilters.length > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
            {activeFilters.length}/{state.maxFilters}
          </span>
        )}
      </button>

      {state.isOpen && (
        <div className={`absolute top-full right-4 mt-0 ${FILTER_CONFIG.DROPDOWN_WIDTH} bg-white border border-gray-300 rounded-md shadow-lg z-50 ${FILTER_CONFIG.DROPDOWN_MAX_HEIGHT} overflow-y-auto`}>
          <div className="p-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {FILTER_MESSAGES.selectParameter}
            </h3>
            
            {!state.canAddFilter ? (
              <div className="text-sm text-gray-500 py-2">
                <p className="font-semibold text-orange-600 mb-1">
                  {FILTER_MESSAGES.maxFiltersReached}
                </p>
                <p>{FILTER_MESSAGES.maxFiltersDescription}</p>
              </div>
            ) : state.availableFilters.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">
                {FILTER_MESSAGES.uploadFilePrompt}
              </p>
            ) : (
              <div className="space-y-1">
                {state.availableFilters.map((parameter) => (
                  <button
                    key={parameter}
                    onClick={() => actions.handleFilterSelect(parameter)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center justify-between"
                  >
                    <span>{getParameterName(parameter)}</span>
                    <span className="text-xs text-gray-500">{parameter}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown; 