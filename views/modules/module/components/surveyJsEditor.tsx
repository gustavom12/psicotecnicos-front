// 'use client'
import React, { useEffect, useState } from "react";
// import { registerSurveyTheme } from "survey-creator-core";
// import SurveyTheme from "survey-core/themes";
// import SurveyCreatorTheme from "survey-creator-core/themes";
// import "survey-creator-core/i18n/spanish";
import dynamic from "next/dynamic";



// const SurveyCreatorNoSSR = dynamic(
//   () => import('survey-creator-react').then(m => m.SurveyCreatorComponent),
//   { ssr: false }
// );

// registerSurveyTheme(SurveyTheme);

const FormEditor = () => {
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    // (async () => {
    //   const { SurveyCreator } = await import("survey-creator-react");
    //   const c = new SurveyCreator({
    //     autoSaveEnabled: true,
    //     collapseOnDrag: true,
    //     showThemeTab: true,
    //     showTranslationTab: false,
    //     locale: "es",
    //   });
    //   setCreator(c);
    // })();
  }, []);

  // creator.locale = "es";
  // creator.applyCreatorTheme(SurveyCreatorTheme.DefaultContrast);

  if (!creator) return null;         // espera al cliente
  return (
    <div className="FormEditor">
      {/* <SurveyCreatorNoSSR creator={creator} /> */}
    </div>
  );
};

export default FormEditor;
