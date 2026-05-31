import React, { useEffect, useState } from "react";
import apiConnection from "@/pages/api/api";
import { Select, SelectItem } from "@heroui/react";

interface Company {
  _id: string;
  name?: string;
  sector?: string;
  location?: string;
}

interface Props {
  value?: string;
  onChange(companyId: string): void;
}

const CompanySelector: React.FC<Props> = ({ value, onChange }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const { data } = await apiConnection.get("/companies/filtered");
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        setCompanies(list);
      } catch (error) {
        console.error("Error loading companies:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const selected = companies.find((c) => c._id === value);

  return (
    <div className="w-full">
      <h3 className="mb-2 font-semibold">Empresa</h3>
      <Select
        radius="sm"
        placeholder={
          loading
            ? "Cargando empresas..."
            : companies.length === 0
              ? "No hay empresas disponibles"
              : "Selecciona una empresa…"
        }
        className="w-full"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;
          if (selectedKey) onChange(selectedKey);
        }}
        isDisabled={loading || companies.length === 0}
        renderValue={(items) => {
          if (items.length === 0) return null;
          const c = companies.find((x) => x._id === items[0].key);
          return c?.name ?? null;
        }}
      >
        {companies.map((c) => (
          <SelectItem key={c._id} textValue={c.name ?? c._id}>
            <div className="flex flex-col">
              <span className="font-medium">{c.name ?? "(sin nombre)"}</span>
              {(c.sector || c.location) && (
                <span className="text-sm text-gray-500">
                  {[c.sector, c.location].filter(Boolean).join(" · ")}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </Select>

      {selected && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-800">{selected.name}</p>
          {(selected.sector || selected.location) && (
            <p className="text-xs text-gray-600">
              {[selected.sector, selected.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
