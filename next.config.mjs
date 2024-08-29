/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:api*/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Adjust based on your needs
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
