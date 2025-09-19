// edit-company.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import router, { useRouter } from "next/router";
import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { Form } from "@heroui/react";
import InputForms from "@/common/inputForms";
import ButtonSubmitPhoto from "@/common/buttonSubmitPhoto";
import ButtonDelete from "@/common/buttondelete";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import AuthLayout from "@/layouts/auth.layout";
import { useAuthContext } from "@/contexts/auth.context";

/* ---- tipos ---- */
interface CompanyDTO {
  name: string;
  status: string;
  industry: string;
  location: string;
  registeredAt: string;
  manager: string;
  email: string;
  phone: string;
  notes: string;
}

/* ---- estado vacío ---- */
const EMPTY: CompanyDTO = {
  name: "",
  status: "",
  industry: "",
  location: "",
  registeredAt: "",
  manager: null,
  email: "",
  phone: "",
  notes: "",
};

const EditCompany = ({ id }: { id?: string }) => {
  const [data, setData] = useState<CompanyDTO>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [editingData, setEditingData] = useState(null);
  const { user, updateUserProfile } = useAuthContext();


  /* -------- carga inicial -------- */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await apiConnection.get(`/companies/${id}`);
        setData({
          name: data.name,
          status: data.status,
          industry: data.industry,
          location: data.location,
          registeredAt: data.registeredAt,
          manager: data.manager,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
        });
      } catch (err) {
        console.error("Error loading company", err);
      }
    })();
  }, [id]);

  /* -------- handlers -------- */
  const handle =
    (field: keyof CompanyDTO) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setData({ ...data, [field]: e.target.value });

  const save = async () => {
    const required = ["name", "status", "industry", "location"] as const;
    if (required.some((f) => !data[f])) {
      Notification("Debe completar los campos obligatorios", "error");
      return;
    }
    try {
      setSaving(true);
      console.log({ data });

      id
        ? await apiConnection.patch(`/companies/${id}`, data)
        : await apiConnection.post("/companies", data);
      router.push("/companies");
    } catch (err) {
      console.error("Error saving company", err);
    } finally {
      setSaving(false);
    }
  };

  /* -------- UI -------- */
  return (
    // layout contenedor
    <AuthLayout
      links={[
        { label: "Empresas", href: "/companies" },
        {
          label: id ? data.name : "Nueva empresa",
          href: id ? `/companies/${id}` : "/companies/create",
        },
      ]}
    >
      {/* header */}
      <div className="mt-6 mb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">
          {id ? data.name || "Empresa" : "Nueva empresa"}
        </h1>
      </div>

      {/* tabs */}
      <ButtonGroup className="mb-6 mt-4 w-fit rounded-lg bg-gray-100 p-1 text-sm font-medium text-gray-600">
        <Button className="bg-white text-[#635BFF] shadow-sm">
          Información
        </Button>
        <Button className="bg-gray-100">Entrevistados</Button>
        <Button className="bg-gray-100">Entrevistas</Button>
      </ButtonGroup>

      <hr className="mb-8" />

      {/* logo */}
      <div className="flex flex-row mt-8 mb-8">
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
      </div>

        {/* formulario */}
        <Form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <InputForms
            label="Nombre"
            required
            placeholder="Toyota"
            value={data.name}
            onChange={handle("name")}
          />
          <InputForms
            label="Estado"
            required
            placeholder="Activo"
            value={data.status}
            onChange={handle("status")}
          />
          <InputForms
            label="Sector"
            required
            placeholder="Automovilístico"
            value={data.industry}
            onChange={handle("industry")}
          />
          <InputForms
            label="Ubicación"
            required
            placeholder="Córdoba, Argentina"
            value={data.location}
            onChange={handle("location")}
          />
          <InputForms
            label="Fecha de registro"
            placeholder="23/07/2023"
            value={data.registeredAt}
            onChange={handle("registeredAt")}
          />
          <InputForms
            label="E-mail"
            placeholder="empresa@mail.com"
            value={data.email}
            onChange={handle("email")}
          />
          <InputForms
            label="Teléfono"
            placeholder="+54 11 8888-5555"
            value={data.phone}
            onChange={handle("phone")}
          />
          <InputForms
            label="Observaciones"
            placeholder="Notas internas"
            value={data.notes}
            onChange={handle("notes")}
          />

          {/* acciones */}
          <div className="mt-6 flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#635BFF] text-white px-6 py-2 rounded-md font-medium hover:bg-[#574ae2] transition"
            >
              {saving ? "Guardando…" : "Guardar"}
            </Button>
            <Link href="/companies/table">
              <Button variant="ghost" className="text-gray-600 hover:text-black">
                Cancelar
              </Button>
            </Link>
          </div>
        </Form>
    </AuthLayout>
  );
};

export default EditCompany;
