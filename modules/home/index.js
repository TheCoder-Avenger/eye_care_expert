"use client";

import Image from "next/image";
import Link from "next/link";
import "./style.scss";

const HomeView = () => {
  return (
    <div className="home-view">
      <main className="home-view__main">
        <div className="home-view__logo-section"></div>

        <div className="home-view__hero">
          <h1 className="home-view__title">EyeCare Expert Portal</h1>
          <p className="home-view__subtitle">
            Browse our premium eyewear collection
          </p>

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
      </main>
    </div>
  );
};

export default HomeView;
