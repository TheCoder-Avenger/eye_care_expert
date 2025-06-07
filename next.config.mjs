/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    additionalData: `@import "./assets/stylesheets/_variables.scss";`,
  },
};

export default nextConfig;
