import { Form, Formik } from "formik";
import React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

const Register = () => {
  return (
    <div className="grid place-items-center w-full h-full">
      <div className="flex m-auto flex-col p-6 gap-5 bg-primary-800 sm:rounded-8 z-10 sm:w-400 w-full">
        <h1 className="text-3xl text-primary-100 font-bold text-center">
          Welcome to Reanvue
        </h1>
        <p className="text-primary-200 text-center">
          Hello there! By registering, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
          }}
          onSubmit={async (values, formik) => {
            console.log(values);
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <Input
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
              />
              <Input
                placeholder="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
              />
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                name="confirmpassword"
                value={values.confirmpassword}
                onChange={handleChange}
              />
              <Button
                className="justify-center text-base py-3 mt-2"
                color="primary-300"
                transition={true}
                ringSize={4}
                type="submit"
                loading={isSubmitting}
                style={{ width: "100%" }}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
