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

const _rows = [
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

const _columns = [
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
    label: "Acciones",
  },
];

export default function Tables({ data, columns }: any) {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());

  return (
    <Table
      aria-label="Tabla de entrevistas"
      //selectedKeys={selectedKeys}
      //selectionMode="multiple"
      // onSelectionChange={setSelectedKeys}
      className="shadow-none border border-none "
      isStriped={true}
      isCompact={true}
    >
      <TableHeader columns={columns || _columns}>
        {(column: any) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody items={data || _rows}>
        {(item: any) => (
          // <>
          <TableRow key={item.key} className="mt-4">
            {(columnKey) => (
              <TableCell>
                {columnKey === "actions"
                  ? columns
                    ?.find((e) => e.key === columnKey)
                    .render(getKeyValue(item, columnKey), item)
                  : getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
