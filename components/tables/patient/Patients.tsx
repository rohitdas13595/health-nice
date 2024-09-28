"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getPatientList } from "@/lib/actions/patient.actions";
import dayjs from "dayjs";

export const Patients = () => {
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [query, setQuery] = useState<string | undefined>("");

  const columns: ColumnDef<any | undefined>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },

    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",

      cell: ({ row }) => {
        return dayjs(row.original?.createdAt).format("MMM DD, YYYY, hh:mm A");
      },
    },
  ];

  const { data: patients, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients", pagination.pageIndex, pagination.pageSize, query],
    queryFn: async () =>
      await getPatientList({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        query,
      }),
    enabled: true,
    staleTime: 1000 ,
  });

  return (
    <>
      <div className="flex w-full  justify-end gap-4 my-4">
        <div>
          <Input placeholder="Search users" onChange={(e) => setQuery(e.target.value)} value={query} />
        </div>
        <div>
          <Button className="shad-primary-btn ">Add Appointment</Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={patients?.data || []}
        pagination={pagination}
        setPagination={setpagination}
        rowCount={5}
      />
    </>
  );
};
