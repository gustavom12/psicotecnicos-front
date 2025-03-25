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
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
  },
  {
    key: "2",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
  },
  {
    key: "3",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
  },
  {
    key: "4",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
  },
  {
    key: "5",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
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
    key: "interviews",
    label: "Entrevistas",
  },
  {
    key: "email",
    label: "E-mail",
  },
  {
    key: "actions",
    label: "",
  },
];

export default function Tables() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());

  return (
    <Table
      aria-label="Tabla de entrevistas"
      // selectedKeys={selectedKeys}
      selectionMode="multiple"
    // onSelectionChange={setSelectedKeys}
    className="shadow-none border-none"
    style={{ border: "none", boxShadow: "none", borderBlock: "none" }}
    classNames={{table: "border-none shadow-none " }}
    >
      <TableHeader columns={columns} className="checkbox-hidden">
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key} className="mt-4">
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
