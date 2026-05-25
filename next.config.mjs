/** @type {import('next').NextConfig} */
const isExport = process.env.EXPORT === '1'

const nextConfig = {
  output: isExport ? 'export' : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isExport ? '/hritik-portfolio' : '',
  assetPrefix: isExport ? '/hritik-portfolio' : '',
}

export default nextConfig