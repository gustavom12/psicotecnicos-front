import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Tables from "@/common/table";
import React, { useState } from "react";
import HomeCard from "./homeCard";
// import TableHome from "@/views/Home/tableHome";
import TableInterviews from "@/common/InterviewsTable";
import apiConnection from "@/pages/api/api";
import { Briefcase, Building2, User, Users } from "lucide-react";
import Pencil2 from "@/public/icons/pencil2";
import { Notification } from "@/common/notification";
import Link from "next/link";
import Trash from "@/public/icons/trashgrey";
// import { set } from "react-hook-form";

const HomeView = () => {
  const [data, setData] = React.useState([]);
  const [countProfesional, setCountProfesional] = React.useState(0);
  const [countEntrevistados, setCountEntrevistados] = React.useState(0);
  const [countEmpresas, setCountEmpresas] = React.useState(0);
  const [countEvaluaciones, setCountEvaluaciones] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [intervieweesMap, setIntervieweesMap] = useState(new Map());
  const [professionalsMap, setProfessionalsMap] = useState(new Map());
  const [filteredData, setFilteredData] = useState([]);



  React.useEffect(() => {
    loadInterviews();
  }, []);

  React.useEffect(() => {
    // Cargar contadores de profesionales
    apiConnection
      .get("users/owners/count")
      .then((response) => {
        console.log("Full response:", response);
        console.log("Response data:", response.data);
        console.log("Type of response.data:", typeof response.data);

        let count = 0;

        if (typeof response.data === "number") {
          count = response.data;
        } else if (
          typeof response.data === "object" &&
          response.data.countProfesional
        ) {
          count = response.data.countProfesional;
        }

        console.log("Final count value:", count, "Type:", typeof count);
        setCountProfesional(count);
      })
      .catch((error) => {
        console.log("Error fetching owner countProfesional:", error);
        setCountProfesional(0);
      });


    // Cargar contadores de entrevistados
    apiConnection
      .get("/interviewees/filtered")
      .then((response) => {
        const data = response.data?.data || response.data || [];
        setCountEntrevistados(Array.isArray(data) ? data.length : 0);
      })
      .catch((error) => {
        console.log("Error fetching interviewees count:", error);
        setCountEntrevistados(0);
      });

    // Cargar contadores de empresas
    apiConnection
      .get("/companies/filtered")
      .then((response) => {
        console.log("Companies response for count:", response.data);
        
        // Manejar diferentes formatos de respuesta
        let data = [];
        if (Array.isArray(response.data?.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        }
        
        const count = data.length;
        console.log("Companies count:", count);
        setCountEmpresas(count);
      })
      .catch((error) => {
        console.log("Error fetching companies count:", error);
        setCountEmpresas(0);
      });

    // Cargar contadores de evaluaciones (surveys)
    apiConnection
      .get("/surveys")
      .then((response) => {
        const data = response.data?.data || response.data || [];
        setCountEvaluaciones(Array.isArray(data) ? data.length : 0);
      })
      .catch((error) => {
        console.log("Error fetching surveys count:", error);
        setCountEvaluaciones(0);
      });
  }, []);
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

  const loadInterviews = async () => {
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
      console.error("Error loading data:", error);
      Notification("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

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
  return (
    <div className="flex flex-row w-full">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />
        <div className=" ">
          <h2 className="font-semibold text-[22px] mt-4 mb-2">Inicio</h2>
          <div className="flex flex-row gap-4">
            <HomeCard
              text="Evaluaciones pendientes"
              number={countEvaluaciones}
              icon={Briefcase}
            />
            <HomeCard text="Profesionales" number={countProfesional} icon={User} />
            <HomeCard text="Entrevistados" number={countEntrevistados} icon={Users} />
            <HomeCard text="Empresas activas" number={countEmpresas} icon={Building2} />
          </div>
          <p className="font-semibold text-[18px] mt-10 my-3">
            Próximas entrevistas
          </p>
          <TableInterviews
            data={data.map((item: any) => ({
              ...item,
              key: item._id,
            }))}
            columns={[
              {
                key: "title",
                label: "Título",
                render: (value: string, item: any) => (
                  <div>
                    <p className="font-semibold text-gray-900">
                      {value || "Sin título"}
                    </p>
                    {item.description && (
                      <p className="text-sm text-gray-500 truncate">
                        {item.description}
                      </p>
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
                render: (value: string) => {
                  const statusConfig = {
                    DRAFT: { label: "Borrador", color: "bg-gray-100 text-gray-700" },
                    NOT_STARTED: { label: "No iniciada", color: "bg-amber-100 text-amber-700" },
                    IN_PROGRESS: { label: "En progreso", color: "bg-blue-100 text-blue-700" },
                    CLOSED: { label: "Finalizada", color: "bg-green-100 text-green-700" },
                  };

                  const config = statusConfig[value] || {
                    label: "Desconocido",
                    color: "bg-gray-100 text-gray-700",
                  };

                  return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  );
                },
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
        </div>
      </div>
    </div>
  );
};

export default HomeView;
