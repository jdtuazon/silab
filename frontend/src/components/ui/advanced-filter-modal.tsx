"use client";

import { X } from "lucide-react";

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export function AdvancedFilterModal({
  isOpen,
  onClose,
  availableTags,
  selectedTags,
  onTagToggle,
  onClearAll,
}: AdvancedFilterModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-overlay z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-bg-primary rounded-xl shadow-lg border border-neutral-200 w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h3 className="font-medium text-primary-text">Tag Filters</h3>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-neutral-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-secondary-text" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Selected tags */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary-text">
                  Selected ({selectedTags.length})
                </span>
                {selectedTags.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-primary hover:text-primary-hover"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    className="inline-flex items-center px-2 py-1 bg-primary-light text-primary rounded text-xs font-medium hover:bg-primary transition-colors"
                  >
                    {tag}
                    <span className="ml-1 text-primary">×</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Available tags */}
            <div>
              <span className="text-sm font-medium text-secondary-text block mb-2">
                Available Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter((tag) => !selectedTags.includes(tag))
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className="inline-flex items-center px-2 py-1 bg-neutral-100 text-secondary-text rounded text-xs font-medium hover:bg-neutral-200 transition-colors"
                    >
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
