
"use client";

type CategoryCardProps = {
  name: string;
  description: string;
  icon: string;
  onClick: () => void;
};

export default function CategoryCard({
  name,
  description,
  icon,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-stone-200 bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="text-3xl">{icon}</span>

      <h3 className="mt-4 text-xl font-bold text-emerald-900">
        {name}
      </h3>

      <p className="mt-2 leading-7 text-slate-600">
        {description}
      </p>

      <span className="mt-4 inline-block font-semibold text-emerald-800">
        Fatwaawwan ilaali →
      </span>
    </button>
  );
}
