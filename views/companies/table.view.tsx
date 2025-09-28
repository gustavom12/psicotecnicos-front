import React, { useEffect, useState } from "react";
import Tables from "../../common/table";
import { Button } from "@heroui/button";
import NavbarApp from "@/common/navbar";
import MenuLeft from "@/layouts/menu/MenuLeft";
import Addition from "@/public/icons/addition";
import Link from "next/link";
import apiConnection from "@/pages/api/api";
import Pencil2 from "@/public/icons/pencil2";
import Trash from "@/public/icons/trashgrey";
import { Notification } from "@/common/notification";

const CompaniesTable = () => {
  const [data, setData] = useState([]);
  const [interviewsCount, setInterviewsCount] = useState({});

  const loadData = async () => {
    try {
      // Cargar companies e interviews en paralelo para contar entrevistas
      const [companiesRes, interviewsRes] = await Promise.all([
        apiConnection.get("/companies/filtered"),
        apiConnection.get("/interviews/filtered")
      ]);

      // También probar endpoint sin filtros para comparar
      let companiesAltRes;
      try {
        companiesAltRes = await apiConnection.get("/companies");
        console.log("Companies from /companies endpoint:", companiesAltRes.data);
      } catch (error) {
        console.log("Alternative endpoint /companies failed:", error.message);
      }

      console.log("Companies data:", companiesRes.data);
      
      // Procesar datos de companies
      const companiesData = Array.isArray(companiesRes.data?.data) ? 
        companiesRes.data.data : 
        Array.isArray(companiesRes.data) ? companiesRes.data : [];

      // Debug: Ver estructura de las empresas
      console.log("Companies processed data:", companiesData);
      console.log("Total companies:", companiesData.length);
      
      if (companiesData.length > 0) {
        console.log("First company structure:", companiesData[0]);
        console.log("Available fields in first company:", Object.keys(companiesData[0]));
        
        // Verificar campos específicos en la primera empresa
        const firstCompany = companiesData[0];
        console.log("Company status:", firstCompany.status);
        console.log("Company email:", firstCompany.email);
        console.log("Company location:", firstCompany.location);
        
        // Verificar TODOS los campos de TODAS las empresas para encontrar patrones
        console.log("=== ANALYZING ALL COMPANIES ===");
        companiesData.forEach((company, index) => {
          console.log(`Company ${index + 1} (${company.name || 'No name'}):`);
          console.log("  All fields:", Object.keys(company));
          
          // Buscar campos relacionados con status/email
          Object.entries(company).forEach(([key, value]) => {
            if (key.toLowerCase().includes('status') || 
                key.toLowerCase().includes('state') || 
                key.toLowerCase().includes('email') || 
                key.toLowerCase().includes('mail') ||
                key.toLowerCase().includes('active')) {
              console.log(`    ${key}: ${value}`);
            }
          });
        });
        
        // Verificar si alguna empresa tiene status o email
        const companiesWithStatus = companiesData.filter(c => c.status);
        const companiesWithEmail = companiesData.filter(c => c.email);
        console.log(`Companies with status: ${companiesWithStatus.length}/${companiesData.length}`);
        console.log(`Companies with email: ${companiesWithEmail.length}/${companiesData.length}`);
      }

      // Contar entrevistas por company
      const interviewsData = Array.isArray(interviewsRes.data) ? interviewsRes.data : [];
      const interviewsCountMap = {};
      
      console.log("Processing interviews for companies:", interviewsData.length);
      
      interviewsData.forEach(interview => {
        // Buscar por diferentes campos posibles
        let companyId = null;
        
        if (interview.companyId) {
          companyId = interview.companyId;
        } else if (interview.company && interview.company._id) {
          companyId = interview.company._id;
        } else if (interview.company && typeof interview.company === 'string') {
          companyId = interview.company;
        }
        
        if (companyId) {
          interviewsCountMap[companyId] = (interviewsCountMap[companyId] || 0) + 1;
          console.log(`Interview ${interview._id} assigned to company ${companyId}`);
        }
      });
      
      console.log("Interviews count map:", interviewsCountMap);

      setInterviewsCount(interviewsCountMap);
      setData([...companiesData.map((e, i) => ({ ...e, key: e._id || i }))]);
    } catch (error) {
      console.error("Error loading companies:", error);
      Notification("Error al cargar empresas", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta empresa?")) {
      return;
    }
    try {
      await apiConnection.delete(`/companies/${id}`);
      Notification("Empresa eliminada exitosamente", "success");
      loadData(); // Recargar la lista
    } catch (error: any) {
      console.error("Error deleting company:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.errorMessage || 
                          "Error al eliminar la empresa";
      Notification(errorMessage, "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <div className="flex flex-row w-full">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />

        <div className=" flex justify-around">
          <div className="flex-col w-[1190px]  ">
            <div className=" flex justify-between ">
              <h1 className="font-inter font-semibold text-[22px]">Empresas</h1>
              {/* <button className="bg-[#635BFF1A] text-[#635BFF] font-light py-2 px-4 rounded cursor-pointer">  New Companie</button> */}
              <Link href="/companies/create">
                <Button
                  radius="none"
                  className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md "
                >
                  <Addition fill={"#635BFF"} />
                  <p className="">Nueva empresa</p>
                </Button>
              </Link>
            </div>

            <div className="mt-8">
              
              <Tables
                data={data}
                 columns={[
                   {
                     key: "name",
                     label: "Nombre",
                     render: (value, item) => (
                       <div>
                         <div className="font-semibold text-gray-900">
                           {item.name || "Sin nombre"}
                         </div>
                         {item.description && (
                           <div className="text-sm text-gray-500 truncate">
                             {item.description}
                           </div>
                         )}
                       </div>
                     ),
                   },
                   {
                     key: "status",
                     label: "Estado",
                     render: (value, item) => (
                       <div>
                         {item.status ? (
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             item.status === 'ACTIVE' || item.status === 'active' 
                               ? 'bg-green-100 text-green-800' 
                               : item.status === 'INACTIVE' || item.status === 'inactive'
                               ? 'bg-red-100 text-red-800'
                               : 'bg-gray-100 text-gray-800'
                           }`}>
                             {item.status === 'ACTIVE' || item.status === 'active' ? '✅ Activa' :
                              item.status === 'INACTIVE' || item.status === 'inactive' ? '❌ Inactiva' :
                              item.status}
                           </span>
                         ) : (
                           <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                             ✅ Activa
                           </span>
                         )}
                       </div>
                     ),
                   },
                   {
                     key: "location",
                     label: "Ubicación",
                     render: (value, item) => (
                       <div className="text-sm">
                         {item.location ? (
                           <div className="font-medium text-gray-900">
                             📍 {item.location}
                           </div>
                         ) : (
                           <span className="text-gray-400 italic">Sin ubicación</span>
                         )}
                       </div>
                     ),
                   },
                   {
                     key: "email",
                     label: "Email",
                     render: (value, item) => (
                       <div className="text-sm">
                         {item.email ? (
                           <div className="font-medium text-gray-900">
                             {item.email}
                           </div>
                         ) : (
                           <span className="text-gray-400 italic">Sin email</span>
                         )}
                       </div>
                     ),
                   },
                   
               
                   {
                     key: "actions",
                     label: "Acciones",
                     render: (key, item) => (
                       <div className="flex gap-2">
                         <Link href={`/companies/${item._id}`}>
                           <button className="text-blue-500 hover:text-blue-700">
                             <Pencil2 />
                           </button>
                         </Link>
                         <button 
                           className="text-red-500 hover:text-red-700"
                           onClick={() => handleDelete(item._id)}
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
      </div>
    </div>
  );
};

export default CompaniesTable;
