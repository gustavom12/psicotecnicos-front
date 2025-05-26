"use client";

import { Button } from "@heroui/react";
import dynamic from "next/dynamic";
import React from "react";

const ClientSideCustomEditor = dynamic(() => import("./htmlEditor"), {
  ssr: false,
});

export const defaultSlide = {
  selected: true,
  html: "",
  professional: [],
  interviewer: [],
  index: 0,
  title: "",
  comments: "",
};

const EditorWrapper = ({ state, setState }) => {
  return (
    <div className="col-span-12 lg:col-span-7 space-y-4">
      {state.slides.map((slide, idx) => (
        <div
          key={idx}
          className={`col-span-12 rounded-large lg:col-span-7 space-y-4 transition
      ${
        slide.selected
          ? "ring-1 ring-indigo-300 bg-indigo-50/40"
          : "ring-0 bg-white hover:ring-1 hover:ring-gray-200"
      }`}
          onClick={() => {
            setState({
              ...state,
              slides: state.slides.map((e, i) =>
                i === idx
                  ? { ...e, selected: true }
                  : { ...e, selected: false },
              ),
            });
          }}
        >
          <ClientSideCustomEditor
            value={slide.html}
            setValue={(value) => {
              setState((prev) => {
                const newSlides = [...prev.slides];
                newSlides[idx].html = value;
                return { ...prev, slides: newSlides };
              });
            }}
          />
        </div>
      ))}
      <Button
        variant="bordered"
        size="sm"
        className="w-full inline-flex items-center gap-1 col-span-12 lg:col-span-5"
        type="button"
        onClick={() => {
          setState({
            ...state,
            slides: [
              ...state.slides.map((e) => ({ ...e, selected: false })),
              {
                ...defaultSlide,
                index: state.slides.length,
                professional: [],
                interviewer: [],
              },
            ],
          });
        }}
      >
        Agregar slide
      </Button>
    </div>
  );
};

export default EditorWrapper;
