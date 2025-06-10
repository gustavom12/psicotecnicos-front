import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
} from "@heroui/react";
import Trash from "@/public/icons/trashgrey";
import Pencil2 from "@/public/icons/pencil2";
import Addition from "@/public/icons/addition";
import AuthLayout from "@/layouts/auth.layout";
import apiConnection from "@/pages/api/api";

const columns = [
  { key: "title", label: "Nombre" },
  { key: "category", label: "Categoría" },
  { key: "slides", label: "Cantidad de slides" },
  { key: "actions", label: "Acciones" },
];

const ModulesList = () => {
  const [modules, setModules] = useState([]);

  const findModules = async () => {
    try {
      const { data } = await apiConnection.get(`/forms/filtered`);
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  useEffect(() => {
    findModules();
  }, []);

  return (
    <AuthLayout links={[{ label: "Módulos", href: "/modules" }]}>
      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Módulos</h1>
          <div className="flex gap-3">
            <Link href="/modules/new">
              <Button className="flex items-center gap-1 bg-[#635BFF1A] text-[#635BFF] px-3 py-1 rounded-md">
                <Addition fill="#635BFF" />
                Nuevo módulo
              </Button>
            </Link>
            <Link href="/modules/new?previousForm=true">
              <Button className="flex items-center gap-1 bg-[#635BFF1A] text-[#635BFF] px-3 py-1 rounded-md">
                <Addition fill="#635BFF" />
                Nuevo formulario
              </Button>
            </Link>
          </div>
        </header>

        <Table
          aria-label="Tabla de módulos"
          isStriped
          isCompact
          className="shadow-none border border-none"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn className="text-[14px]" key={column.key}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={modules}>
            {(item) => (
              <TableRow key={item.id || item._id}>
                {(columnKey) => {
                  let value = getKeyValue(item, columnKey);
                  if (columnKey === "actions") {
                    value = (
                      <div className="flex gap-2">
                        <Link href={`/modules/${item.id || item._id}`}>
                          <button>
                            <Pencil2 />
                          </button>
                        </Link>
                        <button>
                          <Trash />
                        </button>
                      </div>
                    );
                  }
                  if (columnKey === "slides") {
                    value = item.slides ? item.slides.length : 0;
                  }
                  return <TableCell>{value}</TableCell>;
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </AuthLayout>
  );
};

export default ModulesList;
