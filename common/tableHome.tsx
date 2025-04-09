import Document from "@/public/icons/document";
import Pencil2 from "@/public/icons/pencil2";
import Trash from "@/public/icons/trashgrey";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";

import React from "react";


const rows = [
  {
    key: "1",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulo: "5",
  },
  {
    key: "2",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulo: "5",
  },
  {
    key: "3",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulo: "5",
  },
  {
    key: "4",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulo: "5",
  },
  {
    key: "5",
    nombre: "Arcor 2024 - Postulantes Junior Operario",
    empresa: "Arcor",
    creador: "Natalia Rodríguez",
    modulo: "5",
  },
];

const columns = [
  {
    key: "nombre",
    label: "Nombre",
  },
  {
    key: "empresa",
    label: "Empresa",
  },
  {
    key: "creador",
    label: "Creador",
  },
  {
    key: "modulo",
    label: "Modulo",
  },
  {
    key: "actions",
    label: "",
  },
];



const TableHome = () => {
  return (
    <Table
      aria-label="Tabla de entrevistas"
      // selectedKeys={selectedKeys}
      // selectionMode="single"
      // onSelectionChange={setSelectedKeys}
      selectionMode="multiple"
      classNames={{
        thead: "thead tr th:first-child { display: none; }"
      }}

      // className="shadow-none border border-none "
      isStriped={true}
      isCompact={true}
    >
      <TableHeader columns={columns} >
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows} >
        {(item) => (
          // <>
          <TableRow key={item.key} className="mt-4" >
            {(columnKey) => (
              <TableCell>
                {columnKey === "actions" ? (
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Pencil2 />
                    </button>
                    <button className="text-blue-500 hover:text-blue-700">
                      <Document />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash />
                    </button>
                  </div>
                ) : (
                  getKeyValue(item, columnKey)
                )}
              </TableCell>
            )}


          </TableRow>

        )}

      </TableBody>

    </Table>
  );
};

export default TableHome;
