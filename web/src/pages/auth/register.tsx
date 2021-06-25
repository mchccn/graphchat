import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useRegisterMutation } from "../../generated/graphql";
import capitalizeFirstLetter from "../../utils/capitalize";

const Register = () => {
  const [register] = useRegisterMutation();
  const [serverError, setServerError] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div className="grid place-items-center text-center w-full h-full">
      <div className="flex m-auto flex-col px-6 pt-6 pb-4 gap-5 bg-primary-800 sm:rounded-8 z-10 sm:w-400 w-full">
        <span className="text-3xl text-primary-100 font-bold text-center">
          Welcome to Reanvue
        </span>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
          }}
          onSubmit={async (values) => {
            if (!values.username.trim())
              return setError(`username cannot be empty`);

            if (!values.email.trim()) return setError(`email cannot be empty`);

            if (!values.password.trim())
              return setError(`password cannot be empty`);

            if (!values.confirmpassword.trim())
              return setError(`password confirmation cannot be empty`);

            if (values.password !== values.confirmpassword)
              return setError(`password does not match`);

            const { data, errors } = await register({
              variables: {
                username: values.username,
                email: values.email,
                password: values.password,
              },
            });

            if (errors?.length) {
              setServerError(errors[0].message);

              return;
            }

            if (data?.register.errors) {
              setError(data.register.errors[0].message);

              return;
            }

            return router.push("/");
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <Input
                className="my-1.75"
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
              />
              <Input
                className="my-1.75"
                placeholder="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
              />
              <Input
                className="my-1.75"
                placeholder="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              <Input
                className="my-1.75"
                placeholder="Confirm Password"
                type="password"
                name="confirmpassword"
                value={values.confirmpassword}
                onChange={handleChange}
              />
              <Button
                className="justify-center text-base py-3 mt-2 w-full"
                color="primary-300"
                transition={true}
                ringSize={4}
                type="submit"
                loading={isSubmitting}
              >
                Register
              </Button>
              <span className="text-red-500 block h-4 mt-2 mb-1">
                {capitalizeFirstLetter(error) ||
                  capitalizeFirstLetter(serverError) ||
                  ""}
              </span>
              <p className="text-md text-primary-200">
                Already have an account?
                <a className="text-accent m-1" href="/auth/login">
                  Log in
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
