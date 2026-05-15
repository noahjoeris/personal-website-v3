import { cn } from '@/lib/utils'

type MaskIconProps = {
  src: string
  className?: string
}

export function MaskIcon({ src, className }: MaskIconProps) {
  const maskImage = `url("${src}")`

  return (
    <span
      aria-hidden="true"
      className={cn('block bg-current', className)}
      style={{
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}
