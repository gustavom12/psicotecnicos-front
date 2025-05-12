import React from "react";
import MenuLeft from "./menu/MenuLeft";
import NavbarApp from "@/common/navbar";

const AuthLayout = ({ children }) => {
  return (
    <>
      <div className="flex flex-row w-full ">
        <div>
          <MenuLeft />
        </div>

        <div className="w-full ml-10 mr-10">
          <NavbarApp />
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
