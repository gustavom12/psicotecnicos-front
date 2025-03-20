import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
} from "@heroui/react";

const rows = [
    {
        key: "1",
        company: "Toyota",
        sector: "Automovilístico",
        interviewed: "400",
        contact: "Martín González",
        email: "contacto@empresa.com.ar"
    },
    {
        key: "2",
        company: "Arcor",
        sector: "Automovilístico",
        interviewed: "400",
        contact: "Martín González",
        email: "contacto@empresa.com.ar"
    },
    {
        key: "3",
        company: "Mercado Libre",
        sector: "Automovilístico",
        interviewed: "400",
        contact: "Martín González",
        email: "contacto@empresa.com.ar"
    },
    {
        key: "4",
        company: "Accenture",
        sector: "Automovilístico",
        interviewed: "400",
        contact: "Martín González",
        email: "contacto@empresa.com.ar"
    },
    {
        key: "5",
        company: "Techint",
        sector: "Automovilístico",
        interviewed: "400",
        contact: "Martín González",
        email: "contacto@empresa.com.ar"
    },
    {
        key: "5",
        company: "Quilmes",
        sector: "Automovilístico",
        interviewed: "400",
        contact: "Martín González",
        email: "contacto@empresa.com.ar"
    },
];

const columns = [
    {
        key: "company",
        label: "Empresa",
    },
    {
        key: "sector",
        label: "Sector",
    },
    {
        key: "interviewed",
        label: "Entrevistados",
    },
    {
        key: "contact",
        label: "Contacto",
    },
    {
        key: "email",
        label: "Email",
    }, {
        key: "icons",
        label: "",
    }
];

export default function Tables() {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["2"]));

    return (


        <Table
            aria-label="Controlled table example with dynamic content"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            onSelectionChange={setSelectedKeys}
        >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
                {(item) => (
                    <TableRow key={item.key}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}