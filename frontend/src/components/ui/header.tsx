"use client";

import { Menu, Flame } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Header({
  onMenuToggle,
  searchValue,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-primary-hover shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 text-inverse drop-shadow-sm" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <Flame className="w-6 h-6 text-inverse drop-shadow-sm" />
            </div>
            <h1 className="text-2xl font-bold text-inverse drop-shadow-sm">
              SiLab
            </h1>
          </div>
        </div>

        {/* Right side - Search */}
        <div className="flex-1 max-w-md ml-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-inverse placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
