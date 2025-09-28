import React from "react";
import IntervieweeEvaluationsView from "@/views/interviewee/evaluations/IntervieweeEvaluations.view";
import IntervieweeAuthGuard from "@/components/IntervieweeAuthGuard";

const IntervieweeEvaluationsPage = () => {
  return (
    <IntervieweeAuthGuard>
      <IntervieweeEvaluationsView />
    </IntervieweeAuthGuard>
  );
};

export default IntervieweeEvaluationsPage;
