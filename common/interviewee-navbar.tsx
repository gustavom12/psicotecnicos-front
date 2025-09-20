import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useIntervieweeAuthContext } from "@/contexts/interviewee-auth.context";
import { User, LogOut, Settings } from "lucide-react";

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

interface IntervieweeNavbarProps {
  links?: { label: string; href: string }[];
}

export default function IntervieweeNavbar({ links }: IntervieweeNavbarProps) {
  const { logout, interviewee } = useIntervieweeAuthContext();

  if (!links || links.length === 0) {
    links = [{ label: "Mis Entrevistas", href: "/interviewee" }];
  }

  const handleLogout = () => {
    logout();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last;
  };

  const getFullName = () => {
    if (!interviewee?.personalInfo) return "Usuario";
    const { firstName, lastName } = interviewee.personalInfo;
    return `${firstName || ""} ${lastName || ""}`.trim() || interviewee.email;
  };

  return (
    <Navbar
      classNames={{ wrapper: "px-0 max-w-[2000px]" }}
      className="flex flex-col w-full px-0 m-0 border-b border-gray-200"
    >
      <NavbarBrand className="m-0 px-0">
        <div className="flex items-center gap-3">
          <AcmeLogo />
          <div className="flex items-center gap-2">
            {links?.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Link
                  href={link.href}
                  className="text-[#A1A1AA] text-[16px] font-light hover:text-[#635BFF] transition-colors"
                >
                  {link.label}
                </Link>
                {index < links.length - 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    color="#A1A1AA"
                    width="16px"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </NavbarBrand>

      <NavbarContent justify="end" className="m-0 p-0">
        <NavbarItem className="flex items-center justify-around m-0 p-0">
          {/* Company Badge */}
          {interviewee?.companyName && (
            <div className="hidden md:flex items-center gap-2 mr-4 px-3 py-1 bg-blue-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-700 font-medium">
                {interviewee.companyName}
              </span>
            </div>
          )}

          {/* User Dropdown */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(
                    interviewee?.personalInfo?.firstName,
                    interviewee?.personalInfo?.lastName
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {getFullName()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {interviewee?.personalInfo?.position || "Candidato"}
                  </p>
                </div>
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile info">
                <div className="flex flex-col">
                  <p className="font-semibold text-gray-900">
                    {getFullName()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {interviewee?.email}
                  </p>
                  {interviewee?.companyName && (
                    <p className="text-xs text-blue-600">
                      {interviewee.companyName}
                    </p>
                  )}
                </div>
              </DropdownItem>

              <DropdownItem key="divider" className="p-0">
                <div className="border-t border-gray-200 my-1"></div>
              </DropdownItem>

              <DropdownItem
                key="settings"
                startContent={<Settings className="w-4 h-4" />}
                textValue="Settings"
              >
                Configuración
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                startContent={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
                textValue="Logout"
              >
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

