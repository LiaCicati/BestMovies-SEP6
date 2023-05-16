import "./Form.css";
import React from "react";
const Form = ({ onSubmit, children, name, noValidate }) => {
  return (
    <form
      className="form"
      name={name}
      onSubmit={onSubmit}
      noValidate={noValidate}
    >
      {children}
    </form>
  );
};

export default Form;
