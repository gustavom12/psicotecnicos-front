import React from "react";
import { useParams } from "next/navigation";

import Module from "@/views/modules/module/Module.view";

const ModulePage = () => {
  const { id } = useParams();

  return <Module id={id as string} />;
};

export default ModulePage;
