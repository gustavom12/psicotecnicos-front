import React from "react";
import { useRouter } from "next/router";
import InformationView from "@/views/interviews/information/index";

const EditInterviewPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <InformationView id={id as string} />;
};

export default EditInterviewPage;
