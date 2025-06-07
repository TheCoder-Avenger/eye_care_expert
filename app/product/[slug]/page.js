import ProductView from "@modules/product";

export default function ProductPage({ params }) {
  return <ProductView slug={params.slug} />;
}

// Generate metadata for SEO
export function generateMetadata({ params }) {
  return {
    title: `${params.slug.replace(/-/g, " ")} - EyeCare Expert Portal`,
    description: `High-quality eyewear and professional eye care products. View details for ${params.slug.replace(
      /-/g,
      " "
    )}.`,
  };
}
