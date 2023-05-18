import "./Login.css";
import Form from "../Form/Form";
import Input from "../Input/Input";
import Auth from "../Auth/Auth";
import { useFormWithValidation } from "../../utils/formValidation";
import React from "react";

const Login = ({ onLogin }) => {
  const { values, errors, isValid, handleChange } = useFormWithValidation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(values.email, values.password);
  };

  return (
    <section className="login">
      <h1 className="login__title">Login</h1>
      <Form name="login" onSubmit={handleSubmit} noValidate>
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
          placeholder="Write your password"
          value={values.password || ""}
          error={errors.password}
          onChange={handleChange}
        />
        <Auth
          isDisabledButton={!isValid}
          buttonText="Login"
          paragraph="Don't have an account?"
          linkText="Register"
          href="/signup"
        />
      </Form>
    </section>
  );
};

export default Login;
