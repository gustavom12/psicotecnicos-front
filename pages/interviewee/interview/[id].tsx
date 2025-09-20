import React from "react";
import { useRouter } from "next/router";
import IntervieweeInterviewDetail from "@/views/interviewee/interview-detail/InterviewDetail.view";
import IntervieweeAuthGuard from "@/components/IntervieweeAuthGuard";

const IntervieweeInterviewDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <IntervieweeAuthGuard>
      <IntervieweeInterviewDetail interviewId={id as string} />
    </IntervieweeAuthGuard>
  );
};

export default IntervieweeInterviewDetailPage;
