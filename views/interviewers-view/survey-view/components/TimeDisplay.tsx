import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface TimeDisplayProps {
  currentSlideTime: string;
  totalSlideTime: string;
  totalInterviewTime: string;
  visitCount: number;
  slideNumber: number;
  totalSlides: number;
}

export default function TimeDisplay({
  currentSlideTime,
  totalSlideTime,
  totalInterviewTime,
  visitCount,
  slideNumber,
  totalSlides
}: TimeDisplayProps) {
  return (
    <div className="fixed top-4 right-4 z-10 group">
      {/* Indicador muy discreto - solo un pequeño punto con tiempo */}
      <div className="bg-white/60 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/30 px-2 py-1
                      hover:bg-white/90 hover:px-3 hover:py-2 transition-all duration-300 cursor-default">

        {/* Vista mínima - solo tiempo actual */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:hidden">
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
          <span className="font-mono text-[10px]">{currentSlideTime}</span>
        </div>

        {/* Vista expandida al hover */}
        <div className="hidden group-hover:flex items-center gap-2 text-xs text-gray-500">
          <ClockIcon className="w-3 h-3" />
          <span className="font-mono">{currentSlideTime}</span>

          {/* Solo mostrar tiempo total si hay múltiples visitas */}
          {visitCount > 1 && (
            <>
              <span className="text-gray-300">|</span>
              <span className="font-mono text-orange-500">{totalSlideTime}</span>
            </>
          )}

          {/* Progreso muy discreto */}
          <span className="text-gray-300 ml-1">
            {slideNumber}/{totalSlides}
          </span>
        </div>

        {/* Barra de progreso muy sutil - solo visible en hover */}
        <div className="mt-1 w-full bg-gray-100 rounded-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="bg-gray-400 h-0.5 rounded-full transition-all duration-500"
            style={{ width: `${(slideNumber / totalSlides) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
