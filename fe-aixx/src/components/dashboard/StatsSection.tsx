import React from "react";

interface StatItem {
  label: string;
  value: string;
}

const stats: StatItem[] = [
  { label: "Regular AI Users", value: "78%" },
  { label: "Have taken AI courses", value: "68.8%" },
  { label: "Prefer Online Learning", value: "59.4%" },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 p-6 shadow-sm"
        >
          <span className="text-4xl font-extrabold text-gray-800 dark:text-white/90">
            {item.value}
          </span>
          <span className="mt-2 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            {item.label}
          </span>
        </div>
      ))}
    </section>
  );
};

export default StatsSection;
