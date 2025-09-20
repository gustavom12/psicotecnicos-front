import React from "react";
import IntervieweeHomeView from "@/views/interviewee/home/IntervieweeHome.view";
import IntervieweeAuthGuard from "@/components/IntervieweeAuthGuard";

const IntervieweeHomePage = () => {
  return (
    <IntervieweeAuthGuard>
      <IntervieweeHomeView />
    </IntervieweeAuthGuard>
  );
};

export default IntervieweeHomePage;

