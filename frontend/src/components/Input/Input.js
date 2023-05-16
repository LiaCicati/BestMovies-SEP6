import React from "react";
const Input = ({
  id,
  name,
  type,
  placeholder,
  minLength,
  maxLength,
  label,
  error,
  onChange,
  value,
}) => {
  return (
    <>
      <label className="input__label" htmlFor={name}>
        {label}
      </label>
      <input
        className={`input ${error ? "input__error" : ""}`}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        minLength={minLength}
        maxLength={maxLength}
        autoComplete="off"
        onChange={onChange}
        value={value}
        error={error}
      />

      {error && <span className="input__error-message">{error}</span>}
    </>
  );
};

export default Input;
