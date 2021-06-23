import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useLoginMutation } from "../../generated/graphql";

const Login = () => {
  const [login] = useLoginMutation();
  const [serverError, setServerError] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div className="grid place-items-center w-full h-full">
      <div className="flex m-auto flex-col px-6 pt-6 pb-4 gap-5 bg-primary-800 sm:rounded-8 z-10 sm:w-400 w-full">
        <span className="text-3xl text-primary-100 font-bold text-center">
          Welcome back
        </span>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={async (values, formik) => {
            if (!values.username.trim())
              return setError(`username cannot be empty`);

            if (!values.password.trim())
              return setError(`password cannot be empty`);

            const { data, errors } = await login({
              variables: {
                username: values.username,
                password: values.password,
              },
            });

            if (errors?.length) {
              setServerError(errors[0].message);

              return;
            }

            if (data?.login.errors) {
              setError(data.login.errors[0].message);

              return;
            }

            return router.push("/");
          }}
        >
          {({ values, handleChange, isSubmitting, errors }) => (
            <Form>
              <Input
                placeholder="Username"
                name="username"
                value={values.username}
                style={{ marginTop: "8px", marginBottom: "8px" }}
                onChange={handleChange}
              />
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={values.password}
                style={{ marginTop: "8px", marginBottom: "8px" }}
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
                Log in
              </Button>
              <span className="text-red-500 block h-4 mt-2">
                {error || serverError || ""}
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
