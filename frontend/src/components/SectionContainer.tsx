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
        <h2 className="flex items-center gap-2 text-base font-medium uppercase tracking-wider text-[#646669] mb-5">
          {icon}
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
