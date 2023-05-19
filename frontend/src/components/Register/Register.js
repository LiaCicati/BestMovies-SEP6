import Form from "../Form/Form";
import Input from "../Input/Input";
import Auth from "../Auth/Auth";
import "./Register.css";
import React from "react";
import { useFormWithValidation } from "../../utils/formValidation";

const Register = ({ onRegister }) => {
  const { values, errors, isValid, handleChange } = useFormWithValidation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(values.name, values.email, values.password);
  };

  return (
    <section className="register">
      <h1 className="register__title">Register</h1>
      <Form name="register" onSubmit={handleSubmit} noValidate>
        <Input
          label="Name"
          id="name"
          name="name"
          type="text"
          minLength="2"
          maxLength="30"
          placeholder="Write your name"
          onChange={handleChange}
          value={values.name || ""}
          error={errors.name}
        />
        <Input
          label="E-mail"
          id="email"
          name="email"
          type="email"
          placeholder="Write your email"
          value={values.email || ""}
          error={errors.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          minLength="6"
          placeholder="Write a password"
          value={values.password || ""}
          error={errors.password}
          onChange={handleChange}
        />
        <Auth
          isDisabledButton={!isValid}
          buttonText="Register"
          paragraph="Already have an account?"
          linkText="Login"
          href="/signin"
        />
      </Form>
    </section>
  );
};

export default Register;
