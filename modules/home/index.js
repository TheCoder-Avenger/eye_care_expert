"use client";

import Image from "next/image";
import Link from "next/link";
import "./style.scss";

const HomeView = () => {
  return (
    <div className="home-view">
      <main className="home-view__main">
        <div className="home-view__logo-section">
          <Image
            className="home-view__logo"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>

        <div className="home-view__hero">
          <h1 className="home-view__title">EyeCare Expert Portal</h1>
          <p className="home-view__subtitle">
            Browse our premium eyewear collection
          </p>

          {/* Sample Product Links */}
          <div className="home-view__product-links">
            <Link
              href="/product/classic-aviator-sunglasses"
              className="home-view__product-btn home-view__product-btn--primary"
            >
              View Aviator Sunglasses
            </Link>
            <Link
              href="/product/blue-light-blocking-glasses"
              className="home-view__product-btn home-view__product-btn--secondary"
            >
              View Blue Light Glasses
            </Link>
          </div>
        </div>

        <div className="home-view__features">
          <h2 className="home-view__features-title">Features Implemented</h2>
          <ul className="home-view__features-list">
            <li className="home-view__feature-item">
              ✅ Product pages with advanced features
            </li>
            <li className="home-view__feature-item">
              ✅ Header with all requested components
            </li>
            <li className="home-view__feature-item">
              ✅ Responsive design with mobile-first approach
            </li>
            <li className="home-view__feature-item">
              ✅ Modular component structure
            </li>
          </ul>
        </div>

        <div className="home-view__ctas">
          <a
            className="home-view__cta home-view__cta--primary"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="home-view__cta-icon"
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
            className="home-view__cta home-view__cta--secondary"
          >
            Read our docs
          </a>
        </div>
      </main>

      <footer className="home-view__footer">
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="home-view__footer-link"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
            className="home-view__footer-icon"
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="home-view__footer-link"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
            className="home-view__footer-icon"
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="home-view__footer-link"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            className="home-view__footer-icon"
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
};

export default HomeView;
