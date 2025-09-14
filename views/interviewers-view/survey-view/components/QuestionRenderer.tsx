import React from 'react';
import { Input, Textarea, Button, Radio, RadioGroup } from '@heroui/react';
import { Question, FieldType } from '../../../../types/survey.types';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  error
}: QuestionRendererProps) {

  const renderInput = () => {
    switch (question.type) {
      case FieldType.SHORT_TEXT:
        return (
          <Input
            placeholder="Tu respuesta..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full"
          />
        );

      case FieldType.PARAGRAPH:
        return (
          <Textarea
            placeholder="Tu respuesta..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full min-h-[100px]"
            rows={4}
          />
        );

      case FieldType.NUMBER:
        return (
          <Input
            type="number"
            placeholder="Ingresa un número..."
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full"
          />
        );

      case FieldType.OPTIONS:
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={onChange}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full"
          >
            {question.options?.map((option, index) => (
              <Radio key={index} value={option} className="mb-2">
                {option}
              </Radio>
            ))}
          </RadioGroup>
        );

      case FieldType.FILE:
        return (
          <div className="w-full">
            <input
              type="file"
              onChange={(e) => onChange(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case FieldType.SCALE:
        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">1</span>
              <span className="text-sm font-medium">Valor: {value || 5}</span>
              <span className="text-sm text-gray-500">10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={value || 5}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      default:
        return (
          <Input
            placeholder="Tu respuesta..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {question.question}
      </label>
      {renderInput()}
    </div>
  );
}
