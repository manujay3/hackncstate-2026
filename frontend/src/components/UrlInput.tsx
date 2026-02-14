export function UrlInput() {
  return (
    <div className="flex items-center gap-2">
      <input
        type="url"
        placeholder="Paste a URL to scan…"
        className="flex-1 rounded-full bg-neutral-800/60 border border-neutral-700/50 px-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition-colors focus:border-neutral-500 focus:bg-neutral-800"
      />
      <button className="shrink-0 rounded-full bg-amber-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500 cursor-pointer">
        Scan
      </button>
    </div>
  )
}
