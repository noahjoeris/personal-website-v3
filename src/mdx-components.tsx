import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import {
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  isValidElement,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react'

import { CodeBlock } from '@/components/code-block'
import { slugifyBlogHeading } from '@/lib/blog-content'
import { cn } from '@/lib/utils'

const blogImageDimensions = {
  '/images/blog/bitcoin-node.webp': { width: 1838, height: 1466 },
} as const

function MDXLink({ href, children, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) {
    return (
      <a className={className} {...props}>
        {children}
      </a>
    )
  }

  const linkClassName = cn(
    'rounded-sm font-medium text-primary-light underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    className,
  )

  return /^https?:\/\//.test(href) ? (
    <a href={href} className={linkClassName} {...props}>
      {children}
    </a>
  ) : (
    <Link href={href} className={linkClassName} {...props}>
      {children}
    </Link>
  )
}

function MDXImage({ src, alt, width, height, className, ...props }: ImageProps) {
  const knownDimensions =
    typeof src === 'string' ? blogImageDimensions[src as keyof typeof blogImageDimensions] : undefined
  const resolvedWidth = typeof width === 'number' ? width : knownDimensions?.width
  const resolvedHeight = typeof height === 'number' ? height : knownDimensions?.height

  if (typeof src === 'string' && (!resolvedWidth || !resolvedHeight)) {
    throw new Error(`Blog image ${String(src)} must provide accurate numeric width and height values`)
  }

  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={resolvedWidth}
      height={resolvedHeight}
      sizes="(max-width: 47.999rem) calc(100vw - 3rem), 57ch"
      className={cn('my-6 h-auto w-full rounded-md', className)}
      {...props}
    />
  )
}

function getNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join('')
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children)
  }

  return ''
}

function HeadingPermalink({ id, label }: { id: string; label: string }) {
  return (
    <a
      className="ml-2 rounded-sm text-[0.75em] font-medium text-foreground/35 no-underline opacity-45 transition-opacity hover:text-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:opacity-100 motion-reduce:transition-none group-hover:opacity-100"
      href={`#${id}`}
    >
      <span aria-hidden="true">#</span>
      <span className="sr-only">Link to {label}</span>
    </a>
  )
}

function MDXHeading1({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'mt-12 scroll-mt-8 text-balance text-4xl font-semibold leading-[1.15] tracking-tight text-foreground first:mt-0 tablet:text-5xl',
        className,
      )}
      {...props}
    />
  )
}

function MDXHeading2({ children, id: suppliedId, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const label = getNodeText(children)
  const id = suppliedId ?? slugifyBlogHeading(label)

  return (
    <h2
      id={id}
      className={cn(
        'group mt-12 scroll-mt-8 text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-foreground tablet:text-4xl',
        className,
      )}
      {...props}
    >
      {children}
      <HeadingPermalink id={id} label={label} />
    </h2>
  )
}

function MDXHeading3({ children, id: suppliedId, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const label = getNodeText(children)
  const id = suppliedId ?? slugifyBlogHeading(label)

  return (
    <h3
      id={id}
      className={cn(
        'group mt-10 scroll-mt-8 text-balance text-2xl font-semibold leading-[1.15] tracking-tight text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <HeadingPermalink id={id} label={label} />
    </h3>
  )
}

function MDXTable({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className={cn('w-full border-collapse text-[0.95em]', className)} {...props} />
    </div>
  )
}

function MDXTableHeader({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('border-b border-foreground/15 p-3 text-left align-top font-semibold text-foreground', className)}
      {...props}
    />
  )
}

function MDXTableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('border-b border-foreground/15 p-3 text-left align-top', className)} {...props} />
}

function isHighlightedCodeBlock(props: HTMLAttributes<HTMLElement>) {
  return 'data-language' in props || 'data-theme' in props
}

const codeBlockShellClassName =
  'relative left-1/2 mt-8 w-[min(48rem,calc(100vw-3rem))] max-w-none -translate-x-1/2 overflow-hidden rounded-md border border-foreground/10 bg-foreground/5 tablet:w-[min(56rem,calc(100vw-5rem))]'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: MDXLink,
    blockquote: ({ className, ...props }) => (
      <blockquote className={cn('mt-8 border-l-2 border-primary/55 pl-5 text-foreground/70', className)} {...props} />
    ),
    code: ({ className, ...props }) => {
      const isBlock =
        isHighlightedCodeBlock(props) || (typeof className === 'string' && /(^|\s)language-/.test(className))

      return (
        <code
          className={cn(
            !isBlock && 'rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[0.95em] text-foreground',
            isBlock && 'font-mono text-[1em]',
            className,
          )}
          {...props}
        />
      )
    },
    figcaption: ({ className, ...props }) => {
      if ('data-rehype-pretty-code-title' in props) {
        return (
          <figcaption
            className={cn(
              'border-b border-foreground/10 px-4 py-2 font-mono text-xs tracking-wide text-foreground/55',
              className,
            )}
            {...props}
          />
        )
      }

      return (
        <figcaption className={cn('mt-3 text-center text-sm leading-6 text-foreground/60', className)} {...props} />
      )
    },
    figure: ({ className, ...props }) => {
      if ('data-rehype-pretty-code-figure' in props) {
        return <figure className={cn(codeBlockShellClassName, className)} {...props} />
      }

      return <figure className={cn('mt-10 [&_img]:my-0', className)} {...props} />
    },
    h1: MDXHeading1,
    h2: MDXHeading2,
    h3: MDXHeading3,
    hr: ({ className, ...props }) => <hr className={cn('my-10 border-foreground/15', className)} {...props} />,
    img: MDXImage as MDXComponents['img'],
    kbd: ({ className, ...props }) => (
      <kbd
        className={cn(
          'rounded border border-foreground/20 bg-foreground/8 px-1.5 py-0.5 font-mono text-[0.85em]',
          className,
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }: LiHTMLAttributes<HTMLLIElement>) => (
      <li className={cn('mt-2', className)} {...props} />
    ),
    ol: ({ className, ...props }: OlHTMLAttributes<HTMLOListElement>) => (
      <ol className={cn('mt-6 list-decimal pl-6', className)} {...props} />
    ),
    p: ({ className, ...props }) => <p className={cn('mt-6 first:mt-0', className)} {...props} />,
    pre: ({ children, className, ...props }) => {
      const isHighlighted = isHighlightedCodeBlock(props)

      if (isHighlighted) {
        const language = 'data-language' in props ? props['data-language'] : undefined

        return (
          <CodeBlock
            code={getNodeText(children)}
            language={typeof language === 'string' ? language : undefined}
            className={className}
            {...props}
          >
            {children}
          </CodeBlock>
        )
      }

      return (
        <pre
          className={cn(
            'overflow-x-auto p-4 font-mono text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0 tablet:text-[0.9em]',
            codeBlockShellClassName,
            className,
          )}
          {...props}
        >
          {children}
        </pre>
      )
    },
    strong: ({ className, ...props }) => (
      <strong className={cn('font-semibold text-foreground', className)} {...props} />
    ),
    table: MDXTable,
    td: MDXTableCell,
    th: MDXTableHeader,
    ul: ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn('mt-6 list-disc pl-6', className)} {...props} />
    ),
  }
}
