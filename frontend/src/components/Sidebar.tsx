import { useWellContext } from '../contexts/WellContext';

function Sidebar() {
  const { 
    state: { wells, selectedWell, isLoading, hasUploadData },
    selectWell,
    clearUploadData
  } = useWellContext();

  const handleWellSelect = (wellId: string) => {
    selectWell(wellId);
  };

  const handleBackClick = () => {
    clearUploadData();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex py-10 px-4 border-b border-gray-200 flex-row justify-between items-center">
        <h1 className="font-semibold">Well List</h1>
        {hasUploadData && (
          <div 
            className="bg-gray-100 rounded p-1 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={handleBackClick}
            title="Return to static data"
          >
            ←
          </div>
        )}
      </div>
      <div className="flex py-4 px-8 flex-col">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading wells...</p>
          </div>
        ) : (
          <>
            <div className=" flex flex-col gap-1">
              <div className='flex flex-col hover:bg-gray-100 rounded w-full p-2 cursor-pointer'>
                <h1 className='font-semibold'>Well A</h1>
                <h5 className='text-sm text-gray-400'>Depth: 5000 ft</h5>
              </div>
              <div className='flex flex-col hover:bg-gray-100 rounded w-full p-2 cursor-pointer'>
                <h1 className='font-semibold'>Well AA</h1>
                <h5 className='text-sm text-gray-400'>Depth: 4500 ft</h5>
              </div>
              <div className='flex flex-col hover:bg-gray-100 rounded w-full p-2 cursor-pointer'>
                <h1 className='font-semibold'>Well AAA</h1>
                <h5 className='text-sm text-gray-400'>Depth: 5200 ft</h5>
              </div>
              <div className='flex flex-col hover:bg-gray-100 rounded w-full p-2 cursor-pointer'>
                <h1 className='font-semibold'>Well B</h1>
                <h5 className='text-sm text-gray-400'>Depth: 4800 ft</h5>
              </div>
              {hasUploadData && wells.length > 0 && (
              <div className="">
                {wells.map((well) => (
                  <div 
                    key={well.id}
                    onClick={() => handleWellSelect(well.id)}
                    className={`flex flex-col cursor-pointer hover:bg-gray-100 rounded w-full p-2 mb-2 ${
                      selectedWell?.id === well.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <h5 className="flex font-semibold">{well.name}</h5>
                    <p className="flex text-sm text-gray-400">Depth: {well.depth} ft</p>
                  </div>
                ))}
              </div>
            )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar
