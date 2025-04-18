import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from "@heroui/react";

import Pencil2 from "@/public/icons/pencil2";
import Document from "@/public/icons/document";
import Trash from "@/public/icons/trashgrey";

const rows = [
  {
    key: "1",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulos: "5",
  },
  {
    key: "2",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulos: "5",
  },
  {
    key: "3",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulos: "5",
  },
  {
    key: "4",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulos: "5",
  },
  {
    key: "5",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulos: "5",
  },
  {
    key: "6",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulos: "5",
  },
];

const TableHome = () => {
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  return (
    <div className="w-full">
      <Table
        aria-label="Tabla de entrevistas"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        className="w-full shadow-none !shadow-none"
        classNames={{
          base: "shadow-none !shadow-none !box-shadow-none",
          wrapper: "shadow-none !shadow-none !box-shadow-none",
          table: "border-none rounded-none m-0 p-0 shadow-none",
          thead: "bg-[#F4F4F5]",
          tr: "border-b border-gray-200 hover:bg-gray-50",
          th: "bg-gray-100 text-gray-600 font-medium py-3 px-4 h-[50px] text-left",
          td: "py-3 px-4 h-[50px]",
        }}
        radius="none"
        shadow={false}
      >
        <TableHeader className="bg-gray-400 border border-none">
          <TableColumn key="nombre" className="text-[16px] font-medium">
            Nombre
          </TableColumn>
          <TableColumn key="empresa" className="text-[16px] font-medium">
            Empresa
          </TableColumn>
          <TableColumn key="creador" className="text-[16px] font-medium">
            Creador
          </TableColumn>
          <TableColumn key="modulos" className="text-[16px] font-medium">
            Módulos
          </TableColumn>
          <TableColumn key="actions" className="text-right"></TableColumn>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key} className="h-[50px]">
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.empresa}</TableCell>
              <TableCell>{row.creador}</TableCell>
              <TableCell>{row.modulos}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <button className="p-2">
                  <Pencil2 />
                </button>
                <button className="p-2">
                  <Document />
                </button>
                <button className="p-2">
                  <Trash />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableHome;
