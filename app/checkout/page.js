"use client";

import { useState } from "react";
import Modal from "@components/Modal";
import "./style.scss";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    city: "Mumbai",
    address: "",
    selectedAppointmentDate: "",
    selectedAppointmentTime: "",
  });

  const [errors, setErrors] = useState({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: "",
    time: "",
    notes: "",
  });

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle appointment details change
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle schedule appointment
  const handleScheduleAppointment = () => {
    if (validateForm()) {
      setShowScheduleModal(true);
    }
  };

  // Handle appointment confirmation
  const handleConfirmAppointment = () => {
    if (!appointmentDetails.date || !appointmentDetails.time) {
      alert("Please select date and time for your appointment");
      return;
    }

    // Update form data with selected appointment details
    setFormData((prev) => ({
      ...prev,
      selectedAppointmentDate: appointmentDetails.date,
      selectedAppointmentTime: appointmentDetails.time,
    }));

    setShowScheduleModal(false);
    setShowOrderPlacedModal(true);
  };

  // Handle direct order placement
  const handlePlaceOrder = () => {
    if (validateForm()) {
      setShowOrderPlacedModal(true);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="checkout-page">
      <div className="checkout-page__container">
        <div className="checkout-page__header">
          <h1>Customer Details</h1>
          <p>Please provide your information to complete your order</p>
        </div>

        <div className="checkout-page__content">
          <form className="checkout-form">
            <div className="checkout-form__section">
              <h2>Personal Information</h2>

              <div className="checkout-form__row">
                <div className="checkout-form__field">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "error" : ""}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <span className="checkout-form__error">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="checkout-form__field">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "error" : ""}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <span className="checkout-form__error">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              <div className="checkout-form__row">
                <div className="checkout-form__field">
                  <label htmlFor="mobile">Mobile Number *</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={errors.mobile ? "error" : ""}
                    placeholder="Enter your mobile number"
                  />
                  {errors.mobile && (
                    <span className="checkout-form__error">
                      {errors.mobile}
                    </span>
                  )}
                </div>

                <div className="checkout-form__field">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "error" : ""}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <span className="checkout-form__error">{errors.email}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="checkout-form__section">
              <h2>Address Information</h2>

              <div className="checkout-form__row">
                <div className="checkout-form__field">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    disabled
                    className="disabled"
                  />
                </div>
              </div>

              <div className="checkout-form__field">
                <label htmlFor="address">Complete Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? "error" : ""}
                  placeholder="Enter your complete address"
                  rows="3"
                />
                {errors.address && (
                  <span className="checkout-form__error">{errors.address}</span>
                )}
              </div>
            </div>

            {/* Show selected appointment details if available */}
            {formData.selectedAppointmentDate && (
              <div className="checkout-form__section">
                <h2>Appointment Details</h2>
                <div className="appointment-preview">
                  <div className="appointment-preview__info">
                    <div className="appointment-preview__item">
                      <span className="appointment-preview__label">
                        📅 Date:
                      </span>
                      <span className="appointment-preview__value">
                        {new Date(
                          formData.selectedAppointmentDate
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="appointment-preview__item">
                      <span className="appointment-preview__label">
                        🕐 Time:
                      </span>
                      <span className="appointment-preview__value">
                        {formData.selectedAppointmentTime === "09:00"
                          ? "09:00 AM"
                          : formData.selectedAppointmentTime === "10:00"
                          ? "10:00 AM"
                          : formData.selectedAppointmentTime === "11:00"
                          ? "11:00 AM"
                          : formData.selectedAppointmentTime === "12:00"
                          ? "12:00 PM"
                          : formData.selectedAppointmentTime === "14:00"
                          ? "02:00 PM"
                          : formData.selectedAppointmentTime === "15:00"
                          ? "03:00 PM"
                          : formData.selectedAppointmentTime === "16:00"
                          ? "04:00 PM"
                          : formData.selectedAppointmentTime === "17:00"
                          ? "05:00 PM"
                          : formData.selectedAppointmentTime}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="appointment-preview__edit"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    ✏️ Edit Appointment
                  </button>
                </div>
              </div>
            )}

            <div className="checkout-form__actions">
              <button
                type="button"
                className="checkout-form__btn checkout-form__btn--schedule"
                onClick={handleScheduleAppointment}
              >
                📅 Schedule Appointment
              </button>
              <button
                type="button"
                className="checkout-form__btn checkout-form__btn--order"
                onClick={handlePlaceOrder}
              >
                🛒 Place Order Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Your Appointment"
        size="medium"
      >
        <div className="appointment-modal">
          <p className="appointment-modal__intro">
            Select your preferred date and time for eye examination
          </p>

          <div className="appointment-modal__form">
            <div className="appointment-modal__field">
              <label htmlFor="appointmentDate">Preferred Date *</label>
              <input
                type="date"
                id="appointmentDate"
                name="date"
                value={appointmentDetails.date}
                onChange={handleAppointmentChange}
                min={getMinDate()}
              />
            </div>

            <div className="appointment-modal__field">
              <label htmlFor="appointmentTime">Preferred Time *</label>
              <select
                id="appointmentTime"
                name="time"
                value={appointmentDetails.time}
                onChange={handleAppointmentChange}
              >
                <option value="">Select time slot</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>

            <div className="appointment-modal__field">
              <label htmlFor="appointmentNotes">Additional Notes</label>
              <textarea
                id="appointmentNotes"
                name="notes"
                value={appointmentDetails.notes}
                onChange={handleAppointmentChange}
                placeholder="Any specific requirements or concerns?"
                rows="3"
              />
            </div>
          </div>

          <div className="appointment-modal__actions">
            <button
              className="appointment-modal__btn appointment-modal__btn--cancel"
              onClick={() => setShowScheduleModal(false)}
            >
              Cancel
            </button>
            <button
              className="appointment-modal__btn appointment-modal__btn--confirm"
              onClick={handleConfirmAppointment}
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      </Modal>

      {/* Order Placed Modal */}
      <Modal
        isOpen={showOrderPlacedModal}
        onClose={() => setShowOrderPlacedModal(false)}
        title="Order Confirmed!"
        size="medium"
      >
        <div className="order-success-modal">
          <div className="order-success-modal__icon">✅</div>

          <div className="order-success-modal__content">
            <h3>Thank you for your order!</h3>
            <p>Your order has been successfully placed.</p>

            <div className="order-success-modal__details">
              <div className="order-success-modal__detail">
                <strong>Customer:</strong> {formData.firstName}{" "}
                {formData.lastName}
              </div>

              <div className="order-success-modal__detail">
                <strong>Email:</strong> {formData.email}
              </div>

              <div className="order-success-modal__detail">
                <strong>Mobile:</strong> {formData.mobile}
              </div>

              {appointmentDetails.date && (
                <div className="order-success-modal__detail">
                  <strong>Appointment:</strong> {appointmentDetails.date} at{" "}
                  {appointmentDetails.time}
                </div>
              )}
            </div>

            <div className="order-success-modal__next-steps">
              <h4>What's next?</h4>
              <ul>
                <li>📧 You'll receive an order confirmation email shortly</li>
                <li>📱 We'll send SMS updates about your order status</li>
                {appointmentDetails.date && (
                  <li>📅 We'll remind you about your upcoming appointment</li>
                )}
                <li>
                  🚚 Your order will be processed and shipped within 2-3
                  business days
                </li>
              </ul>
            </div>
          </div>

          <div className="order-success-modal__actions">
            <button
              className="order-success-modal__btn"
              onClick={() => {
                setShowOrderPlacedModal(false);
                // Reset form or redirect to home
                setFormData({
                  firstName: "",
                  lastName: "",
                  mobile: "",
                  email: "",
                  city: "Mumbai",
                  address: "",
                  selectedAppointmentDate: "",
                  selectedAppointmentTime: "",
                });
                setAppointmentDetails({
                  date: "",
                  time: "",
                  notes: "",
                });
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
