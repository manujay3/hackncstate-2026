import { useState, useEffect } from 'react'

interface UrlInputProps {
  size?: 'default' | 'large'
  defaultValue?: string
  onScan?: (url: string) => void
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function UrlInput({ size = 'default', defaultValue = '', onScan }: UrlInputProps) {
  const [url, setUrl] = useState(defaultValue)
  const [error, setError] = useState('')

  useEffect(() => {
    if (defaultValue) {
      setUrl(normalizeUrl(defaultValue))
    }
  }, [defaultValue])

  const handleScan = () => {
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Please enter a URL to scan')
      return
    }

    const normalized = normalizeUrl(trimmed)

    try {
      new URL(normalized)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setError('')
    setUrl(normalized)
    onScan?.(normalized)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (error) setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan()
  }

  const inputClass = size === 'large'
    ? 'flex-1 rounded-xl bg-[#2c2e31] border px-5 py-3.5 text-base text-[#d1d0c5] placeholder:text-[#646669] outline-none transition-colors focus:border-[#646669] focus:bg-[#2c2e31]'
    : 'flex-1 rounded-xl bg-[#323437] border px-4 py-2 text-sm text-[#d1d0c5] placeholder:text-[#646669] outline-none transition-colors focus:border-[#646669] focus:bg-[#2c2e31]'

  const borderColor = error ? 'border-[#ca4754]' : 'border-[#3a3c3f]'

  const buttonClass = size === 'large'
    ? 'shrink-0 rounded-xl bg-[#8b7ab8] px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#7466a3] cursor-pointer'
    : 'shrink-0 rounded-xl bg-[#8b7ab8] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7466a3] cursor-pointer'

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={url}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Paste a URL to scan…"
          className={`${inputClass} ${borderColor}`}
        />
        <button onClick={handleScan} className={buttonClass}>
          Scan
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[#ca4754] pl-1">{error}</p>
      )}
    </div>
  )
}
