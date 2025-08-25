'use client';

import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-200 z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Navigation</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <nav className="space-y-2">
            <a 
              href="/"
              className="flex items-center px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Products
            </a>
            <a 
              href="#"
              className="flex items-center px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Analytics
            </a>
            <a 
              href="#"
              className="flex items-center px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Settings
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}