import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

export default function InterviewSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardBody className="text-center p-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Entrevista Completada!
          </h1>

          <p className="text-gray-600 mb-6">
            Gracias por completar la entrevista. Tus respuestas han sido enviadas exitosamente.
          </p>

          <div className="space-y-3">
            <Button
              color="primary"
              className="w-full"
              onPress={() => router.push('/')}
            >
              Volver al Inicio
            </Button>

            <Button
              variant="bordered"
              className="w-full"
              onPress={() => router.back()}
            >
              Realizar Otra Entrevista
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
