import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";
import Trash from "@/public/icons/trashgrey";
import Document from "@/public/icons/document";
import Pencil2 from "@/public/icons/pencil2";

const rows = [
  {
    key: "1",
    name: "Arcor2024-Postulantes Junior Operario",
    company: "Arcor",
    creator: "Natalia Rodriguez",
    module: "5",
  },
  {
    key: "2",
    name: "Arcor2024-Postulantes Junior Operario",
    company: "Arcor",
    creator: "Natalia Rodriguez",
    module: "5",
  },
  {
    key: "3",
    name: "Arcor2024-Postulantes Junior Operario",
    company: "Arcor",
    creator: "Natalia Rodriguez",
    module: "5",
  },
  {
    key: "4",
    name: "Arcor2024-Postulantes Junior Operario",
    company: "Arcor",
    creator: "Natalia Rodriguez",
    module: "5",
  },
  {
    key: "5",
    name: "Arcor2024-Postulantes Junior Operario",
    company: "Arcor",
    creator: "Natalia Rodriguez",
    module: "5",
  },
    {
    key: "6",
    name: "Arcor2024-Postulantes Junior Operario",
    company: "Arcor",
    creator: "Natalia Rodriguez",
    module: "5",
  },
];

const columns = [
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "company",
    label: "Empresa",
  },
  {
    key: "creator",
    label: "Creador",
  },
  {
    key: "module",
    label: "Modulos",
  },
  {
    key: "actions",
    label: "",
  },
];

export default function TableEvaluations() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());

  return (
    <Table
      aria-label="Tabla de entrevistas"
      // selectedKeys={selectedKeys}
      selectionMode="multiple"
      className="shadow-none border border-none "
      isStriped={true}
      isCompact={true}
    // onSelectionChange={setSelectedKeys}
    // className="shadow-none border-none "
    // style={{ border: "none", boxShadow: "none", borderBlock: "none"}}
    // classNames={{ table: "border-none shadow-none rounded-none " }}
    >
      <TableHeader columns={columns} className="checkbox-hidden ">
        {(column) => <TableColumn className="text-[14px] " key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key} className="mt-4 ">
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
}
