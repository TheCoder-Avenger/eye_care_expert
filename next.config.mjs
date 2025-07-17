/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    additionalData: `@import "./assets/stylesheets/_variables.scss";`,
  },
  images: {
    domains: ["drive.google.com"],
  },
};

export default nextConfig;
