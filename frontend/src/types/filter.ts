export interface FilterDropdownProps {
  availableParameters: string[];
  activeFilters: string[];
  onAddFilter: (parameter: string) => void;
  onRemoveFilter: (parameter: string) => void;
}

export interface FilterDropdownState {
  isOpen: boolean;
  canAddFilter: boolean;
  availableFilters: string[];
  maxFilters: number;
}

export interface FilterDropdownActions {
  setIsOpen: (isOpen: boolean) => void;
  handleFilterSelect: (parameter: string) => void;
  toggleDropdown: () => void;
} 