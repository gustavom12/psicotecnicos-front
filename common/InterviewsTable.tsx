import Document from "@/public/icons/document";
import Pencil2 from "@/public/icons/pencil2";
import Trash from "@/public/icons/trashgrey";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";

const _rows = [
  {
    key: "1",
    fecha: "24/6/2024-2025",
    horario: "11:00",
    duracion: "1 hora",
    estado: "en curso",
    entrevistado: "Laura González",
    profesional: "Mariano Pérez",
  }
];

const _columns = [
  {
    key: "fecha",
    label: "Fecha",
  },
  {
    key: "horario",
    label: "Horario",
  },
  {
    key: "duracion",
    label: "Duración",
  },
  {
    key: "estado",
    label: "Estado",
  },
  {
    key: "entrevistado",
    label: "Entrevistado",
  },
  {
    key: "profesional",
    label: "Profesional",
  },
  {
    key: "actions",
    label: "Acciones",
    render: () => <></>,
  },
];

const TableInterviews = ({ data, columns }: any) => {


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
      <TableBody items={data.map((e) => ({ ...e, key: e._id })) || _rows}>
        {(item: any) => (
          // <>
          <TableRow key={item.key} className="mt-4">
            {(columnKey) => {
              const column = columns?.find((e) => e.key === columnKey);
              return (
                <TableCell>
                  {column?.render
                    ? column.render(getKeyValue(item, columnKey), item)
                    : getKeyValue(item, columnKey)}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableInterviews;
