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
    <div className="flex w-full pb-10">
      <MenuLeft />
      <div className="ml-10 mr-10 w-full">
        <NavbarApp />

        {/* header */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#D4D4D8]"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-[22px] font-bold">
            {id ? data.name || "Empresa" : "Nueva empresa"}
          </h1>
        </div>

        {/* pasos */}
        <ButtonGroup className="mt-10 mb-6 h-[36px] w-[340px] rounded-xl bg-[#F4F4F5] text-[14px] text-[#71717A]">
          <Button className="h-[28px] rounded-sm bg-white">Información</Button>
          <Button className="h-[28px] bg-[#F4F4F5] text-[#71717A]">
            Entrevistados
          </Button>
          <Button className="h-[28px] bg-[#F4F4F5] text-[#71717A]">
            Entrevistas
          </Button>
        </ButtonGroup>

        <hr />

        {/* logo */}
        <div className="mt-8 flex items-start gap-4">
          <div className="h-[100px] w-[100px] overflow-hidden rounded-full border" />
          <div>
            <div className="mt-7 flex gap-2">
              <ButtonSubmitPhoto />
              <ButtonDelete />
            </div>
            <p className="ml-1 mt-1 w-[220px] text-[12px] font-light text-[#A1A1AA]">
              La imagen será visible dentro de la plataforma.
            </p>
          </div>
        </div>

        {/* formulario */}
        <Form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <InputForms
            label="Nombre"
            placeholder="Toyota"
            required
            value={data.name}
            onChange={handle("name")}
          />
          <InputForms
            label="Estado"
            placeholder="Activo"
            required
            value={data.status}
            onChange={handle("status")}
          />
          <InputForms
            label="Sector"
            placeholder="Automovilístico"
            required
            value={data.industry}
            onChange={handle("industry")}
          />
          <InputForms
            label="Ubicación"
            placeholder="Córdoba, Argentina"
            required
            value={data.location}
            onChange={handle("location")}
          />
          <InputForms
            label="Fecha de registro"
            placeholder="23/07/2023"
            value={data.registeredAt}
            onChange={handle("registeredAt")}
          />
          {/*<InputForms
            label="Responsable"
            placeholder="José González"
            value={data.manager}
            onChange={handle("manager")}
          />*/}
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
          <div className="mt-6 flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#635BFF] text-white"
            >
              {saving ? "Guardando…" : "Guardar"}
            </Button>
            <Link href="/companies/table">
              <Button>Cancelar</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditCompany;
