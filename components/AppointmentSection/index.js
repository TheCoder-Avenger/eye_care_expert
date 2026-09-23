"use client";

import { useState } from "react";
import Toast from "@components/Toast";
import "./style.scss";

const STORE_WHATSAPP_NUMBER = "919270906660";

// 30-minute intervals from 10:00 AM to 09:00 PM
const SLOT_PERIODS = {
  morning: {
    id: "morning",
    icon: "🌅",
    label: "Morning",
    range: "10 AM - 12 PM",
    slots: [
      "10:00 AM - 10:30 AM",
      "10:30 AM - 11:00 AM",
      "11:00 AM - 11:30 AM",
      "11:30 AM - 12:00 PM",
    ],
  },
  afternoon: {
    id: "afternoon",
    icon: "☀️",
    label: "Afternoon",
    range: "12 PM - 5 PM",
    slots: [
      "12:00 PM - 12:30 PM",
      "12:30 PM - 01:00 PM",
      "01:00 PM - 01:30 PM",
      "01:30 PM - 02:00 PM",
      "02:00 PM - 02:30 PM",
      "02:30 PM - 03:00 PM",
      "03:00 PM - 03:30 PM",
      "03:30 PM - 04:00 PM",
      "04:00 PM - 04:30 PM",
      "04:30 PM - 05:00 PM",
    ],
  },
  evening: {
    id: "evening",
    icon: "🌙",
    label: "Evening",
    range: "5 PM - 9 PM",
    slots: [
      "05:00 PM - 05:30 PM",
      "05:30 PM - 06:00 PM",
      "06:00 PM - 06:30 PM",
      "06:30 PM - 07:00 PM",
      "07:00 PM - 07:30 PM",
      "07:30 PM - 08:00 PM",
      "08:00 PM - 08:30 PM",
      "08:30 PM - 09:00 PM",
    ],
  },
};

const PROBLEM_SUGGESTIONS = [
  "Routine Eye Checkup",
  "Glasses Power Check",
  "Computer Strain & Dry Eyes",
  "Frame & Lens Consultation",
  "Contact Lens Fitting",
];

