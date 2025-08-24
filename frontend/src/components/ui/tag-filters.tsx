'use client';

interface TagFiltersProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

export function TagFilters({ availableTags, selectedTags, onTagToggle, onClearTags }: TagFiltersProps) {
  const topTags = availableTags.slice(0, 6);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <button
        onClick={onClearTags}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selectedTags.length === 0
            ? 'bg-orange-500 text-white'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
      >
        All
      </button>
      
      {topTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagToggle(tag)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTags.includes(tag)
              ? 'bg-orange-500 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {tag}
        </button>
      ))}
      
      {availableTags.length > 6 && (
        <span className="text-sm text-neutral-400">
          +{availableTags.length - 6} more
        </span>
      )}
    </div>
  );
}