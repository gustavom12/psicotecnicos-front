import React from "react";
import { useRouter } from "next/router";

import Module from "@/views/modules/module/Module.view";

const ModuleCreatePage = () => {
  const router = useRouter();
  const isPreviousForm = router.query.previousForm === "true";

  return <Module id={null} isPreviousForm={isPreviousForm} />;
};

export default ModuleCreatePage;
