import React from "react";

export default function Register() {
  // ! fix this

  return (
    <div className="grid place-items-center w-full h-full">
      <div className="flex m-auto flex-col p-6 gap-5 bg-primary-800 sm:rounded-8 z-10 sm:w-400 w-full">
        <div className="flex gap-2 flex-col">
          <span className="text-3xl text-primary-100 font-bold text-center">
            Welcome to Reanvue
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <button className="transition duration-250 ease-in-out flex outline-none focus:ring focus:ring-accent px-6 rounded-lg text-button bg-primary-700 hover:bg-primary-600 disabled:text-primary-300 font-bold items-center justify-center text-lg py-3 mt-2">
            <span className="flex items-center">
              <div className="grid gap-4">Register</div>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
