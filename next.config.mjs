/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    disableStaticImages: true,
    minimumCacheTTL: 86400,
    formats: ["image/avif", "image/webp"],
  },
  redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
