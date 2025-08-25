"use client";

import { X, Home, Package, Settings, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Products", href: "/products", icon: Package },
  { name: "Documents", href: "/documents", icon: Newspaper },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-overlay z-40 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <nav
        className={`fixed left-0 top-0 bottom-0 w-64 bg-neutral-800 border-r border-neutral-700 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700 bg-primary">
          <h2 className="text-lg font-semibold text-inverse drop-shadow-sm">
            Navigation
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded lg:hidden"
          >
            <X className="w-5 h-5 text-inverse drop-shadow-sm" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              Main
            </h3>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary-hover text-inverse shadow-lg"
                      : "text-neutral-300 hover:text-inverse hover:bg-neutral-700/50"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
