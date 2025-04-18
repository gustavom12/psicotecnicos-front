import Link from "next/link";
import React from "react";

const MenuItem = ({ icon, title, href }) => {
  return (
    <Link href={href}>
      <button className="flex text-center px-2  py-2 w-[200px]">
        {icon}
        <p className="mx-4 text-[16px] font-normal text-[#3F3F46] px-2">
          {title}
        </p>
      </button>
    </Link>
  );
};

export default MenuItem;
