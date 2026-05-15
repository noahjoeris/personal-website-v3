import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

function MDXLink({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) {
    return <a {...props}>{children}</a>
  }

  const isExternal = /^https?:\/\//.test(href)

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

function MDXImage({ src, alt, width, height, ...props }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={typeof width === 'number' ? width : 1200}
      height={typeof height === 'number' ? height : 675}
      className="my-6 h-auto w-full rounded-md"
      {...props}
    />
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: MDXLink,
    img: MDXImage as MDXComponents['img'],
  }
}
