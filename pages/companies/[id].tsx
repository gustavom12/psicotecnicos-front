import React from "react";
import CompaniesTable from "@/views/companies/table.view";
import { useParams } from "next/navigation";
import EditCompany from "@/views/companies/edit.view";

const EditCompanyPage = () => {
  const params = useParams();
  const id = params?.id;
  return <EditCompany id={id as string} />;
};

export default EditCompanyPage;
