export const getParameterName = (param: string): string => {
  const names: Record<string, string> = {
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
  };
  return names[param] || param;
};

export const getParameterColor = (param: string): string => {
  const colors: Record<string, string> = {
    DT: '#FF6B6B',
    GR: '#4ECDC4',
    MINFINAL: '#45B7D1',
    UCS: '#96CEB4',
    FA: '#FFEAA7',
    RAT: '#DDA0DD',
    ROP: '#98D8C8',
    SH: '#FF69B4',
    SS: '#4169E1',
    LS: '#FFD700',
    DOL: '#00CED1',
    ANH: '#800080',
    Coal: '#FFA500',
    Salt: '#D3D3D3'
  };
  return colors[param] || '#8884d8';
};

export const getCompositionColors = () => ({
  SH: '#FF69B4',
  SS: '#4169E1',
  LS: '#FFD700',
  DOL: '#00CED1',
  ANH: '#800080',
  Coal: '#FFA500',
  Salt: '#D3D3D3',
});

export const getLegendName = (key: string): string => {
  const names: Record<string, string> = {
    SH: 'SH (Shale)',
    SS: 'SS (Sandstone)',
    LS: 'LS (Limestone)',
    DOL: 'DOL (Dolomite)',
    ANH: 'ANH (Anhydrite)',
    Coal: 'Coal',
    Salt: 'Salt'
  };
  return names[key] || key;
}; 