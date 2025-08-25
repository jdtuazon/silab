"use client";

interface TagFiltersProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export function TagFilters({
  availableTags,
  selectedTags,
  onTagToggle,
  onClearAll,
}: TagFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Selected tags */}
      <div>
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
  );
}
