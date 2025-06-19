import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Tables from "@/common/table";
import React from "react";
import HomeCard from "./homeCard";
// import TableHome from "@/views/Home/tableHome";
import TableInterviews from "@/common/InterviewsTable";
import apiConnection from "@/pages/api/api";
// import { set } from "react-hook-form";

const HomeView = () => {
  const [data, setData] = React.useState([]);
  const [countProfesional, setCountProfesional] = React.useState(0);
  const [countEntrevistados, setCountEntrevistados] = React.useState(0);
  const [countEmpresas, setCountEmpresas] = React.useState(0);
  const [countEvaluaciones, setCountEvaluaciones] = React.useState(0);

  React.useEffect(() => {
    apiConnection.get('/interviews/filtered').then((response) => {
      console.log(data)
      setData(response.data)
    })
  }, [])

  React.useEffect(() => {
    apiConnection
      .get('users/owners/count')
      .then((response) => {
        console.log('Full response:', response); // Debug log completo
        console.log('Response data:', response.data); // Debug log
        console.log('Type of response.data:', typeof response.data); // Verificar tipo

        // Extraer el número correctamente
        let count = 0;

        if (typeof response.data === 'number') {
          // Si la respuesta es directamente un número
          count = response.data;
        } else if (typeof response.data === 'object' && response.data.countProfesional) {
          // Si la respuesta es un objeto con la propiedad countProfesional
          count = response.data.countProfesional;
        }

        console.log('Final count value:', count, 'Type:', typeof count); // Debug log
        setCountProfesional(count);
      })
      .catch((error) => {
        console.error('Error fetching owner countProfesional:', error);
        setCountProfesional(0); // Set default value on error
      });
  }, []);

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
            <HomeCard text={"evaluaciones pendientes"} number={80} />
            <HomeCard number={countProfesional} text={"profesionales"} />
            <HomeCard number={140} text={"entrevistados"} />
            <HomeCard number={15} text={"empresas activas"} />
          </div>
          <p className="font-semibold text-[18px] my-3">
            Próximas entrevistas
          </p>
          <TableInterviews data={data}
            columns={[
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
            ]} />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
