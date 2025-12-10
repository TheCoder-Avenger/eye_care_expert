import ProductView from "@modules/product";

export default function ProductPage({ params }) {
  return <ProductView slug={params.slug} />;
}

export function generateMetadata({ params }) {
  return {
    title: `${params.slug.replace(/-/g, " ")} - EyeCare Expert Portal`,
    description: `High-quality eyewear and professional eye care products. View details for ${params.slug.replace(
      /-/g,
      " "
    )}.`,
  };
}

export async function generateStaticParams() {
  // TODO: Replace this with real API/data source
  // Example static list:
  // const products = await fetch("https://your-api.com/products").then(r => r.json());

  const products = [
    { slug: "blue-light-glasses" },
    { slug: "contact-lens-solution" },
    { slug: "premium-eye-drops" },
  ];

  return products.map((product) => ({
    slug: product.slug,
  }));
}
