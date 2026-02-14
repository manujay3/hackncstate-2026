import { UrlInput } from './UrlInput'

export function Header() {
  return (
    <header className="sticky top-0 z-50 pt-4 px-6">
      <div className="max-w-[1060px] mx-auto px-6">
        <div className="bg-[#2c2e31] border border-[#3a3c3f] rounded-2xl px-6 py-3 flex items-center gap-6">
          <div className="shrink-0 pl-1">
            <h1 className="text-sm font-semibold text-[#d1d0c5] tracking-tight">
              LinkScout
            </h1>
          </div>
          <div className="flex-1">
            <UrlInput />
          </div>
        </div>
      </div>
    </header>
  )
}
