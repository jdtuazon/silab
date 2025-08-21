'use client';

import { ChevronDown, Plus, X, FolderOpen, Code, TestTube, Rocket, ArchiveX } from 'lucide-react';
import { ProductStatus } from '@/types/product';

interface SidebarProps {
  selectedStatus: ProductStatus | "all";
  onStatusChange: (status: ProductStatus | "all") => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const statusItems = [
  { id: "all" as const, label: "All", icon: FolderOpen },
  { id: "in-dev" as const, label: "/in-dev", icon: Code },
  { id: "qa" as const, label: "/qa", icon: TestTube },
  { id: "prod" as const, label: "/prod", icon: Rocket },
  { id: "archived" as const, label: "/archived", icon: ArchiveX },
];

export function Sidebar({ selectedStatus, onStatusChange, isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <nav className={`fixed left-0 top-0 bottom-0 w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-orange-500">
          <h2 className="text-lg font-semibold text-white drop-shadow-sm">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-white drop-shadow-sm" />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3">All Products</h2>
          <ul className="space-y-1">
            {statusItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onStatusChange(item.id);
                      onClose?.();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 relative flex items-center ${
                      selectedStatus === item.id
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg border border-orange-400 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-orange-300 before:rounded-r'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50 backdrop-blur-sm border border-transparent hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
          
          <button className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 backdrop-blur-sm border border-transparent hover:border-slate-600 rounded-lg transition-all duration-200 mt-2 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Folder
          </button>
        </div>

        <div>
          <button className="flex items-center w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 backdrop-blur-sm border border-transparent hover:border-slate-600 rounded-lg transition-all duration-200">
            <ChevronDown className="w-4 h-4 mr-2" />
            Archive
          </button>
        </div>

        <div>
          <button className="flex items-center w-full text-left px-3 py-2 text-sm text-slate-500 cursor-not-allowed rounded-lg">
            <ChevronDown className="w-4 h-4 mr-2" />
            Community Showcase
          </button>
        </div>
        </div>
      </nav>
    </>
  );
}