import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql";
import { Button } from "./Button";
import React from "react";
interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const { data = {} } = useMeQuery();
  const router = useRouter();

  const redirectToRegister = () => {
    router.push("/auth/register");
  };

  return (
    <nav className="font-sans bg-primary-900 flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full">
      <div className="mb-2 sm:mb-0">
        <a
          href="/"
          className="text-2xl no-underline text-primary-200 hover:text-blue-dark"
        >
          Reanvue
        </a>
      </div>
      <div>
        {data.me?.id ? (
          <>
            <a
              href="/explore"
              className="text-lg no-underline text-primary-200 hover:text-blue-dark ml-2 hover:text-primary-100"
            >
              Explore
            </a>
            <a
              href="/messages"
              className="text-lg no-underline text-primary-200 hover:text-blue-dark ml-2 hover:text-primary-100"
            >
              Messages
            </a>
            <a
              href="/profile"
              className="text-lg no-underline text-primary-200 hover:text-blue-dark ml-2 hover:text-primary-100"
            >
              {data.me.username}
            </a>
          </>
        ) : (
          <div className="flex justify-center">
            <Button color="primary-300" transition onClick={redirectToRegister}>
              Register
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
