import { useRef, useCallback } from 'react';
import Zoom from '../assets/zoom-in.png';
import ZoomOut from '../assets/zoom-out.png';
import Upload from '../assets/upload.png';
import { useWellContext } from '../contexts/WellContext';
import UnifiedChart from './charts/UnifiedChart';
import FilterChart from './charts/FilterChart';
import FilterDropdown from './FilterDropdown';

function Content() {
  const { 
    state: { selectedWell, isLoading, error, selectedDepth, selectedParameter, activeFilters, zoomLevel, hasUploadData },
    uploadFile,
    setSelectedDepth,
    setSelectedParameter,
    selectedDepthData,
    shouldShowDepthDetails,
    addFilter,
    removeFilter,
    availableParameters,
    increaseZoom,
    decreaseZoom,
    clearUploadData,
  } = useWellContext(); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClearUpload = useCallback(() => {
    clearUploadData();
  }, [clearUploadData]);

  const handleDepthSelect = useCallback((depth: number) => {
    setSelectedDepth(depth);
  }, [setSelectedDepth]);

  const handleParameterSelect = useCallback((parameter: string) => {
    setSelectedParameter(parameter);
  }, [setSelectedParameter]);

  const handleAddFilter = useCallback((parameter: string) => {
    addFilter(parameter);
  }, [addFilter]);

  const handleRemoveFilter = useCallback((parameter: string) => {
    removeFilter(parameter);
  }, [removeFilter]);

  const handleZoomIn = useCallback(() => {
    increaseZoom();
  }, [increaseZoom]);

  const handleZoomOut = useCallback(() => {
    decreaseZoom();
  }, [decreaseZoom]);

  const getMainChartClasses = () => {
    if (activeFilters.length === 0) return 'w-full';
    if (activeFilters.length === 1) return 'lg:w-1/2';
    return 'lg:w-1/3';
  };

  const getFilterContainerClasses = () => {
    if (activeFilters.length === 0) return 'hidden';
    if (activeFilters.length === 1) return 'lg:w-1/2';
    return 'lg:w-2/3';
  };

  return (
    <div className="flex w-full flex-col h-full outline-none">
      <div className="flex w-full flex-row border-b border-gray-200 p-2 justify-between">
        <div className="flex w-full flex-row">
          <div className="flex gap-1 lg:gap-4 items-center">
            {hasUploadData && (
               <><h1 className="font-semibold text-sm md:text-regular">Well Overview</h1><button
                onClick={handleClearUpload}
                className="text-red-600 font-semibold cursor-pointer hover:text-red-800"
                title="Clear upload data and return to static wells"
              >
                ×
              </button></>
            )}
            {activeFilters.length > 0 && (
              <div className="flex gap-2">
                {activeFilters.map((filter) => (
                  <div key={filter} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold">
                    <span>{filter}</span>
                    <button
                      onClick={() => handleRemoveFilter(filter)}
                      className="text-red-600 font-semibold cursor-pointer hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {activeFilters.length === 2 && (
                  <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded text-xs text-orange-700">
                    <span>Max filters (2/2)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full gap-2 xl:gap-10 justify-end xl:pr-4 lg:pr-2">
          <div className='hidden lg:flex items-center gap-4'>
            <FilterDropdown
              availableParameters={availableParameters}
              activeFilters={activeFilters}
              onAddFilter={handleAddFilter}
              onRemoveFilter={handleRemoveFilter}
            />
            <button 
              onClick={handleUploadClick}
              className='flex items-center p-2 lg:p-1 rounded text-white text-sm gap-2 md:justify-center md:px-5 lg:px-6 cursor-pointer bg-blue-500 hover:bg-blue-600'
            >
              <img src={Upload} alt="upload" className='h-4'/>Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div className='flex lg:hidden items-center gap-4 pr-2'>
            <FilterDropdown
              availableParameters={availableParameters}
              activeFilters={activeFilters}
              onAddFilter={handleAddFilter}
              onRemoveFilter={handleRemoveFilter}
            />
            <button 
              onClick={handleUploadClick}
              className='flex items-center bg-blue-500 p-2 rounded text-white text-sm gap-2 px-2 cursor-pointer'
            >
              <img src={Upload} alt="upload" className='h-4'/>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div className="hidden md:flex items-center gap-1">
            <button 
              onClick={handleZoomOut}
              disabled={zoomLevel === 1}
              className={`flex items-center justify-center w-6 h-6 rounded ${
                zoomLevel === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-gray-100'
              }`}
            >
              <img src={ZoomOut} alt="zoom-out" className='w-6'/>
            </button>
            <p className="text-sm font-medium min-w-[2rem] text-center">{zoomLevel === 1.5 ? '1.5x' : `${zoomLevel}x`}</p>
            <button 
              onClick={handleZoomIn}
              disabled={zoomLevel === 2}
              className={`flex items-center justify-center w-6 h-6 rounded ${
                zoomLevel === 2 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-gray-100'
              }`}
            >
              <img src={Zoom} alt="zoom-in" className='w-6'/>
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="p-4 text-center">
          <p>Loading data...</p>
        </div>
      )}

      {selectedWell && selectedWell.data.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          <div className={getMainChartClasses()}>
            <UnifiedChart
              data={selectedWell.data}
              selectedDepth={selectedDepth || undefined}
              onDepthSelect={handleDepthSelect}
              onParameterSelect={handleParameterSelect}
              selectedParameter={selectedParameter}
              zoomLevel={zoomLevel}
            />
          </div>

          {activeFilters.length > 0 && (
            <div className={`${getFilterContainerClasses()} space-y-4`}>
              {activeFilters.length === 2 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeFilters.map((filter) => (
                    <FilterChart
                      key={filter}
                      data={selectedWell.data}
                      parameter={filter}
                      onRemove={handleRemoveFilter}
                      zoomLevel={zoomLevel}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {activeFilters.map((filter) => (
                    <FilterChart
                      key={filter}
                      data={selectedWell.data}
                      parameter={filter}
                      onRemove={handleRemoveFilter}
                      zoomLevel={zoomLevel}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {shouldShowDepthDetails && (
        <div className="p-4 bg-gray-50 border-t">
          <h3 className="font-semibold mb-2">Depth Details: {selectedDepth} ft</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(selectedDepthData as Record<string, any>).map(([key, value]) => (
              <div key={key} className="bg-white p-2 rounded border">
                <p className="text-sm font-medium">{key}</p>
                <p className="text-lg">{typeof value === 'number' ? value.toFixed(3) : value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedWell && !isLoading && (
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              {hasUploadData 
                ? "No well selected. Please select a well from the sidebar." 
                : "Upload an XLSX file to view the data"
              }
            </p>
            {!hasUploadData && (
              <button 
                onClick={handleUploadClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Content

