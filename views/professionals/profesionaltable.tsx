import Document from "@/public/icons/document";
import Pencil2 from "@/public/icons/pencil2";
import Trash from "@/public/icons/trashgrey";
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


const rows = [
  {
    key: "1",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
    rol: "Admin",
  },
  {
    key: "2",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
    rol: "Admin",
  },
  {
    key: "3",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
    rol: "--",
  },
  {
    key: "4",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
    rol: "--",
  },
  {
    key: "5",
    name: "Damián Flores",
    company: "Arcor",
    interviews: "5",
    email: "damian.flores@gmail.com",
    rol: "--",
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
    key: "rol",
    label: "Rol",
  },
  {
    key: "actions",
    label: "",
  },
];


const ProfessionalTableCommon = () => {
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

  )
}
export default ProfessionalTableCommon;
