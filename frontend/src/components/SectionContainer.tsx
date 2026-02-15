interface SectionContainerProps {
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SectionContainer({ title, icon, children, className = '' }: SectionContainerProps) {
  return (
    <section className={`py-8 ${className}`}>
      {title && (
        <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#71717a] mb-5">
          {icon}
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
