import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import ButtonDelete from "@/common/buttondelete";
import ButtonSubmitPhoto from "@/common/buttonSubmitPhoto";
import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { useAuthContext } from "@/contexts/auth.context";
import { Controller, useForm } from "react-hook-form";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import moment from "moment";

const ProfessionalView = ({ id }: { id?: string }) => {
  const { user, updateUserProfile } = useAuthContext();
  const [editingData, setEditingData] = useState(null);
  const [image, setImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      roles: "professional",
      enabled: true,
    } as any,
  });

  useEffect(() => {
    if (editingData) {
      const values = editingData;
      setProfileImageUrl(values.imageURL || "");
      reset({
        ...values,
        birthDate: moment(values.birthDate).format("YYYY-MM-DD"),
        privateData: {
          ...values.privateData,
          ingressDate: moment(values.privateData.ingressDate).format(
            "YYYY-MM-DD",
          ),
        },
      });
    }
  }, [editingData]);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const { data: values } = await apiConnection.get(`/users/${id}`);
          setEditingData(values);
          console.log("values", values);
        } catch (error) {
          console.error("Error fetching data: ", error);
          Notification("Error al cargar los datos", "error");
        }
      };
      fetchData();
    }
  }, [id]);

  const onSubmit = async (param) => {
    // Incluir la imagen de perfil en los datos
    const dataToSubmit = {
      ...param,
      imageURL: profileImageUrl,
    };
    try {
      // Call API to save data
      if (editingData) {
        await apiConnection.patch(`/users/${editingData._id}`, dataToSubmit);
        
        // Si estamos editando el perfil del usuario logueado, actualizar el contexto
        if (editingData._id === user._id) {
          await updateUserProfile(dataToSubmit);
        }
      } else {
        await apiConnection.post(`/auth/register`, dataToSubmit);
      }
      Notification("Los datos se guardaron correctamente", "success");
    } catch (error) {
      console.error("Error: ", error);
      Notification("Error al guardar los datos", "error");
    }
  };

  return (
    <div className="flex flex-row w-full ">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />
        <div className="flex-col  ">
          <div className="flex flex-row space-x-4 ">
            <button
              onClick={() => {
                window.history.back();
              }}
              className=" rounded-full w-[30px] h-[30px]  border border-color-[#D4D4D8] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-[22px]">
              {editingData?.fullname || "Profesional nuevo"}
            </h1>
          </div>

          <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[240px] mt-8 mb-6 h-[36px] rounded-xl">
            <Button className="rounded-sm bg-white   h-[28px]">
              Información
            </Button>
            <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">
              Entrevistas
            </Button>
          </ButtonGroup>

          <hr />

          <div className="flex flex-row mt-8">
            <div className="w-[100px] h-[100px] border rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">
                  {editingData?.fullname?.[0] || user?.fullname?.[0] || "P"}
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-row space-x-1 ml-4 mt-7">
                <ButtonSubmitPhoto 
                  onImageUploaded={(imageUrl) => {
                    setProfileImageUrl(imageUrl);
                  }}
                  currentImage={profileImageUrl}
                />
                <ButtonDelete 
                  onDelete={() => {
                    setProfileImageUrl('');
                  }}
                  hasImage={!!profileImageUrl}
                />
              </div>
              
              <div className="ml-8 mt-1">
                <p className="text-[#A1A1AA] font-light text-[12px] w-auto">
                  La imagen será visible dentro de la plataforma.
                </p>
              </div>
            </div>
          </div>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 h-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="fullname"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Nombre completo"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="Toyota "
                  {...register("fullname", { required: true })}
                />
              )}
            />

            <Controller
              control={control}
              name="fullname"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="E-mail"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="jose.gonzalez@gmail.com "
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
                />
              )}
            />
            <Controller
              control={control}
              name="fullname"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Teléfono"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="+54 11 8888 5555"
                  {...register("phoneNumber", {
                    required: true,
                    minLength: 9,
                  })}
                />
              )}
            />
            <Controller
              control={control}
              name="nacionality"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nacionalidad"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="Nacionalidad"
                  {...register("nacionality")}
                />
              )}
            />
            <Controller
              control={control}
              name="personalID"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Documento"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="Documento"
                  {...register("personalID")}
                />
              )}
            />
            <Controller
              name="speciality"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Especialidad"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="Especialidad"
                  {...register("speciality")}
                />
              )}
            />
            <Select
              isRequired
              label="Rol"
              labelPlacement="outside"
              className="color-[#F4F4F5] my-6 "
              placeholder="Rol"
              {...register("roles", { required: true })}
            >
              <SelectItem key={"owner"}>Propietario</SelectItem>
              <SelectItem key={"professional"}>Profesional</SelectItem>
            </Select>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Fecha de nacimiento"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="Fecha de nacimiento"
                  type="date"
                  {...register("birthDate")}
                />
              )}
            />
            <Select
              isRequired
              label="Estado"
              labelPlacement="outside"
              className="color-[#F4F4F5] my-6 "
              placeholder="Estado"
              {...register("enabled", { required: true })}
            >
              <SelectItem key={false as any}>Inactivo</SelectItem>
              <SelectItem key={true as any}>Activo</SelectItem>
            </Select>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Ubicación"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="Córdoba, Argentina "
                  {...register("location")}
                />
              )}
            />
            <Controller
              name="favouriteTests"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Tests"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="Tests"
                  {...register("favouriteTests")}
                />
              )}
            />
            <Controller
              name="registrationNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Matrícula"
                  labelPlacement="outside"
                  className="color-[#F4F4F5] my-6 "
                  placeholder="Matrícula"
                  {...register("registrationNumber")}
                />
              )}
            />

            {user?.roles?.includes("owner") && (
              <>
                <Controller
                  name="privateData.ingressDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Fecha de ingreso"
                      labelPlacement="outside"
                      className="color-[#F4F4F5] my-6 "
                      placeholder="23/7/2023 "
                      type="date"
                      {...register("privateData.ingressDate")}
                    />
                  )}
                />

                <Controller
                  name="privateData.notes"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Observaciones"
                      labelPlacement="outside"
                      className="color-[#F4F4F5] my-6 "
                      placeholder="Observaciones"
                      {...register("privateData.notes")}
                    />
                  )}
                />
                <Controller
                  name="privateData.pricing"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Honorarios individual"
                      labelPlacement="outside"
                      className="color-[#F4F4F5] my-6 "
                      placeholder="1000"
                      type="number"
                      {...register("privateData.pricing")}
                    />
                  )}
                />
                <Controller
                  name="privateData.groupPricing"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Honorarios grupal"
                      labelPlacement="outside"
                      className="color-[#F4F4F5] my-6 "
                      placeholder="1000"
                      type="number"
                      {...register("privateData.groupPricing", {
                        valueAsNumber: true,
                      })}
                    />
                  )}
                />
                <Controller
                  name="privateData.assestment"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Assestment"
                      labelPlacement="outside"
                      className="color-[#F4F4F5] my-6 "
                      placeholder="Assestment"
                      {...register("privateData.assestment")}
                    />
                  )}
                />
                <Controller
                  name="privateData.potential"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Potencial"
                      labelPlacement="outside"
                      className="color-[#F4F4F5] my-6 "
                      placeholder="Potential"
                      {...register("privateData.potential")}
                    />
                  )}
                />
              </>
            )}
            <div></div>
            <Button
              type="submit"
              radius="none"
              className="w-6/12 my-10 ml-auto flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md "
            >
              <p className="">Guardar</p>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalView;