const AppointmentSection = () => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    date: today,
    timeSlot: "10:00 AM - 10:30 AM",
    problem: "",
  });

  const [activePeriod, setActivePeriod] = useState("morning");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  // Extract clean 10-digit number handling +91, 91, 0 prefixes or raw 10 digits
  const getCleanMobile = (phoneInput) => {
    let clean = (phoneInput || "").trim();
    if (clean.startsWith("+91")) {
      clean = clean.slice(3).trim();
    } else if (clean.startsWith("91") && clean.length === 12) {
      clean = clean.slice(2).trim();
    } else if (clean.startsWith("0") && clean.length === 11) {
      clean = clean.slice(1).trim();
    }
    return clean.replace(/[\s-]/g, "");
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    // Strip typed/pasted +91, 91, or leading 0
    if (val.startsWith("+91")) {
      val = val.slice(3);
    } else if (val.startsWith("+")) {
      val = val.slice(1);
    }
    // Only keep numeric digits up to 10 characters
    const cleanDigits = val.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: cleanDigits }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSlotSelect = (slot) => {
    setFormData((prev) => ({ ...prev, timeSlot: slot }));
    if (errors.timeSlot) {
      setErrors((prev) => ({ ...prev, timeSlot: "" }));
    }
  };

  const handleProblemChipClick = (suggestion) => {
    setFormData((prev) => {
      if (prev.problem === suggestion) {
        return { ...prev, problem: "" };
      }
      return { ...prev, problem: suggestion };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter patient name";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    // 2. Age validation
    const ageNum = parseInt(formData.age, 10);
    if (!formData.age || formData.age.toString().trim() === "") {
      newErrors.age = "Please enter age";
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.age = "Enter valid age (1-120)";
    }

    // 3. Mobile Number validation (+91 or without)
    const cleanPhone = getCleanMobile(formData.phone);
    if (!cleanPhone) {
      newErrors.phone = "Please enter mobile number";
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    // 4. Time slot validation
    if (!formData.timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = getCleanMobile(formData.phone);
      const formattedMobile = `+91 ${cleanPhone}`;

      const message = `*Appointment Booking Request - Eye Care Expert*
----------------------------------------
• *Patient Name:* ${formData.fullName.trim()}
• *Age:* ${formData.age.trim()} years
• *Mobile Number:* ${formattedMobile}
• *Preferred Date:* ${formData.date}
• *Time Slot:* ${formData.timeSlot}
${
  formData.problem.trim()
    ? `• *Problem / Concern:* ${formData.problem.trim()}\n`
    : ""
}----------------------------------------
• *Clinic:* Eye Care Expert Store

Please confirm my appointment slot. Thank you!`;

      const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message,
      )}`;

      window.open(whatsappUrl, "_blank");

      setToast({
        isVisible: true,
        message: "Opening WhatsApp with your appointment request...",
        type: "success",
      });

      // Reset problem field
      setFormData((prev) => ({
        ...prev,
        problem: "",
      }));
    } catch (err) {
      console.error("Error opening WhatsApp:", err);
      setToast({
        isVisible: true,
        message: "Could not open WhatsApp. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="appointment-section" id="book-appointment">
      <div className="appointment-section__wrapper">
        {/* Left Side: Clinic Highlights & Trust Badges */}
        <div className="appointment-section__info">
          <div className="appointment-section__badge">
            <span className="badge-icon">🩺</span> Certified Optometrists
          </div>

          <h2 className="appointment-section__title">
            Book an In-Clinic <br />
            <span className="gradient-text">Vision Consultation</span>
          </h2>

          <p className="appointment-section__desc">
            Get personalized eye care with state-of-the-art computerized testing
            and expert styling assistance. Fast, easy, and confirmed directly
            via WhatsApp.
          </p>

          <div className="appointment-section__highlights">
            <div className="appointment-section__highlight-card">
              <span className="highlight-icon">👁️</span>
              <div className="highlight-text">
                <h4>Computerized Testing</h4>
                <p>Digital precision vision & refraction check</p>
              </div>
            </div>

            <div className="appointment-section__highlight-card">
              <span className="highlight-icon">👓</span>
              <div className="highlight-text">
                <h4>Frame Styling Bar</h4>
                <p>Try 500+ curated frames with guidance</p>
              </div>
            </div>

            <div className="appointment-section__highlight-card">
              <span className="highlight-icon">⚡</span>
              <div className="highlight-text">
                <h4>Zero Waiting Time</h4>
                <p>30-min priority slot on WhatsApp</p>
              </div>
            </div>

            <div className="appointment-section__highlight-card">
              <span className="highlight-icon">🛡️</span>
              <div className="highlight-text">
                <h4>100% Free Consultation</h4>
                <p>Complimentary with any frame purchase</p>
              </div>
            </div>
          </div>

          <div className="appointment-section__trust-bar">
            <div className="trust-rating">
              <span className="stars">★★★★★</span>
              <span>4.9 / 5</span>
            </div>
            <div className="trust-stat">
              Over <strong>10,000+</strong> Happy Patients Consulted
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Booking Card */}
        <div className="appointment-section__card">
          <div className="appointment-section__card-header">
            <div className="card-title-wrap">
              <h3>Schedule Your Visit</h3>
              <p>10:00 AM – 09:00 PM • 30-min slots via WhatsApp</p>
            </div>
            <div className="live-status">
              <span className="pulse-dot"></span>
              <span>Slots Available Today</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="appointment-section__form">
            {/* 1. Name & 2. Age */}
            <div className="appointment-section__form-row appointment-section__form-row--name-age">
              {/* 1. Name */}
              <div className="appointment-section__field">
                <label htmlFor="apt-name">
                  <span className="label-text">
                    Full Name <span className="required">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="apt-name"
                    type="text"
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? "has-error" : ""}
                  />
                </div>
                {errors.fullName && (
                  <span className="error-msg">⚠️ {errors.fullName}</span>
                )}
              </div>

              {/* 2. Age */}
              <div className="appointment-section__field">
                <label htmlFor="apt-age">
                  <span className="label-text">
                    Age <span className="required">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🎂</span>
                  <input
                    id="apt-age"
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    placeholder="e.g. 20"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={errors.age ? "has-error" : ""}
                  />
                </div>
                {errors.age && (
                  <span className="error-msg">⚠️ {errors.age}</span>
                )}
              </div>
            </div>

            {/* 3. Mobile Number & Date */}
            <div className="appointment-section__form-row">
              {/* 3. Mobile Number with +91 badge */}
              <div className="appointment-section__field">
                <label htmlFor="apt-phone">
                  <span className="label-text">
                    Mobile Number <span className="required">*</span>
                  </span>
                </label>
                <div className="input-wrapper phone-wrapper">
                  <span className="phone-prefix-badge">
                    <span className="flag">🇮🇳</span> +91
                  </span>
                  <input
                    id="apt-phone"
                    type="tel"
                    name="phone"
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`phone-input ${errors.phone ? "has-error" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <span className="error-msg">⚠️ {errors.phone}</span>
                )}
              </div>

              {/* Date */}
              <div className="appointment-section__field">
                <label htmlFor="apt-date">
                  <span className="label-text">
                    Appointment Date <span className="required">*</span>
                  </span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="apt-date"
                    type="date"
                    name="date"
                    min={today}
                    value={formData.date}
                    onChange={handleInputChange}
                    className="no-icon"
                  />
                </div>
              </div>
            </div>

            {/* 4. Time Slot (10:00 AM to 09:00 PM, 30-min intervals) */}
            <div
              className={`appointment-section__slot-picker ${
                errors.timeSlot ? "has-error" : ""
              }`}
            >
              <div className="slot-picker-header">
                <div className="slot-title">
                  <span>⏰ Select Time Slot</span>
                  <span className="time-badge">10 AM – 9 PM</span>
                </div>
                {formData.timeSlot && (
                  <span className="selected-slot-preview">
                    ✓ {formData.timeSlot}
                  </span>
                )}
              </div>

              {/* Period Switcher (Morning / Afternoon / Evening) */}
              <div className="period-tabs">
                {Object.values(SLOT_PERIODS).map((period) => (
                  <button
                    key={period.id}
                    type="button"
                    className={`period-tab-btn ${
                      activePeriod === period.id ? "active" : ""
                    }`}
                    onClick={() => setActivePeriod(period.id)}
                  >
                    <span className="period-icon">{period.icon}</span>
                    <span className="period-label">{period.label}</span>
                  </button>
                ))}
              </div>

              {/* 30-min Slots Grid */}
              <div className="slot-pills-grid">
                {SLOT_PERIODS[activePeriod].slots.map((slot) => {
                  const isSelected = formData.timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-pill-btn ${isSelected ? "active" : ""}`}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {isSelected && <span className="check-icon">✓</span>}
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>

              {errors.timeSlot && (
                <span className="error-msg">⚠️ {errors.timeSlot}</span>
              )}
            </div>

            {/* 5. Problem / Eye Concern (Optional) */}
            <div className="appointment-section__field">
              <label htmlFor="apt-problem">
                <span className="label-text">Eye Concern / Problem</span>
                <span className="optional">(Optional)</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">👁️</span>
                <input
                  id="apt-problem"
                  type="text"
                  name="problem"
                  placeholder="e.g. Blurry distance vision, eye power test, computer strain"
                  value={formData.problem}
                  onChange={handleInputChange}
                />
              </div>

              {/* Quick suggestion chips */}
              <div className="appointment-section__suggestion-chips">
                <span className="chip-label">Suggestions:</span>
                {PROBLEM_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className={`chip-btn ${
                      formData.problem === suggestion ? "active" : ""
                    }`}
                    onClick={() => handleProblemChipClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="appointment-section__submit-btn"
            >
              <span className="btn-whatsapp-icon">💬</span>
              <span>
                {isSubmitting
                  ? "Opening WhatsApp..."
                  : "Book Appointment on WhatsApp"}
              </span>
              <span className="btn-arrow">→</span>
            </button>

            <p className="appointment-section__note">
              🔒 No payment required • Instant confirmation directly on WhatsApp
            </p>
          </form>
        </div>
      </div>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </section>
  );
};

export default AppointmentSection;
