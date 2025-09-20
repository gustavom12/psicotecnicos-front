import TableInterviews from "@/common/InterviewsTable";
import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Addition from "@/public/icons/addition";
import Pencil2 from "@/public/icons/pencil2";
import Trash from "@/public/icons/trashgrey";
import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";

const TableInterviewsView = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [intervieweesMap, setIntervieweesMap] = useState(new Map());
  const [professionalsMap, setProfessionalsMap] = useState(new Map());

  const loadInterviews = async () => {
    console.log("loadInterviews");
    try {
      setLoading(true);

      // Cargar entrevistas, entrevistados y profesionales en paralelo
      const [interviewsRes, intervieweesRes, professionalsRes] =
        await Promise.all([
          apiConnection.get("/interviews/filtered"),
          apiConnection.get("/interviewees/filtered"),
          apiConnection.get("/users/table"),
        ]);

      console.log("Interviews data:", interviewsRes.data);
      console.log("Interviewees response:", intervieweesRes.data);
      console.log("Professionals response:", professionalsRes.data);

      // Crear mapas para búsqueda rápida
      const intervieweesMap = new Map();
      // La respuesta de interviewees tiene estructura { data: [], pagination: {} }
      const intervieweesData =
        intervieweesRes.data?.data || intervieweesRes.data || [];
      if (Array.isArray(intervieweesData)) {
        intervieweesData.forEach((interviewee) => {
          const firstName =
            interviewee.personalInfo?.firstName || interviewee.firstName || "";
          const lastName =
            interviewee.personalInfo?.lastName || interviewee.lastName || "";
          const fullName =
            firstName && lastName
              ? `${firstName} ${lastName}`
              : interviewee.email || "Sin nombre";
          intervieweesMap.set(interviewee._id, {
            ...interviewee,
            displayName: fullName,
          });
        });
      }

      const professionalsMap = new Map();
      // La respuesta de users puede ser un array directamente o tener estructura similar
      const professionalsData =
        professionalsRes.data?.data || professionalsRes.data || [];
      if (Array.isArray(professionalsData)) {
        professionalsData.forEach((professional) => {
          const firstName = professional.firstName || "";
          const lastName = professional.lastName || "";
          const displayName =
            firstName && lastName
              ? `${firstName} ${lastName}`
              : professional.fullname || professional.email || "Sin nombre";
          professionalsMap.set(professional._id, {
            ...professional,
            displayName,
          });
        });
      }

      setIntervieweesMap(intervieweesMap);
      setProfessionalsMap(professionalsMap);
      setData(interviewsRes.data);
      setFilteredData(interviewsRes.data);
    } catch (error) {
      console.log("error: ", error);
      console.error("Error loading data:", error);
      Notification("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta entrevista?")) {
      return;
    }
    try {
      await apiConnection.delete(`/interviews/${id}`);
      Notification("Entrevista eliminada exitosamente", "success");
      loadInterviews();
    } catch (error) {
      console.error("Error deleting interview:", error);
      Notification("Error al eliminar la entrevista", "error");
    }
  };

  const handleStartInterview = async (id: string) => {
    try {
      await apiConnection.patch(`/interviews/${id}/start`);
      Notification("Entrevista iniciada exitosamente", "success");
      loadInterviews();
    } catch (error) {
      console.error("Error starting interview:", error);
      Notification("Error al iniciar la entrevista", "error");
    }
  };

  const handleCompleteInterview = async (id: string) => {
    const totalTimeSeconds = Math.floor(
      (new Date().getTime() - new Date().getTime()) / 1000,
    );
    try {
      await apiConnection.patch(`/interviews/${id}/complete`, {
        totalTimeSeconds,
      });
      Notification("Entrevista completada exitosamente", "success");
      loadInterviews();
    } catch (error) {
      console.error("Error completing interview:", error);
      Notification("Error al completar la entrevista", "error");
    }
  };

  const formatDate = (dateString: string) => {
    console.log("dateString: ", dateString);
    if (!dateString)
      return (
        <span className="text-gray-400 italic text-sm">No programada</span>
      );
    const date = new Date(dateString);
    return (
      <div className="text-sm">
        <div className="font-medium text-gray-900">
          {date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        <div className="text-xs text-gray-500 capitalize">
          {date.toLocaleDateString("es-ES", { weekday: "long" })}
        </div>
      </div>
    );
  };

  const formatTime = (dateString: string) => {
    if (!dateString)
      return <span className="text-gray-400 italic text-sm">--:--</span>;
    const date = new Date(dateString);
    return (
      <div className="text-sm font-mono font-medium text-gray-900">
        {date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
    );
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      DRAFT: {
        label: "Borrador",
        color: "bg-gray-100 text-gray-700",
        icon: "📝",
      },
      NOT_STARTED: {
        label: "No iniciada",
        color: "bg-amber-100 text-amber-700",
        icon: "⏳",
      },
      IN_PROGRESS: {
        label: "En progreso",
        color: "bg-blue-100 text-blue-700",
        icon: "🔄",
      },
      CLOSED: {
        label: "Finalizada",
        color: "bg-green-100 text-green-700",
        icon: "✅",
      },
    };

    console.log("status: ", status);

    const config = statusConfig[status] || {
      label: "Desconocido",
      color: "bg-gray-100 text-gray-700",
      icon: "❓",
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <span>{config.icon}</span>
        {config.label}
      </div>
    );
  };

  const getIntervieweesDisplay = (interviewees: any[]) => {
    if (!interviewees || interviewees.length === 0) {
      return <span className="text-gray-400 italic text-sm">Sin asignar</span>;
    }

    const displayNames = interviewees.map((i) => {
      if (typeof i === "string") {
        // Es un ID, buscar en el mapa
        const interviewee = intervieweesMap.get(i);
        return interviewee?.displayName || "Entrevistado";
      }
      // Es un objeto completo
      const firstName = i.personalInfo?.firstName || i.firstName || "";
      const lastName = i.personalInfo?.lastName || i.lastName || "";
      return firstName && lastName
        ? `${firstName} ${lastName}`
        : i.email || "Sin nombre";
    });

    return (
      <div className="text-sm">
        {displayNames.slice(0, 2).map((name, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-medium">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-medium text-gray-900">{name}</span>
          </div>
        ))}
        {displayNames.length > 2 && (
          <div className="text-xs text-gray-500 ml-8">
            +{displayNames.length - 2} más
          </div>
        )}
      </div>
    );
  };

  const getProfessionalsDisplay = (professionals: any[]) => {
    if (!professionals || professionals.length === 0) {
      return <span className="text-gray-400 italic text-sm">Sin asignar</span>;
    }

    const displayNames = professionals.map((p) => {
      if (typeof p === "string") {
        // Es un ID, buscar en el mapa
        const professional = professionalsMap.get(p);
        return professional?.displayName || "Profesional";
      }
      // Es un objeto completo
      return p.fullname || p.firstName || p.email || "Sin nombre";
    });

    return (
      <div className="text-sm">
        {displayNames.slice(0, 2).map((name, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs font-medium">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-medium text-gray-900">{name}</span>
          </div>
        ))}
        {displayNames.length > 2 && (
          <div className="text-xs text-gray-500 ml-8">
            +{displayNames.length - 2} más
          </div>
        )}
      </div>
    );
  };

  // Filtrar datos
  useEffect(() => {
    let filtered = data;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((interview) => {
        const title = interview.title?.toLowerCase() || "";
        const description = interview.description?.toLowerCase() || "";
        const searchLower = searchTerm.toLowerCase();

        // Buscar en entrevistados
        const intervieweesText = (interview.interviewees || [])
          .map((i) => {
            if (typeof i === "string") {
              const interviewee = intervieweesMap.get(i);
              return interviewee?.displayName || "";
            }
            const firstName = i.personalInfo?.firstName || i.firstName || "";
            const lastName = i.personalInfo?.lastName || i.lastName || "";
            return `${firstName} ${lastName}`.trim();
          })
          .join(" ")
          .toLowerCase();

        // Buscar en profesionales
        const professionalsText = (interview.professionals || [])
          .map((p) => {
            if (typeof p === "string") {
              const professional = professionalsMap.get(p);
              return professional?.displayName || "";
            }
            return p.fullname || p.firstName || p.email || "";
          })
          .join(" ")
          .toLowerCase();

        return (
          title.includes(searchLower) ||
          description.includes(searchLower) ||
          intervieweesText.includes(searchLower) ||
          professionalsText.includes(searchLower)
        );
      });
    }

    // Filtrar por estado
    if (statusFilter) {
      filtered = filtered.filter(
        (interview) => interview.status === statusFilter,
      );
    }

    setFilteredData(filtered);
  }, [data, searchTerm, statusFilter, intervieweesMap, professionalsMap]);

  return (
    <div className="flex flex-row w-full">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10 bg-gray-50 min-h-screen">
        <NavbarApp />

        <div className="flex justify-around pt-6">
          <div className="flex-col w-[1190px] bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-inter font-bold text-2xl text-gray-900">
                  Entrevistas
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestiona y monitorea todas tus entrevistas
                </p>
              </div>
              {/* <button className="bg-[#635BFF1A] text-[#635BFF] font-light py-2 px-4 rounded cursor-pointer">  New Companie</button> */}
              <Link href="/interviews/information">
                <Button className="bg-[#635BFF] text-white hover:bg-[#5B52E8] transition-colors duration-200 shadow-md hover:shadow-lg px-6 py-3 rounded-lg">
                  <Addition fill={"white"} />
                  <span className="font-medium ml-2">Nueva entrevista</span>
                </Button>
              </Link>
            </div>

            {/* Filtros */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar entrevistas
                  </label>
                  <Input
                    placeholder="Buscar por título, descripción o participantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                    startContent={<span className="text-gray-400">🔍</span>}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <Select
                    placeholder="Filtrar por estado"
                    className="w-52"
                    selectedKeys={statusFilter ? [statusFilter] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setStatusFilter(selectedKey || "");
                    }}
                  >
                    <SelectItem key="">Todos los estados</SelectItem>
                    <SelectItem key="DRAFT">📝 Borrador</SelectItem>
                    <SelectItem key="NOT_STARTED">⏳ No iniciada</SelectItem>
                    <SelectItem key="IN_PROGRESS">🔄 En progreso</SelectItem>
                    <SelectItem key="CLOSED">✅ Finalizada</SelectItem>
                  </Select>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#635BFF]">
                    {filteredData.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    de {data.length} entrevistas
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-16 bg-white rounded-lg border border-gray-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635BFF] mb-4"></div>
                  <div className="text-gray-600 font-medium">
                    Cargando entrevistas...
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    Por favor espere un momento
                  </div>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-16 bg-white rounded-lg border border-gray-200">
                  <div className="text-6xl mb-4">
                    {data.length === 0 ? "📝" : "🔍"}
                  </div>
                  <div className="text-gray-600 font-medium mb-2">
                    {data.length === 0
                      ? "No hay entrevistas registradas"
                      : "No se encontraron entrevistas"}
                  </div>
                  <div className="text-gray-400 text-sm text-center max-w-md">
                    {data.length === 0
                      ? 'Comience creando su primera entrevista haciendo clic en "Nueva entrevista"'
                      : "Intente ajustar los filtros de búsqueda o estado para encontrar las entrevistas deseadas"}
                  </div>
                  {data.length === 0 && (
                    <Link href="/interviews/information" className="mt-4">
                      <Button className="bg-[#635BFF] text-white hover:bg-[#5B52E8] transition-colors">
                        <Addition fill="white" />
                        <span className="ml-2">Crear primera entrevista</span>
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                 <TableInterviews
                   data={filteredData}
                   columns={[
                    {
                      key: "title",
                      label: "Título",
                      render: (value: string, item: any) => (
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {value || "Sin título"}
                          </p>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {item.description || "Sin descripción"}
                          </p>
                          {item.position && (
                            <div className="inline-flex items-center gap-1 mt-2">
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                📋 {item.position}
                              </span>
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: "scheduledAt",
                      label: "Fecha",
                      render: (value: string) => formatDate(value),
                    },
                    {
                      key: "scheduledAtHour",
                      label: "Horario",
                      render: (value: string, item: any) => formatTime(item.scheduledAt),
                    },
                    {
                      key: "status",
                      label: "Estado",
                      render: (value: string) => getStatusChip(value),
                    },
                    {
                      key: "interviewees",
                      label: "Entrevistados",
                      render: (value: any[]) => getIntervieweesDisplay(value),
                    },
                    {
                      key: "professionals",
                      label: "Profesionales",
                      render: (value: any[]) => getProfessionalsDisplay(value),
                    },
                    {
                      key: "actions",
                      label: "Acciones",
                      render: (value: any, item: any) => (
                        <div className="flex items-center gap-1">
                          <Link href={`/interviews/information/${item._id}`}>
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                              title="Editar entrevista"
                            >
                              <Pencil2 />
                            </button>
                          </Link>

                          {item.status === "NOT_STARTED" && (
                            <button
                              onClick={() => handleStartInterview(item._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                              title="Iniciar entrevista"
                            >
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              Iniciar
                            </button>
                          )}

                          {item.status === "IN_PROGRESS" && (
                            <button
                              onClick={() => handleCompleteInterview(item._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                              title="Finalizar entrevista"
                            >
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                              Finalizar
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                            title="Eliminar entrevista"
                          >
                            <Trash />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableInterviewsView;
