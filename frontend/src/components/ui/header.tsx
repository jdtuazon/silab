'use client';

import { Search, User, Menu, Flame } from 'lucide-react';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onMenuToggle?: () => void;
}

export function Header({ searchValue, onSearchChange, onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-orange-500 border-b border-orange-700 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-white drop-shadow-sm" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <Flame className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">SiLab</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 max-w-xs border-0 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-lg placeholder-neutral-500 text-neutral-900"
              aria-label="Search products"
            />
          </div>
          
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
            <User className="w-4 h-4 text-white drop-shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}