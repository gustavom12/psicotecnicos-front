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
import Link from "next/link";
import { useAuthContext } from "@/contexts/auth.context";
import apiConnection from "@/pages/api/api";
import { Notification } from "./notification";

const columns = [
  {
    key: "fullname",
    label: "Nombre",
  },
  {
    key: "email",
    label: "E-mail",
  },
  {
    key: "roles",
    label: "Rol",
  },
  {
    key: "actions",
    label: "Acciones",
  },
];

const ProfessionalTableCommon = ({
  data,
  fetchData,
}: {
  data?: Array<any>;
  fetchData;
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set());
  const { user } = useAuthContext();

  const handleDelete = async (id: string) => {
    try {
      const { data } = await apiConnection.delete(`/users/${id}`);
      Notification("Usuario eliminado correctamente", "success");
      fetchData();
    } catch (error) {
      Notification("Ocurrió un error eliminando al usuario", "success");
    }
  };

  return (
    <Table
      aria-label="Tabla de entrevistas"
      // selectedKeys={selectedKeys}
      selectionMode="multiple"
      // onSelectionChange={setSelectedKeys}
      className="shadow-none border-none"
      style={{ border: "none", boxShadow: "none", borderBlock: "none" }}
      classNames={{ table: "border-none shadow-none " }}
    >
      <TableHeader columns={columns} className="checkbox-hidden">
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={data.map((e) => ({ ...e, key: e._id }))}>
        {(item) => (
          <TableRow key={item.key} className="mt-4">
            {(columnKey) => {
              return (
                <TableCell>
                  {columnKey === "actions" ? (
                    <div className="flex gap-2">
                      <Link href={`/professional/${item.key}`}>
                        <button className="text-blue-500 hover:text-blue-700">
                          <Pencil2 />
                        </button>
                      </Link>
                      {/* <button className="text-blue-500 hover:text-blue-700">
                        <Document />
                      </button> */}
                      {user.roles.includes("owner") &&
                        item.key !== user._id &&
                        !item.roles.includes("owner") && (
                          <button
                            onClick={() => handleDelete(item.key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash />
                          </button>
                        )}
                    </div>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default ProfessionalTableCommon;
