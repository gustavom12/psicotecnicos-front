import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Tables from "@/common/table";
import Addition from "@/public/icons/addition";
import { Button, Chip } from "@heroui/react";
import React, { useState, useEffect } from "react";
import apiConnection from "@/pages/api/api";
import Link from "next/link";
import { Notification } from "@/common/notification";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  department?: string;
  location?: string;
}

interface Interviewee {
  _id: string;
  personalInfo: PersonalInfo;
  email: string;
  companyId: string;
  companyName?: string;
  teamId: string;
  status: string;
  state: string;
  totalInterviews: number;
  completedInterviews: number;
  invitationInfo?: {
    sentAt?: Date;
    expiresAt?: Date;
    acceptedAt?: Date;
    remindersSent: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Company {
  _id: string;
  name: string;
}


const InterviewTableView = () => {
  const [data, setData] = useState<Interviewee[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<any>({});


  const statusLabels = {
    'PENDING': { label: 'Pendiente', color: 'default' as const },
    'INVITED': { label: 'Invitado', color: 'primary' as const },
    'IN_PROGRESS': { label: 'En Progreso', color: 'warning' as const },
    'COMPLETED': { label: 'Completado', color: 'success' as const },
    'CANCELLED': { label: 'Cancelado', color: 'danger' as const },
    'EXPIRED': { label: 'Expirado', color: 'danger' as const },
  };

  const stateLabels = {
    'ACTIVE': { label: 'Activo', color: 'success' as const },
    'INACTIVE': { label: 'Inactivo', color: 'default' as const },
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [intervieweesRes, statisticsRes] = await Promise.all([
        apiConnection.get('/interviewees/filtered'),
        apiConnection.get('/interviewees/statistics').catch(() => ({ data: {} }))
      ]);

      const interviewees = intervieweesRes.data.data || intervieweesRes.data;
      setData(interviewees);
      setStatistics(statisticsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      Notification('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };



  const handleResendCredentials = async (intervieweeId: string) => {
    try {
      setLoading(true);
      const response = await apiConnection.post(`/interviewees/${intervieweeId}/resend-credentials`);

      // Show success notification with email info
      const email = response.data?.email || '';
      const message = response.data?.message || 'Credenciales reenviadas exitosamente';

      Notification(
        email
          ? `${message}. Email enviado a: ${email}`
          : `${message}. Email enviado exitosamente`,
        'success'
      );

      loadData(); // Recargar datos para actualizar el estado
    } catch (error: any) {
      console.error('Error resending credentials:', error);
      Notification(error?.response?.data?.message || 'Error al reenviar credenciales', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (intervieweeId: string) => {
    try {
      setLoading(true);
      await apiConnection.post(`/interviewees/${intervieweeId}/send-reminder`);
      Notification('Recordatorio enviado exitosamente', 'success');
      loadData();
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      Notification(error?.response?.data?.message || 'Error al enviar recordatorio', 'error');
    } finally {
      setLoading(false);
    }
  };



  // Transformar datos para la tabla
  const tableData = data.map(item => ({
    id: item._id,
    name: `${item.personalInfo.firstName} ${item.personalInfo.lastName}`,
    email: item.email,
    company: item.companyName || 'N/A',
    interviews: `${item.completedInterviews}/${item.totalInterviews}`,
    status: (
      <Chip
        color={statusLabels[item.status as keyof typeof statusLabels]?.color || 'default'}
        size="sm"
        variant="flat"
      >
        {statusLabels[item.status as keyof typeof statusLabels]?.label || item.status}
      </Chip>
    ),
    state: (
      <Chip
        color={stateLabels[item.state as keyof typeof stateLabels]?.color || 'default'}
        size="sm"
        variant="flat"
      >
        {stateLabels[item.state as keyof typeof stateLabels]?.label || item.state}
      </Chip>
    ),
    actions: (
      <div className="flex gap-2">
        <Link href={`/interviewed/edit?id=${item._id}`}>
          <Button size="sm" variant="light" color="primary">
            Editar
          </Button>
        </Link>
        {(item.status === 'PENDING' || item.status === 'INVITED') && (
          <Button
            size="sm"
            variant="light"
            color="secondary"
            onClick={() => handleResendCredentials(item._id)}
          >
            Reenviar credenciales
          </Button>
        )}
        {item.status === 'INVITED' && (
          <Button
            size="sm"
            variant="light"
            color="warning"
            onClick={() => handleSendReminder(item._id)}
          >
            Recordar
          </Button>
        )}
      </div>
    ),
  }));

  return (
    <div className="flex flex-row w-full">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />

        <div className="flex justify-around">
          <div className="flex-col w-[1190px]">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-inter font-semibold text-[22px]">Entrevistados</h1>
                {statistics.total ? (
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {statistics.total} | Activos: {statistics.byStatus?.pending + statistics.byStatus?.invited + statistics.byStatus?.inProgress || 0}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-row space-x-4">
                <Link href="/interviewed/edit">
                  <Button radius="none" className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md">
                    <Addition fill={'#635BFF'} />
                    <p>Nuevo Entrevistado</p>
                  </Button>
                </Link>
              </div>
            </div>


            {/* Tabla */}
            <div className="mt-8">
              <Tables
                data={tableData}
                loading={loading}
                columns={[
                  {
                    key: "name",
                    label: "Nombre",
                  },
                  {
                    key: "email",
                    label: "E-mail",
                  },
                  {
                    key: "company",
                    label: "Empresa",
                  },
                  {
                    key: "interviews",
                    label: "Entrevistas",
                  },
                  {
                    key: "status",
                    label: "Estado",
                  },
                  {
                    key: "state",
                    label: "Activo",
                  },
                  {
                    key: "actions",
                    label: "Acciones",
                    render: (value: any, item: any) => value,
                  },
                ]}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InterviewTableView;
