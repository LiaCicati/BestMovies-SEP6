import "./Input.css";
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
  defaultValue,
  editProfile,
  auth,
  disabled,
}) => {
  return (
    <>
      {auth && (
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
        </>
      )}

      {editProfile && (
        <div
          className={`input__container ${
            error ? "input__container_error" : ""
          }`}
        >
          <label className="input__label_type_profile" htmlFor="name">
            {label}
          </label>
          <input
            className={`input input_type_profile ${
              error ? "input__error input__error_type_profile" : ""
            }`}
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
            defaultValue={defaultValue}
            disabled={disabled}
          />
        </div>
      )}

      {error && <span className="input__error-message">{error}</span>}
    </>
  );
};

export default Input;
