
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex w-full">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-30 w-64">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 lg:hidden w-64 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Header with mobile menu button */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-white border-b border-gray-200 rounded-br-2xl safe-area-top">
          <div className="flex items-center lg:hidden px-3 py-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-2xl text-gray-600 hover:bg-gray-100 touch-target"
            >
              <Menu size={20} />
            </button>
          </div>
          <Header />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-6 pt-20 sm:pt-24 lg:pt-28 safe-area-bottom">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
