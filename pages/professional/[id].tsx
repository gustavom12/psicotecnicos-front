import ProfessionalView from "@/views/professionals/edit/professional.view";
import { useParams } from "next/navigation";
import React from "react";

const EditProfessional = () => {
  const params = useParams();

  return <ProfessionalView id={params?.id as string} />;
};

export default EditProfessional;
