interface CategoryTabsProps {
  categories: Array<{
    id: string;
    name: string;
  }>;
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const active = category.id === activeCategoryId;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={
              active
                ? "rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            }
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
