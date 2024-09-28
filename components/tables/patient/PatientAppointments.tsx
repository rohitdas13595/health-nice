"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { Input } from "@/components/ui/input";

export const PatientAppointments = () => {
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<any | undefined>[] = [
    {
      accessorKey: "patientId",
      header: "Patient",
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "doctorId",
      header: "Doctor",
    },

    {
      accessorKey: "select",
      header: "Actions",
      
      cell: ({ row }) => (
        <Link href={`/forms/${row.original && row.original.id}/view`}>
          <Button className="shad-primary-btn ">Enter Admin Panel</Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      <div className="flex w-full  justify-end gap-4 my-4">
        <div>
          <Input placeholder="Search appointments" />
        </div>
        <div>
          <Button className="shad-primary-btn ">Add Appointment</Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={[
          {
            id: 1,
            patientId: "1",
            date: "2022-03-01",
            status: "Pending",
            doctorId: "1",
          },

          {
            id: 2,
            patientId: "2",
            date: "2022-03-01",
            status: "Confirmed",
            doctorId: "2",
          },

          {
            id: 3,
            patientId: "3",
            date: "2022-03-01",
            status: "Completed",
            doctorId: "3",
          },

          {
            id: 4,
            patientId: "4",
            date: "2022-03-01",
            status: "Cancelled",
            doctorId: "4",
          },

          {
            id: 5,
            patientId: "5",
            date: "2022-03-01",
            status: "Pending",
            doctorId: "5",
          },
        ]}
        pagination={pagination}
        setPagination={setpagination}
        rowCount={5}
      />
    </>
  );
};
