import type { WellData, UploadResponse } from '../types/well';

// XLSX file upload
export async function uploadWellData(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/upload/well-data", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("HTTP Error:", errorText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const response = await res.json();
    return response;
  } catch (error) {
    console.error('Error uploading:', error);
    throw error;
  }
}

// Search for data from a specific well
export async function getWellData(wellId: string): Promise<WellData> {
  try {
    const res = await fetch(`http://localhost:5000/api/wells/${wellId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const response = await res.json();
    return response;
  } catch (error) {
    console.error('Error fetching well data:', error);
    throw error;
  }
}

// List all wells
export async function getWellsList(): Promise<WellData[]> {
  try {
    const res = await fetch("http://localhost:5000/api/wells", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const response = await res.json();
    return response;
  } catch (error) {
    console.error('Error fetching list of wells:', error);
    throw error;
  }
} 