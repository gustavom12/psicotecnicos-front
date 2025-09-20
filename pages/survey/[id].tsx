import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import SurveyView from '../../views/interviewers-view/survey-view/SurveyView';
import IntervieweeAuthGuard from '@/components/IntervieweeAuthGuard';

interface SurveyPageProps {
  surveyId: string;
  intervieweeId?: string;
}

export default function SurveyPage({ surveyId, intervieweeId }: SurveyPageProps) {
  return (
    <IntervieweeAuthGuard>
      <SurveyView
        surveyId={surveyId}
        intervieweeId={intervieweeId}
      />
    </IntervieweeAuthGuard>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, intervieweeId } = context.query;

  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      surveyId: id,
      intervieweeId: intervieweeId || null,
    },
  };
};
