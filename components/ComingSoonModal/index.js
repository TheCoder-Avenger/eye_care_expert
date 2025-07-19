"use client";

import { useUser } from "@/context/UserContext";
import "./style.scss";

const ComingSoonModal = () => {
  const { comingSoonModal, setComingSoonModal } = useUser();

  if (!comingSoonModal.isVisible) return null;

  const handleClose = () => {
    setComingSoonModal((prev) => ({ ...prev, isVisible: false }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="coming-soon-modal" onClick={handleBackdropClick}>
      <div className="coming-soon-modal__content">
        <button
          className="coming-soon-modal__close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="coming-soon-modal__header">
          <div className="coming-soon-modal__icon">🚀</div>
          <h2>Coming Soon!</h2>
        </div>

        <div className="coming-soon-modal__body">
          <p className="coming-soon-modal__message">
            {comingSoonModal.message}
          </p>
          <p className="coming-soon-modal__description">
            We're working hard to bring you the best eyecare experience. Stay
            tuned for updates and new features!
          </p>
        </div>

        <div className="coming-soon-modal__footer">
          <button
            className="coming-soon-modal__btn coming-soon-modal__btn--primary"
            onClick={handleClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
