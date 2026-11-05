"use client";

export default function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="rounded-lg border-l-4 border-t-4 border border-green-800 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      Bahi
    </button>
  );
}
