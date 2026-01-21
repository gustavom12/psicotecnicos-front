import React from "react";
import { useRouter } from "next/router";
import ViewInterviewPage from "@/views/interviews/view/index";

const InterviewViewPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <ViewInterviewPage id={id as string} />;
};

export default InterviewViewPage;
