/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/hritik-portfolio',
  assetPrefix: '/hritik-portfolio/',
}

export default nextConfig