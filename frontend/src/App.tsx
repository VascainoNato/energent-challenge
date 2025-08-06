import { useState } from 'react'
import './App.css'
import Header from '../src/components/Header'
import Content from './components/Content'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import { WellProvider } from './contexts/WellContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'wells' | 'chat'>('main');

  const handleNavigate = (page: 'wells' | 'chat' | 'main') => {
    setCurrentPage(page);
  };

  console.log('teste')
  const renderMobileContent = () => {
    switch (currentPage) {
      case 'wells':
        return (
          <div className='w-full h-full bg-white'>
            <Sidebar/>
          </div>
        );
      case 'chat':
        return (
          <div className='w-full h-full bg-white'>
            <Chat/>
          </div>
        );
      default:
        return (
          <div className='w-full h-full bg-white'>
            <Content/>
          </div>
        );
    }
  };

  return (
    <WellProvider>
      <div className='flex flex-col h-screen'>
        <Header onNavigate={handleNavigate} />
        <div className='flex flex-row flex-grow'>
          <div className='hidden lg:flex md:w-1/2 md:border-r md:border-gray-200 lg:w-1/4 xl:w-1/6'>
            <Sidebar/>
          </div>
          <div className='hidden lg:flex flex-grow'>
            <Content/>
          </div>
          <div className='hidden lg:flex md:w-1/3 md:border-gray-200'>
            <Chat/>
          </div>
          <div className='lg:hidden w-full h-full'>
            {renderMobileContent()}
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </WellProvider>
  )
}

export default App
