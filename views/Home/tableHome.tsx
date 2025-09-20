import React, { useState, useEffect } from "react";
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

import Pencil2 from "@/public/icons/pencil2";
import Document from "@/public/icons/document";
import Trash from "@/public/icons/trashgrey";
import apiConnection from "@/pages/api/api";

interface Survey {
  _id: string;
  name: string;
  position: string;
  description: string;
  modules?: any[];
  createdBy?: any;
}

interface TableHomeProps {
  data?: Survey[];
  onRefresh?: () => void;
}

const TableHome: React.FC<TableHomeProps> = ({ data, onRefresh }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setSurveys(data);
    } else {
      loadSurveys();
    }
  }, [data]);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const response = await apiConnection.get("/surveys");
      const surveysData = response.data?.data || response.data || [];
      setSurveys(Array.isArray(surveysData) ? surveysData.slice(0, 5) : []); // Mostrar solo los primeros 5
    } catch (error) {
      console.error("Error loading surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta encuesta?")) {
      return;
    }
    try {
      await apiConnection.delete(`/surveys/${id}`);
      loadSurveys();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "position",
      label: "Posición",
    },
    {
      key: "description",
      label: "Descripción",
    },
    {
      key: "modules",
      label: "Módulos",
    },
    {
      key: "actions",
      label: "Acciones",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Table
      aria-label="Tabla de encuestas recientes"
      className="shadow-none border border-none"
      isStriped={true}
      isCompact={true}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn className="text-[14px]" key={column.key}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={surveys.map(survey => ({ ...survey, key: survey._id }))}>
        {(item) => (
          <TableRow key={item.key} className="mt-4">
            {(columnKey) => (
              <TableCell>
                {columnKey === "actions" ? (
                  <div className="flex gap-2">
                    <Link href={`/surveys/${item._id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <Pencil2 />
                      </button>
                    </Link>
                    <Link href={`/survey/${item._id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <Document />
                      </button>
                    </Link>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash />
                    </button>
                  </div>
                ) : columnKey === "modules" ? (
                  <span className="text-sm font-medium">
                    {Array.isArray(item.modules) ? item.modules.length : 0}
                  </span>
                ) : columnKey === "description" ? (
                  <span className="text-sm text-gray-600 truncate max-w-xs">
                    {getKeyValue(item, columnKey) || "Sin descripción"}
                  </span>
                ) : (
                  <span className="text-sm">
                    {getKeyValue(item, columnKey) || "N/A"}
                  </span>
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
