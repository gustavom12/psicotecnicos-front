
import Bell from "@/public/icons/Bell";
import Person from "@/public/icons/Person";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavbarApp() {
  return (
    <Navbar className="flex-col w-[1199] top-0 right-0 ">
      <NavbarBrand>

        <p className="text-[#A1A1AA] font-light">Text here</p>
        <svg xmlns="http://www.w3.org/2000/svg" color="#A1A1AA" width="20px" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
        </svg>

        <p className="text-[#A1A1AA] font-light">Text here</p>
        <svg xmlns="http://www.w3.org/2000/svg" color="#A1A1AA" width="20px" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
        </svg>
        <p className="text-[#3F3F46] font-light">Text here</p>

      </NavbarBrand>

      <NavbarContent justify="end">

        <NavbarItem className="flex items-center justify-around">

          <button className="p-4">
            <Bell />
          </button>
          <button>
            <Person />
          </button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>

  );
}
