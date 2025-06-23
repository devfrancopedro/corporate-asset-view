
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="fixed top-0 right-0 left-64 z-20 bg-white border-b border-gray-200">
          <Header />
        </div>
        <main className="flex-1 p-6 pt-24">
          {children}
        </main>
      </div>
    </div>
  );
};
