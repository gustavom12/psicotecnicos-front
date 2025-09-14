import ArrowRight from "@/public/icons/arrowright";
import Bell from "@/public/icons/Bell";
import Person from "@/public/icons/Person";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useAuthContext } from "@/contexts/auth.context";

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

export default function NavbarApp({
  links,
}: {
  links?: { label: string; href: string }[];
}) {
  const { logout, user } = useAuthContext();

  if (!links || links.length === 0) {
    links = [{ label: "Inicio", href: "/" }];
  }

  const handleLogout = () => {
    logout();
  };
  return (
    <Navbar
      classNames={{ wrapper: "px-0 max-w-[2000px]" }}
      className=" flex flex-col w-full px-0 m-0 "
    >
      <NavbarBrand className="m-0 px-0">
        {links?.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="flex items-center gap-2 text-[#A1A1AA] text-[16px] font-light"
          >
            <p className="text-[#A1A1AA] text-[16px] font-light">
              {link.label}
            </p>
            {index < links.length - 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                color="#A1A1AA"
                width="20px"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Link>
        ))}
      </NavbarBrand>

      <NavbarContent justify="end" className="m-0 p-0">
        <NavbarItem className="flex items-center justify-around m-0 p-0">
          {/* <button className="p-2">
            <Bell />
          </button> */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Person />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Sesión iniciada como</p>
                <p className="font-semibold">{user?.email || "Usuario"}</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
