interface SegmentedTabsProps {
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (id: string) => void;
}

export function SegmentedTabs({ value, options, onChange }: SegmentedTabsProps) {
  return (
    <div className="segmented" role="tablist">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          className={value === option.id ? 'active' : ''}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
