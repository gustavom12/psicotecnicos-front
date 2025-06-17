import InformationView from "@/views/interviews/information";
import { useParams } from "next/navigation";
import React from "react";

const EditSurveyPage = () => {
  const params = useParams();
  const id = params?.id;
  return <InformationView id={id as string} />;
};

export default EditSurveyPage;
