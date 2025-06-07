import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link
        href="/"
        style={{
          color: "#667eea",
          textDecoration: "none",
          marginTop: "1rem",
        }}
      >
        Go back to Home
      </Link>
    </div>
  );
}
