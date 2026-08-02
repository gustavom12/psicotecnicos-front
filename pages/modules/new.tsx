import React from "react";
import { useRouter } from "next/router";

import Module from "@/views/modules/module/Module.view";

const ModuleCreatePage = () => {
  const router = useRouter();

  // La página no tiene getServerSideProps, así que Next la optimiza de forma
  // estática y `router.query` llega vacío en el primer render (recarga o
  // acceso directo a la URL). Si el editor monta con eso, se queda con
  // isPreviousForm=false y el formulario se guarda como módulo de entrevista.
  if (!router.isReady) return null;

  const isPreviousForm = router.query.previousForm === "true";

  return <Module id={null} isPreviousForm={isPreviousForm} />;
};

export default ModuleCreatePage;
