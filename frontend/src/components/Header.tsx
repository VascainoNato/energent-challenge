import { useState, useRef, useEffect } from 'react'
import Logo from '../assets/logo.png'
import Hamburger from '../assets/hamburger.png'

interface HamburgerMenuProps {
  onNavigate: (page: 'wells' | 'chat' | 'main') => void;
}

function Header({ onNavigate }: HamburgerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (page: 'wells' | 'chat' | 'main') => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className="flex border-b border-gray-200 md:justify-normal w-full h-20 items-center md:px-2 relative z-50">
        <img 
          src={Hamburger} 
          alt="menu" 
          className='flex h-8 pl-6 lg:hidden cursor-pointer hover:opacity-70 transition-opacity'
          onClick={toggleMenu}
        />
        <div className='flex items-center'>
          <img src={Logo} alt="logo" className='h-12 md:h-16'/>
          <h1 className='font-semibold'>Drill AI Intelligence Platform</h1>
        </div>
      </div>

      {/* Overlay com blur para o fundo quando menu está aberto */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-white/20 z-30 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Menu hambúrguer deslizante */}
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full border-r border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col p-6 space-y-4">
            <button
              onClick={() => handleMenuItemClick('main')}
              className="flex items-center p-4 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-sm font-semibold">H</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Home</h3>
                <p className="text-sm text-gray-500">Home page with charts</p>
              </div>
            </button>

            <button
              onClick={() => handleMenuItemClick('chat')}
              className="flex items-center p-4 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-sm font-semibold">C</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Drill AI</h3>
                <p className="text-sm text-gray-500">Ask our specialist questions</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
