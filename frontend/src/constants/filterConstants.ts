export const FILTER_CONFIG = {
  MAX_FILTERS: 2,
  DROPDOWN_WIDTH: 'w-64',
  DROPDOWN_MAX_HEIGHT: 'max-h-60'
} as const;

export const PARAMETER_NAMES: Record<string, string> = {
  DT: 'DT (Delta Time)',
  GR: 'GR (Gamma Ray)',
  MINFINAL: 'MINFINAL',
  UCS: 'UCS (Unconfined Compressive Strength)',
  FA: 'FA (Friction Angle)',
  RAT: 'RAT',
  ROP: 'ROP (Rate of Penetration)',
  SH: 'SH (Shale)',
  SS: 'SS (Sandstone)',
  LS: 'LS (Limestone)',
  DOL: 'DOL (Dolomite)',
  ANH: 'ANH (Anhydrite)',
  Coal: 'Coal',
  Salt: 'Salt'
} as const;

export const FILTER_BUTTON_STYLES = {
  enabled: 'flex items-center p-2 lg:p-1 rounded text-white text-sm gap-2 lg:px-4 cursor-pointer bg-green-500 hover:bg-green-600',
  disabled: 'flex items-center p-2 lg:p-1 rounded text-white text-sm gap-2 lg:px-4 cursor-pointer bg-gray-400 cursor-not-allowed'
} as const;

export const FILTER_MESSAGES = {
  maxFiltersReached: 'Maximum filters reached',
  maxFiltersDescription: 'You can only have 2 additional charts (3 total). Remove a filter to add another.',
  uploadFilePrompt: 'Upload the file to be able to filter information.',
  selectParameter: 'Select Parameter'
} as const; 