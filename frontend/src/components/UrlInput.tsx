import { useState } from 'react'

interface UrlInputProps {
  onScan: (url: string) => void
  loading?: boolean
}

export function UrlInput({ onScan, loading }: UrlInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = () => {
    const trimmed = url.trim()
    if (trimmed) onScan(trimmed)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Paste a URL to scan…"
        className="flex-1 rounded-xl bg-[#323437] border border-[#3a3c3f] px-4 py-2 text-sm text-[#d1d0c5] placeholder:text-[#646669] outline-none transition-colors focus:border-[#646669] focus:bg-[#2c2e31]"
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
        className="shrink-0 rounded-xl bg-[#b4a7d6] px-5 py-2 text-sm font-medium text-[#323437] transition-colors hover:bg-[#9b8cbf] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Scanning…' : 'Scan'}
      </button>
    </div>
  )
}
