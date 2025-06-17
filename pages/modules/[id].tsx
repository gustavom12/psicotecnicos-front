import React from "react";
import { useParams } from "next/navigation";

import Module from "@/views/modules/module/Module.view";

const ModulePage = () => {
  const params = useParams();
  const id = params?.id;

  return <Module id={id as string} />;
};

export default ModulePage;
