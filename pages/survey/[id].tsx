import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import SurveyView from '../../views/interviewers-view/survey-view/SurveyView';
import IntervieweeAuthGuard from '@/components/IntervieweeAuthGuard';
import { useIntervieweeAuthContext } from '@/contexts/interviewee-auth.context';
import apiConnection from '@/pages/api/api';

interface SurveyPageProps {
  surveyId: string;
  intervieweeId?: string;
  token?: string;
}

export default function SurveyPage({ surveyId, intervieweeId, token }: SurveyPageProps) {
  const router = useRouter();
  const { authenticated, login } = useIntervieweeAuthContext();
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);

  useEffect(() => {
    const attemptAutoLogin = async () => {
      // Only attempt auto-login if there's a token, user is not authenticated, and we haven't tried yet
      if (token && !authenticated && !autoLoginAttempted) {
        setAutoLoginAttempted(true);
        setAutoLoginLoading(true);

        try {
          console.log('Attempting auto-login with token...');

          // Call the auto-login endpoint
          const response = await apiConnection.post('/interviewee-auth/auto-login', {
            token: token
          });

          if (response.data.success) {
            // Store the session token
            if (typeof window !== 'undefined') {
              localStorage.setItem('intervieweeAccessToken', response.data.token);
            }

            // Update API connection headers
            apiConnection.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            console.log('Auto-login successful');

            // Update auth context
            // The IntervieweeAuthGuard will handle the authentication check
          } else {
            console.error('Auto-login failed:', response.data);
          }
        } catch (error) {
          console.error('Auto-login error:', error);
          // If auto-login fails, user will be redirected to login by IntervieweeAuthGuard
        } finally {
          setAutoLoginLoading(false);
        }
      }
    };

    attemptAutoLogin();
  }, [token, authenticated, autoLoginAttempted]);

  // Show loading while attempting auto-login
  if (token && !authenticated && autoLoginLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Iniciando sesión automáticamente...</p>
        </div>
      </div>
    );
  }

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
  const { id, intervieweeId, token } = context.query;

  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      surveyId: id,
      intervieweeId: intervieweeId || null,
      token: token || null,
    },
  };
};
