import Person from "@/public/icons/Person";
import Star from "@/public/icons/Star";
import { Button } from "@heroui/button";
import React from "react";
import MenuItem from "./menuItem";
import { useAuthContext } from "@/contexts/auth.context";
import {
  BookOpenText,
  Building2,
  House,
  MessageCircleCode,
  Puzzle,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function MenuLeft() {
  const { user } = useAuthContext();

  return (
    <aside className="sticky top-0 flex h-screen w-[250px] flex-col bg-[#F4F4F5] border-r border-gray-200 shadow-sm">
      <div className="flex flex-row ml-[25px] items-center mt-4 h-16 ">
        <Star />
        <p
          className=" text-[#635BFF] font-semibold px-2 "
          style={{ fontSize: "20px" }}
        >
          Psicotécnicos
        </p>
      </div>


      <nav className="flex flex-col gap-1 px-4 py-2">
        <MenuItem title="Inicio" icon={<House className="w-5 h-5 text-zinc-500" />} href="/home" />
        <MenuItem title="Módulos" icon={<Puzzle className="w-5 h-5 text-zinc-500" />} href="/modules" />
        <MenuItem title="Evaluaciones" icon={<BookOpenText className="w-5 h-5 text-zinc-500" />} href="/surveys/table" />
        <MenuItem title="Entrevistas" icon={<MessageCircleCode className="w-5 h-5 text-zinc-500" />} href="/interviews/table" />
        <MenuItem title="Profesionales" icon={<User className="w-5 h-5 text-zinc-500" />} href="/professional/table" />
        <MenuItem title="Entrevistados" icon={<Users className="w-5 h-5 text-zinc-500" />} href="/interviewed/table" />
        <MenuItem title="Empresas" icon={<Building2 className="w-5 h-5 text-zinc-500" />} href="/companies" />
      </nav>

      <div className="mt-auto p-4">
        <Link href={`/professional/${user._id}`}>
          <Button
            radius="sm"
            variant="bordered"
            className="w-full flex items-center gap-3 bg-[#E4E4E7] hover:bg-[#d4d4d8] h-14 transition"
          >
            {user.imageURL ? (
              <img src={user.imageURL} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <Person />
            )}
            <span className="text-sm font-medium text-gray-700 truncate">{user.fullname || ""}</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
