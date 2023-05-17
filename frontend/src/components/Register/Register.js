import Form from "../Form/Form";
import Input from "../Input/Input";
import Auth from "../Auth/Auth";
import "./Register.css";
import React from "react";
const Register = ({}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <section className="register">
      <h1 className="register__title">Register</h1>
      <Form name="register" onSubmit={handleSubmit}>
        <Input
          label="Name"
          id="name"
          name="name"
          type="text"
          minLength="2"
          maxLength="30"
          placeholder="Write your name"
        />
        <Input
          label="E-mail"
          id="email"
          name="email"
          type="email"
          placeholder="Write your email"
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          minLength="6"
          placeholder="Write a password"
          error="Something went wrong..."
        />
        <Auth
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
