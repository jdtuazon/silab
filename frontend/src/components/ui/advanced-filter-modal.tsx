'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

export function AdvancedFilterModal({ 
  isOpen, 
  onClose, 
  availableTags, 
  selectedTags, 
  onTagToggle, 
  onClearTags 
}: AdvancedFilterModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Light backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-10 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown positioned near button */}
      <div className="fixed top-20 left-80 z-50">
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h3 className="font-medium text-neutral-900">Tag Filters</h3>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700">Selected ({selectedTags.length})</span>
                  <button
                    onClick={onClearTags}
                    className="text-xs text-orange-600 hover:text-orange-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <button
                      key={`selected-${tag}`}
                      onClick={() => onTagToggle(tag)}
                      className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium hover:bg-orange-200 transition-colors"
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Available Tags */}
            <div>
              <span className="text-sm font-medium text-neutral-700 block mb-2">Available Tags</span>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {availableTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium hover:bg-neutral-200 transition-colors"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}