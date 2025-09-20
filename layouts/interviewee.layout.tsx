import React from "react";
import Head from "next/head";
import { siteConfig } from "@/config/site";

interface IntervieweeLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const IntervieweeLayout: React.FC<IntervieweeLayoutProps> = ({
  children,
  title = "Mis Entrevistas",
  description = "Portal de entrevistas para candidatos"
}) => {
  const pageTitle = `${title} | ${siteConfig.name}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  );
};

export default IntervieweeLayout;

