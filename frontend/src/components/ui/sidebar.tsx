'use client';

import { X, Home, Package, BarChart3, Settings, Users, FileText, Database } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
  { id: "products", label: "Products", icon: Package, href: "/", active: true },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "team", label: "Team", icon: Users, href: "/team" },
  { id: "documentation", label: "Documentation", icon: FileText, href: "/docs" },
  { id: "database", label: "Database", icon: Database, href: "/database" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
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
          <h2 className="text-lg font-semibold text-white drop-shadow-sm">Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-white drop-shadow-sm" />
          </button>
        </div>
        
        <div className="p-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Main</h3>
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        // Navigation would happen here
                        onClose?.();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center ${
                        item.active
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}