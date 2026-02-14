interface SectionContainerProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function SectionContainer({ title, children, className = '' }: SectionContainerProps) {
  return (
    <section className={`py-8 ${className}`}>
      {title && (
        <h2 className="text-sm font-medium uppercase tracking-wider text-[#646669] mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
