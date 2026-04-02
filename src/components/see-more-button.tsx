import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SeeMoreButton({ className, children = 'See more', ...props }: ButtonProps) {
  return (
    <Button
      variant="default"
      className={cn(
        'font-bold tracking-wide',
        'shadow-[0_4px_0_0_var(--color-primary-dark)]',
        'hover:shadow-[0_4px_0_0_var(--color-primary-dark)]',
        'active:translate-y-1 active:shadow-none',
        'transition-[transform,box-shadow] duration-75',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
