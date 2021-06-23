import React from "react";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Formik, Form } from "formik";
import { useRegisterMutation } from "../../generated/graphql";
import { useRouter } from "next/router";

const Register = () => {
  const [register] = useRegisterMutation();
  const router = useRouter();

  return (
    <div className="grid place-items-center w-full h-full">
      <div className="flex m-auto flex-col p-6 gap-5 bg-primary-800 sm:rounded-8 z-10 sm:w-400 w-full">
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
            if (values.password === values.confirmpassword) {
              const response = await register({
                variables: {
                  username: values.username,
                  email: values.email,
                  password: values.password,
                },
              });
              router.push("/");
            } else {
              throw Error("Passwords don't match!");
            }
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <Input
                placeholder="Username"
                name="username"
                value={values.username}
                style={{ marginTop: "8px", marginBottom: "8px" }}
                onChange={handleChange}
              />
              <Input
                placeholder="Email"
                name="email"
                type="email"
                value={values.email}
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
              <Input
                placeholder="Confirm Password"
                type="password"
                name="confirmpassword"
                value={values.confirmpassword}
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
