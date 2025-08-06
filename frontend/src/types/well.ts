export interface WellData {
  id: string;
  name: string;
  depth: number;
  data: WellDataPoint[];
}

export interface WellDataPoint {
  depth: number;
  SH: number; 
  SS: number; 
  LS: number; 
  DOL: number; 
  ANH: number; 
  Coal: number;
  Salt: number;
  DT: number; 
  GR: number; 
  MINFINAL: number;
  UCS: number;
  FA: number; 
  RAT: number; 
  ROP: number; 
}

export interface UploadResponse {
  success: boolean;
  message: string;
  wellId?: string;
  wells?: WellData[];
}

export interface RockComposition {
  depth: number;
  SH: number;
  SS: number;
  LS: number;
  DOL: number;
  ANH: number;
  Coal: number;
  Salt: number;
}

export interface ChartData {
  depth: number;
  value: number;
  type: string;
} 