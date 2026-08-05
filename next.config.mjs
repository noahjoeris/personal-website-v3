import createMDX from '@next/mdx'

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: 'github-dark-dimmed',
  keepBackground: false,
  bypassInlineCode: true,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    // String plugin names required for Turbopack.
    rehypePlugins: [['rehype-pretty-code', prettyCodeOptions]],
  },
})

export default withMDX(nextConfig)
