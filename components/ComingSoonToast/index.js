"use client";

import { useUser } from "@/context/UserContext";
import "./style.scss";

const ComingSoonToast = () => {
  const { comingSoonToast, setComingSoonToast } = useUser();

  if (!comingSoonToast.isVisible) return null;

  const handleClose = () => {
    setComingSoonToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="coming-soon-toast">
      <div className="coming-soon-toast__content">
        <div className="coming-soon-toast__icon">🚀</div>
        <div className="coming-soon-toast__message">
          <h4>Coming Soon!</h4>
          <p>{comingSoonToast.message}</p>
        </div>
        <button
          className="coming-soon-toast__close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ComingSoonToast;
