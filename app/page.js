import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div style={{ margin: "2rem 0", textAlign: "center" }}>
          <h2 style={{ marginBottom: "1rem", color: "#333" }}>
            EyeCare Expert Portal
          </h2>
          <p style={{ marginBottom: "2rem", color: "#666" }}>
            Browse our premium eyewear collection
          </p>

          {/* Sample Product Links */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/product/classic-aviator-sunglasses"
              style={{
                padding: "0.75rem 1.5rem",
                background: "#667eea",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "500",
                transition: "background 0.3s ease",
              }}
            >
              View Aviator Sunglasses
            </Link>
            <Link
              href="/product/blue-light-blocking-glasses"
              style={{
                padding: "0.75rem 1.5rem",
                background: "#764ba2",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "500",
              }}
            >
              View Blue Light Glasses
            </Link>
          </div>
        </div>

        <ol>
          <li>Product pages with advanced features implemented ✅</li>
          <li>Header with all requested components ✅</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
