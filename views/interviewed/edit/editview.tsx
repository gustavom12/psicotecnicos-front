import ButtonDelete from '@/common/buttondelete';
import ButtonSubmitPhoto from '@/common/buttonSubmitPhoto';
import MenuLeft from '@/layouts/menu/MenuLeft';
import NavbarApp from '@/common/navbar';
import ArrowLeft from '@/public/icons/arrowleft';
import { Button, ButtonGroup, Select, SelectItem, Textarea } from '@heroui/react';
import { Form, Input } from '@heroui/react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiConnection from '@/pages/api/api';
import { Notification } from '@/common/notification';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  department?: string;
  location?: string;
}

interface IntervieweeData {
  personalInfo: PersonalInfo;
  email: string;
  companyId: string;
  companyName?: string;
  teamId: string;
  status?: string;
  state?: string;
  profileImage?: string;
  notes?: string;
  assignedTo?: string;
  registrationDate?: string;
}

interface Company {
  _id: string;
  name: string;
}

interface Professional {
  _id: string;
  fullname: string;
  email: string;
  speciality?: string;
}


const DetailInterviewed = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState<'info' | 'interviews'>('info');
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [formData, setFormData] = useState<IntervieweeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      position: '',
      department: '',
      location: '',
    },
    email: '',
    companyId: '',
    companyName: '',
    teamId: '',
    status: 'PENDING',
    state: 'ACTIVE',
    profileImage: '',
    notes: '',
    assignedTo: '',
    registrationDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadInitialData();
    if (isEditing) {
      loadIntervieweeData();
    }
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [companiesRes, professionalsRes] = await Promise.all([
        apiConnection.get('/companies/filtered'),
        apiConnection.get('/users/table')
      ]);

      setCompanies(companiesRes.data.data || companiesRes.data);
      console.log("professionalsRes.data", professionalsRes.data);
      console.log("professionalsRes.data structure:", professionalsRes.data?.map(p => ({
        id: p._id,
        name: p.fullname,
        speciality: p.speciality
      })));

      setProfessionals(professionalsRes.data || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Notification('Error al cargar datos iniciales', 'error');
    }
  };

  const loadIntervieweeData = async () => {
    try {
      setLoading(true);
      const response = await apiConnection.get(`/interviewees/${id}`);
      const data = response.data;

      setFormData({
        personalInfo: data.personalInfo || {
          firstName: '',
          lastName: '',
          phone: '',
          position: '',
          department: '',
          location: '',
        },
        email: data.email || '',
        companyId: data.companyId || '',
        companyName: data.companyName || '',
        teamId: data.teamId || '',
        status: data.status || 'PENDING',
        state: data.state || 'ACTIVE',
        profileImage: data.profileImage || '',
        notes: data.notes || '',
        assignedTo: data.assignedTo || '',
        registrationDate: data.registrationDate ? new Date(data.registrationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error loading interviewee data:', error);
      Notification('Error al cargar datos del entrevistado', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`handleInputChange: ${field} = ${value}`);
    if (field.startsWith('personalInfo.')) {
      const personalField = field.replace('personalInfo.', '');
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [personalField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.personalInfo.firstName || !formData.personalInfo.lastName || !formData.email) {
      Notification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (!formData.assignedTo) {
      Notification('Por favor selecciona un profesional asignado', 'error');
      return;
    }

    try {
      setLoading(true);

      console.log('Submitting interviewee data:', formData);

      if (isEditing) {
        await apiConnection.patch(`/interviewees/${id}`, formData);
        Notification('Entrevistado actualizado exitosamente', 'success');
      } else {
        const response = await apiConnection.post('/interviewees', formData);

        // Show success notification with email info
        const message = response.data?.message || 'Entrevistado creado exitosamente';
        const email = formData.email;

        Notification(
          `${message}${email ? ` (${email})` : ''}`,
          'success'
        );

        router.push('/interviewed/table');
      }
    } catch (error: any) {
      console.error('Error saving interviewee:', error);
      Notification(error?.response?.data?.message || 'Error al guardar entrevistado', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const statusOptions = [
    { key: 'PENDING', label: 'Pendiente' },
    { key: 'INVITED', label: 'Invitado' },
    { key: 'IN_PROGRESS', label: 'En Progreso' },
    { key: 'COMPLETED', label: 'Completado' },
    { key: 'CANCELLED', label: 'Cancelado' },
    { key: 'EXPIRED', label: 'Expirado' },
  ];

  const stateOptions = [
    { key: 'ACTIVE', label: 'Activo' },
    { key: 'INACTIVE', label: 'Inactivo' },
  ];

  if (loading && isEditing) {
    return (
      <div className="flex flex-row w-full">
        <div><MenuLeft /></div>
        <div className="w-full ml-10 mr-10">
          <NavbarApp />
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />
        <div className="flex-col">
          <div className="flex flex-row space-x-4">
            <button
              onClick={handleGoBack}
              className="rounded-full w-[30px] h-[30px] border border-[#D4D4D8] flex items-center justify-center cursor-pointer hover:bg-gray-50"
            >
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-[22px]">
              {isEditing
                ? `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}` || 'Editar Entrevistado'
                : 'Nuevo Entrevistado'
              }
            </h1>
          </div>
{/*
          <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[240px] mt-8 mb-6 h-[36px] rounded-xl">
            <Button
              className={`rounded-sm h-[28px] ${activeTab === 'info' ? 'bg-white' : 'bg-[#F4F4F5] text-[#71717A]'}`}
              onClick={() => setActiveTab('info')}
            >
              Información
            </Button>
            <Button
              className={`rounded-sm h-[28px] ${activeTab === 'interviews' ? 'bg-white' : 'bg-[#F4F4F5] text-[#71717A]'}`}
              onClick={() => setActiveTab('interviews')}
              disabled={!isEditing}
            >
              Entrevistas
            </Button>
          </ButtonGroup> */}

          <hr />

          {activeTab === 'info' && (
            <div className="mt-8">
              {/* Profile Image Section */}
              <div className="flex flex-row mt-8">
                <div className="w-[100px] h-[100px] border rounded-full bg-gray-100 flex items-center justify-center">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">
                      {formData.personalInfo.firstName?.[0] || ''}
                      {formData.personalInfo.lastName?.[0] || ''}
                      {!formData.personalInfo.firstName && !formData.personalInfo.lastName && '👤'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex flex-row space-x-1 ml-4 mt-7">
                    <ButtonSubmitPhoto 
                      onImageUploaded={(imageUrl) => {
                        console.log('Image uploaded for interviewee:', imageUrl);
                        setFormData(prev => ({ ...prev, profileImage: imageUrl }));
                      }}
                      currentImage={formData.profileImage}
                    />
                    <ButtonDelete 
                      onDelete={() => {
                        setFormData(prev => ({ ...prev, profileImage: '' }));
                      }}
                      hasImage={!!formData.profileImage}
                    />
                  </div>
                  <div className="ml-8 mt-1">
                    <p className="text-[#A1A1AA] font-light text-[12px] w-auto">
                      La imagen será visible dentro de la plataforma.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <Form onSubmit={handleSubmit} className="flex flex-col mt-8 space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    isRequired
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Ingresa el nombre"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => handleInputChange('personalInfo.firstName', e.target.value)}
                    className="w-full"
                  />
                  <Input
                    isRequired
                    label="Apellido"
                    labelPlacement="outside"
                    placeholder="Ingresa el apellido"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => handleInputChange('personalInfo.lastName', e.target.value)}
                    className="w-full"
                  />
                </div>

                <Input
                  isRequired
                  type="email"
                  label="E-mail"
                  labelPlacement="outside"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Teléfono"
                    labelPlacement="outside"
                    placeholder="+54 11 1234 5678"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                    className="w-full"
                  />
                  <Input
                    label="Posición"
                    labelPlacement="outside"
                    placeholder="Cargo o posición"
                    value={formData.personalInfo.position}
                    onChange={(e) => handleInputChange('personalInfo.position', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Departamento"
                    labelPlacement="outside"
                    placeholder="Departamento"
                    value={formData.personalInfo.department}
                    onChange={(e) => handleInputChange('personalInfo.department', e.target.value)}
                    className="w-full"
                  />
                  <Input
                    label="Ubicación"
                    labelPlacement="outside"
                    placeholder="Ciudad, País"
                    value={formData.personalInfo.location}
                    onChange={(e) => handleInputChange('personalInfo.location', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Empresa (opcional)"
                    labelPlacement="outside"
                    placeholder="Selecciona una empresa"
                    selectedKeys={formData.companyId ? new Set([formData.companyId]) : new Set()}
                    onSelectionChange={(keys) => {
                      const keysArray = Array.from(keys);
                      const selectedKey = keysArray.length > 0 ? keysArray[0] as string : '';
                      const selectedCompany = companies.find(c => c._id === selectedKey);
                      handleInputChange('companyId', selectedKey);
                      handleInputChange('companyName', selectedCompany?.name || '');
                    }}
                    className="w-full"
                  >
                    {companies.map((company) => (
                      <SelectItem key={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <div className="group flex flex-col data-[hidden=true]:hidden w-full">
                    <div className="flex flex-col">
                      <label className="block text-foreground-600 font-medium text-small pb-1.5 will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none">
                        Profesional Asignado <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.assignedTo}
                          onChange={(e) => {
                            console.log('Native select changed:', e.target.value);
                            handleInputChange('assignedTo', e.target.value);
                          }}
                          className="w-full min-h-unit-10 px-3 py-2 rounded-medium border-2 border-default-200 bg-default-50 text-small text-foreground placeholder:text-foreground-500 focus:border-focus focus:bg-default-100 focus:outline-none hover:border-default-300 transition-colors motion-reduce:transition-none appearance-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                          }}
                        >
                          <option value="" disabled className="text-foreground-500">
                            Selecciona un profesional
                          </option>
                          {professionals.map((professional) => (
                            <option key={professional._id} value={professional._id} className="text-foreground">
                              {professional.fullname} {professional.speciality ? `(${professional.speciality})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Estado"
                      labelPlacement="outside"
                      placeholder="Selecciona un estado"
                      selectedKeys={formData.status ? new Set([formData.status]) : new Set()}
                      onSelectionChange={(keys) => {
                        const keysArray = Array.from(keys);
                        const selectedKey = keysArray.length > 0 ? keysArray[0] as string : '';
                        handleInputChange('status', selectedKey);
                      }}
                      className="w-full"
                    >
                      {statusOptions.map((option) => (
                        <SelectItem key={option.key}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Estado Activo"
                      labelPlacement="outside"
                      placeholder="Selecciona estado activo"
                      selectedKeys={formData.state ? new Set([formData.state]) : new Set()}
                      onSelectionChange={(keys) => {
                        const keysArray = Array.from(keys);
                        const selectedKey = keysArray.length > 0 ? keysArray[0] as string : '';
                        handleInputChange('state', selectedKey);
                      }}
                      className="w-full"
                    >
                      {stateOptions.map((option) => (
                        <SelectItem key={option.key}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  <Input
                    type="date"
                    label="Fecha de registro"
                    labelPlacement="outside"
                    value={formData.registrationDate}
                    onChange={(e) => handleInputChange('registrationDate', e.target.value)}
                    className="w-full"
                  />
                </div>

                <Textarea
                  label="Observaciones"
                  labelPlacement="outside"
                  placeholder="Notas adicionales sobre el entrevistado"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full"
                  minRows={3}
                />

                <div className="flex gap-4 pt-6 pb-10">
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={loading}
                    className="bg-[#635BFF] text-white"
                  >
                    {isEditing ? 'Actualizar' : 'Crear'} Entrevistado
                  </Button>
                  <Button
                    type="button"
                    variant="bordered"
                    onClick={handleGoBack}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            </div>
          )}

          {activeTab === 'interviews' && isEditing && (
            <div className="mt-8">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Entrevistas</h3>
                <p className="text-gray-500">
                  Aquí se mostrarán las entrevistas asociadas a este entrevistado.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Funcionalidad en desarrollo...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailInterviewed;
