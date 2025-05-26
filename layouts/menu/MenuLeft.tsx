// import StarIcon from "@/public/icons/Star";
import Bell from "@/public/icons/Bell";
import Home from "@/public/icons/home";
import Man from "@/public/icons/ManIcon";
import Messages from "@/public/icons/messages";
import Modulo from "@/public/icons/modulo";
import Note from "@/public/icons/note";
import Person from "@/public/icons/Person";
import Photo from "@/public/icons/photo";
import Profesional from "@/public/icons/profesional";
import Star from "@/public/icons/Star";
import { Button } from "@heroui/button";
import { Module } from "module";
import React from "react";
import MenuItem from "./menuItem";
import { useAuthContext } from "@/contexts/auth.context";

export default function MenuLeft() {
  const { user } = useAuthContext();

  return (
    <div
      className="flex flex-col  rounded-lg  h-screen "
      style={{ width: "240px", backgroundColor: "#F4F4F5" }}
    >
      <div className="flex flex-row justify-center items-center mt-4 h-16 ">
        <Star />
        <p
          className=" text-[#635BFF] font-semibold px-2 "
          style={{ fontSize: "20px" }}
        >
          Psicotécnicos
        </p>
      </div>

      <div className="flex flex-col p-4">
        <MenuItem title="Inicio" icon={<Home />} href={"/home"} />

        <MenuItem title="Módulos" icon={<Modulo />} href={"/modules"} />

        <MenuItem
          title="Evaluaciones"
          icon={<Messages />}
          href={"/surveys/table"}
        />

        <MenuItem
          title="Entrevistas"
          icon={<Messages />}
          href={"/interviews/table"}
        />

        <MenuItem
          title="Profesionales"
          icon={<Profesional />}
          href={"/professional/table"}
        />

        <MenuItem
          title="Entrevistados"
          icon={<Man />}
          href={"/interviewed/table"}
        />

        <MenuItem title="Empresas" icon={<Note />} href={"/companies"} />
      </div>
      <div className="absolute bottom-0  w-full p-4">
        <Button
          radius="sm"
          variant="bordered"
          className="flex flex-row bg-[#D4D4D8] h-14  "
        >
          {user.imageURL ? (
            <img src={user?.imageURL} className="w-[50px] rounded" />
          ) : (
            <Person />
          )}
          {user.fullname || ""}
        </Button>
      </div>
    </div>
  );
}
