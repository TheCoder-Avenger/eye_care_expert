"use client";

import { useEffect } from "react";
import Image from "next/image";
import "./style.scss";

const STORE_WHATSAPP_NUMBER = "919270906660";

const SpecialOfferModal = ({ isOpen, onClose, onOpen }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const handleClaimWhatsApp = () => {
    const message = `*Inquiry: Special Opening Offer (Visioncura)*
----------------------------------------
Hi Eye Care Expert Team,
I saw your Special Opening Offer on the website:
• 2 Glasses @ ₹990 (Buy 1 Get 1 Free)
• Free Eye Test / Cataract Surgery Consultation
• Free Bluetooth on Spectacles Purchase

Please provide more details on how to claim this offer! Thank you.`;

    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleBookAppointment = () => {
    onClose();
    setTimeout(() => {
      const aptSection = document.getElementById("book-appointment");
      if (aptSection) {
        aptSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Floating Re-Open Button on Bottom Left */}
      {!isOpen && (
        <button
          className="special-offer-floating-btn"
          onClick={onOpen}
          title="Click to view Special Opening Offer"
        >
          <span>🔥</span>
          <span>Special Opening Offer</span>
          <span className="pulse-badge">NEW</span>
        </button>
      )}

      {/* Modal Popup */}
      {isOpen && (
        <div className="special-offer-overlay" onClick={handleOverlayClick}>
          <div className="special-offer-modal" role="dialog" aria-modal="true">
            {/* Header */}
            <div className="special-offer-modal__header">
              <div className="header-title-wrap">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="header-badge">Limited Time Offer</span>
                  <h3>Visioncura Optical Clinic</h3>
                </div>
                <p>Special Opening Offer • Free Eye Checkup & 1+1 Deals</p>
              </div>
              <button
                className="close-btn"
                onClick={onClose}
                aria-label="Close offer modal"
              >
                ×
              </button>
            </div>

            {/* Content Body */}
            <div className="special-offer-modal__content">
              {/* Flyer Image Container */}
              <div className="special-offer-modal__image-wrapper">
                <a
                  href="/special-opening-offer.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-pdf-overlay"
                  title="Open Original Flyer PDF"
                >
                  <span>📄 View PDF</span>
                </a>
                <img
                  src="/special-opening-offer.png"
                  alt="Visioncura Special Opening Offer Flyer"
                  onClick={() => window.open("/special-opening-offer.pdf", "_blank")}
                />
              </div>

              {/* Key Perks Highlights */}
              <div className="special-offer-modal__perks">
                <div className="perk-card">
                  <span className="perk-icon">👓</span>
                  <div className="perk-info">
                    <strong>2 Glasses Only ₹990</strong>
                    <span>Buy 1 Get 1 Free Offer</span>
                  </div>
                </div>

                <div className="perk-card">
                  <span className="perk-icon">👁️</span>
                  <div className="perk-info">
                    <strong>Free Eye Test</strong>
                    <span>Free Cataract Surgery Consult</span>
                  </div>
                </div>

                <div className="perk-card">
                  <span className="perk-icon">🎧</span>
                  <div className="perk-info">
                    <strong>Free Bluetooth</strong>
                    <span>On Spectacles Purchase</span>
                  </div>
                </div>
              </div>

              {/* Clinic Locations & Helplines */}
              <div className="special-offer-modal__locations">
                <div className="location-box">
                  <h4>📍 Boisar Clinic</h4>
                  <p>Shop 006, Bldg K3/7, Ostwal Empire, Navapur Rd, Boisar (W)</p>
                  <a href="tel:7350906660" className="call-link">
                    📞 Call: 7350906660
                  </a>
                </div>

                <div className="location-box">
                  <h4>📍 Palghar Clinic</h4>
                  <p>Shop 21, Neelshrishti Bldg, Opp Reliance Smart, Palghar (W)</p>
                  <a href="tel:9270906660" className="call-link">
                    📞 Call: 9270906660
                  </a>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="special-offer-modal__footer">
                <button
                  type="button"
                  className="btn-claim-whatsapp"
                  onClick={handleClaimWhatsApp}
                >
                  <span>💬 Claim Offer on WhatsApp</span>
                </button>

                <button
                  type="button"
                  className="btn-book-slot"
                  onClick={handleBookAppointment}
                >
                  <span>📅 Book Your Slot</span>
                </button>

                <button
                  type="button"
                  className="btn-close-text"
                  onClick={onClose}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpecialOfferModal;
