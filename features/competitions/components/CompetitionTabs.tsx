type TabOption = {
  key: string;
  label: string;
};

type CompetitionTabsProps = {
  tabs: TabOption[];
  activeTab: string;
  onChange: (key: string) => void;
};

export function CompetitionTabs({
  tabs,
  activeTab,
  onChange,
}: CompetitionTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === tab.key
              ? "bg-zinc-900 text-white"
              : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
