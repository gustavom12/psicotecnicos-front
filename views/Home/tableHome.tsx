// import React, { useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   getKeyValue,
// } from "@heroui/react";

// import Pencil2 from "@/public/icons/pencil2";
// import Document from "@/public/icons/document";
// import Trash from "@/public/icons/trashgrey";

// const rows = [
//   {
//     key: "1",
//     nombre: "Arcor 2024 - Postulantes Junior Operario",
//     empresa: "Arcor",
//     creador: "Natalia Rodríguez",
//     modulos: "5",
//   },
//   {
//     key: "2",
//     nombre: "Arcor 2024 - Postulantes Junior Operario",
//     empresa: "Arcor",
//     creador: "Natalia Rodríguez",
//     modulos: "5",
//   },
//   {
//     key: "3",
//     nombre: "Arcor 2024 - Postulantes Junior Operario",
//     empresa: "Arcor",
//     creador: "Natalia Rodríguez",
//     modulos: "5",
//   },
//   {
//     key: "4",
//     nombre: "Arcor 2024 - Postulantes Junior Operario",
//     empresa: "Arcor",
//     creador: "Natalia Rodríguez",
//     modulos: "5",
//   },
//   {
//     key: "5",
//     nombre: "Arcor 2024 - Postulantes Junior Operario",
//     empresa: "Arcor",
//     creador: "Natalia Rodríguez",
//     modulos: "5",
//   },
//   {
//     key: "6",
//     nombre: "Arcor 2024 - Postulantes Junior Operario",
//     empresa: "Arcor",
//     creador: "Natalia Rodríguez",
//     modulos: "5",
//   },
// ];


// const columns = [
//   {
//     key: "nombre",
//     label: "Nombre",
//   },
//   {
//     key: "empresa",
//     label: "Empresa",
//   },
//   {
//     key: "creador",
//     label: "Creador",
//   },
//   {
//     key: "modulos",
//     label: "Modulos",
//   },
//   {
//     key: "actions",
//     label: "",
//   },
// ];


// const TableHome = () => {
//   const [selectedKeys, setSelectedKeys] = useState(new Set([]));
//   return (
//     <Table
//       aria-label="Tabla de entrevistas"
//       // selectedKeys={selectedKeys}
//       selectionMode="multiple"
//       className="shadow-none border border-none "
//       isStriped={true}
//       isCompact={true}
//       // onSelectionChange={setSelectedKeys}
//       // className="shadow-none border-none "
//       // style={{ border: "none", boxShadow: "none", borderBlock: "none"}}
//       // classNames={{ table: "border-none shadow-none rounded-none " }}
//     >
//       <TableHeader columns={columns} className="checkbox-hidden ">
//         {(column) => <TableColumn className="text-[14px] " key={column.key}>{column.label}</TableColumn>}
//       </TableHeader>
//       <TableBody items={rows}>
//         {(item) => (
//           <TableRow key={item.key} className="mt-4 ">
//             {(columnKey) => (
//               <TableCell>
//                 {columnKey === "actions" ? (
//                   <div className="flex gap-2">
//                     <button className="text-blue-500 hover:text-blue-700">
//                       <Pencil2 />
//                     </button>
//                     <button className="text-blue-500 hover:text-blue-700">
//                       <Document />
//                     </button>
//                     <button className="text-red-500 hover:text-red-700">
//                       <Trash />
//                     </button>
//                   </div>
//                 ) : (
//                   getKeyValue(item, columnKey)
//                 )}
//               </TableCell>
//             )}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }


// export default TableHome;
