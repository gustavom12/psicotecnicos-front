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
    fecha: "24/6/2024-2025",
    horario: "11:00",
    duracion: "1 hora",
    estado: "en curso",
    entrevistado: "Laura González",
    profesional: "Mariano Pérez",
  },
  {
    key: "2",
    fecha: "24/6/2024",
    horario: "11:00",
    duracion: "1 hora",
    estado: "en curso",
    entrevistado: "Laura González",
    profesional: "Mariano Pérez",
  },
  {
    key: "3",
    fecha: "24/6/2024",
    horario: "11:00",
    duracion: "1 hora",
    estado: "en curso",
    entrevistado: "Laura González",
    profesional: "Mariano Pérez",
  },
  {
    key: "4",
    fecha: "24/6/2024",
    horario: "11:00",
    duracion: "1 hora",
    estado: "en curso",
    entrevistado: "Laura González",
    profesional: "Mariano Pérez",
  },
  {
    key: "5",
    fecha: "24/6/2024",
    horario: "11:00",
    duracion: "1 hora",
    estado: "en curso",
    entrevistado: "Laura González",
    profesional: "Mariano Pérez",
  },
];

const columns = [
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
  },
];

const TableInterviews = () => {
  const [selectedKeys, setSelectedKeys] = React.useState([]);
  return (
    <Table
      aria-label="Tabla de entrevistas"
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      onSelectionChange={setSelectedKeys}
      className="shadow-none border border-none "
      isStriped={true}
      isCompact={true}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          // <>
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
};

export default TableInterviews;
