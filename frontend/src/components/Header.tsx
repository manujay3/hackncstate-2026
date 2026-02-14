import { UrlInput } from './UrlInput'

export function Header() {
  return (
    <header className="sticky top-0 z-50 pt-4 px-6">
      <div className="max-w-[1060px] mx-auto px-6">
        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl px-6 py-3 flex items-center gap-6">
          <div className="shrink-0 pl-1">
            <h1 className="text-sm font-semibold text-neutral-100 tracking-tight">
              LinkScout <span className="text-neutral-500 font-normal"></span>
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
