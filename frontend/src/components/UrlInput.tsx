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
    ? 'flex-1 rounded-xl bg-[#151619] border px-6 py-4 text-lg text-[#e4e4e7] placeholder:text-[#52525b] outline-none transition-all focus:border-[#a78bfa]/40 focus:ring-1 focus:ring-[#a78bfa]/20'
    : 'flex-1 rounded-xl bg-[#151619] border px-5 py-3 text-base text-[#e4e4e7] placeholder:text-[#52525b] outline-none transition-all focus:border-[#a78bfa]/40 focus:ring-1 focus:ring-[#a78bfa]/20'

  const borderColor = error ? 'border-[#f87171]/50' : 'border-[#1f2024]'

  const buttonClass = size === 'large'
    ? 'shrink-0 rounded-xl bg-[#7c3aed] px-8 py-4 text-lg font-medium text-white transition-all hover:bg-[#8b5cf6] cursor-pointer'
    : 'shrink-0 rounded-xl bg-[#7c3aed] px-6 py-3 text-base font-medium text-white transition-all hover:bg-[#8b5cf6] cursor-pointer'

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={url}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Paste a URL to scan..."
          className={`${inputClass} ${borderColor}`}
        />
        <button onClick={handleScan} className={buttonClass}>
          Scan
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-[#f87171] pl-1">{error}</p>
      )}
    </div>
  )
}
