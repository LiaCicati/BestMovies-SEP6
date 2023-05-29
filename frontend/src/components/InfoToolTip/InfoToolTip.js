import './InfoToolTip.css'
import React from 'react';
const InfoTooltip = ({ onClose, isOpen, image, message }) => {
  return (
    <section className={`modal-tooltip ${isOpen && "modal-tooltip_opened"}`}>
      <div className="modal-tooltip__container">
        <img className="modal-tooltip__image" src={image} alt="Status" />
        <h2 className="modal-tooltip__message">{message}</h2>
        <button
          className="modal-tooltip__close-button"
          type="button"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
    </section>
  );
};

export default InfoTooltip;
