import React from 'react';
import { useRouter } from 'next/router';
import SurveyView from '../SurveyView';

export default function InterviewerSurveyView() {
  const router = useRouter();
  const { surveyId, intervieweeId } = router.query;

  if (!surveyId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Survey ID no proporcionado</p>
      </div>
    );
  }

  return (
    <SurveyView
      surveyId={surveyId as string}
      intervieweeId={intervieweeId as string}
    />
  );
}
