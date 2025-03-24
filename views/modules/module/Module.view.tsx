// 'use client'

import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { registerSurveyTheme } from "survey-creator-core";
import SurveyTheme from "survey-core/themes";
import SurveyCreatorTheme from "survey-creator-core/themes";
import "survey-creator-core/i18n/spanish";

registerSurveyTheme(SurveyTheme);

const Module = ({ id }: { id?: string } = {}) => {
  console.log({ id });

  const creator = new SurveyCreator({
    autoSaveEnabled: true,
    collapseOnDrag: true,
    showThemeTab: true,
    showTranslationTab: false,
  });

  creator.locale = "es";
  creator.applyCreatorTheme(SurveyCreatorTheme.DefaultContrast);

  return (
    <div className="h-screen">
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
};

export default Module;
