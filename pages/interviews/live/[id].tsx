import { GetServerSideProps } from "next";
import LiveInterviewView from "@/views/interviews/live/LiveInterview.view";

interface LiveInterviewPageProps {
  interviewId: string;
}

export default function LiveInterviewPage({
  interviewId,
}: LiveInterviewPageProps) {
  return <LiveInterviewView interviewId={interviewId} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  if (!id || typeof id !== "string") {
    return { notFound: true };
  }

  return { props: { interviewId: id } };
};
