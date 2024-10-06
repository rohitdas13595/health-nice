"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getApp } from "firebase/app";
import { getAppointmentList } from "@/lib/actions/appointment.action";
import dayjs from "dayjs";

export const PatientAppointments = ({userId}: {userId?: string}) => {
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<any | undefined>[] = [
    
    {
      accessorKey: "time",
      header: "Time",

      cell: ({ row }) => {
        return dayjs(row.original?.time).format("MMM DD, YYYY, hh:mm A");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "doctorId",
      header: "Doctor",
    },

    // {
    //   accessorKey: "select",
    //   header: "Actions",
      
    //   cell: ({ row }) => (
    //     <Link href={`/forms/${row.original && row.original.id}/view`}>
    //       <Button className="shad-primary-btn ">Enter Admin Panel</Button>
    //     </Link>
    //   ),
    // },
  ];

  const { data: appointments, isLoading: isLoading, refetch } = useQuery({
    queryKey: ["appointments", pagination.pageIndex, pagination.pageSize],
    queryFn: async () =>
      await getAppointmentList({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        patientId: userId,
      }),
    enabled: true,
    staleTime: 1000,
  });

  return (
    <>
      <div className="flex w-full  justify-end gap-4 my-4">
        {/* <div>
          <Input placeholder="Search appointments" />
        </div>
        <div>
          <Button className="shad-primary-btn ">Add Appointment</Button>
        </div> */}
      </div>
      <DataTable
        columns={columns}
        data={appointments && appointments.data ? appointments.data : []}
        pagination={pagination}
        setPagination={setpagination}
        rowCount={5}
      />
    </>
  );
};
