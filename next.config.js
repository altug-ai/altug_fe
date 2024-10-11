/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com", "i.ytimg.com"], // Add any other image domains as needed
  },
  output: "standalone",
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  }),
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withNextIntl(nextConfig);
